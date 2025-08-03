// Enhanced Chatify WebSocket Server with Boards and Friend System
const WebSocket = require('ws');

const PORT = 8081;
const wss = new WebSocket.Server({ port: PORT });

const usernames = [
  'BlueFox', 'GreenTiger', 'RedWolf', 'YellowLion', 'PurpleBear',
  'OrangeEagle', 'SilverOtter', 'AquaShark', 'PinkPanda', 'GoldHawk'
];

function getRandomUsername() {
  return usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000);
}

// === Data Structures ===
const boards = {}; // { boardName: { messages: [], users: Set<WebSocket> } }
const usersOnline = new Map(); // username => ws
const friends = new Map(); // username => Set<username>

// === Utilities ===
function broadcastToBoard(boardName, type, data) {
  const board = boards[boardName];
  if (!board) return;
  board.users.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, ...data }));
    }
  });
}

function addFriend(user1, user2) {
  if (!friends.has(user1)) friends.set(user1, new Set());
  if (!friends.has(user2)) friends.set(user2, new Set());
  friends.get(user1).add(user2);
  friends.get(user2).add(user1);
}

// === Connection Handler ===
wss.on('connection', (ws) => {
  ws.username = getRandomUsername();
  ws.board = null;
  usersOnline.set(ws.username, ws);
  console.log(`${ws.username} connected`);

  ws.send(JSON.stringify({ type: 'welcome', username: ws.username }));

  ws.on('message', (rawMsg) => {
    let data;
    try {
      data = JSON.parse(rawMsg);
    } catch {
      console.error('Invalid message format');
      return;
    }

    // === Join Board ===
    if (data.type === 'join-board') {
      const boardName = data.board;
      if (!boards[boardName]) {
        boards[boardName] = { messages: [], users: new Set() };
      }

      if (ws.board) boards[ws.board].users.delete(ws); // Leave previous board
      ws.board = boardName;
      boards[boardName].users.add(ws);

      ws.send(JSON.stringify({
        type: 'board-joined',
        board: boardName,
        messages: boards[boardName].messages,
      }));
      return;
    }

    // === Chat Message in Board ===
    if (data.type === 'message' && ws.board) {
      // Accept new structure: data.message = { user, text }
      let msgObj;
      if (data.message && typeof data.message === 'object') {
        msgObj = { user: data.message.user || ws.username, text: data.message.text };
      } else {
        // fallback for old structure
        msgObj = { user: ws.username, text: data.text };
      }
      const board = boards[ws.board];

      board.messages.push(msgObj);
      if (board.messages.length > 100) board.messages.shift();

      broadcastToBoard(ws.board, 'message', { message: msgObj });

      // === ChatBot Replies ===
      const text = msgObj.text.toLowerCase();
      let botReply = null;

      if (text.includes('hello') || text.includes('hi')) {
        botReply = 'Hello! How can I help you today?';
      } else if (text.includes('help')) {
        botReply = 'I am ChatBot. You can ask me about this chat or say hello!';
      } else if (text.includes('bye')) {
        botReply = 'Goodbye! Have a great day!';
      }

      if (botReply) {
        const botMsg = { user: 'ChatBot', text: botReply };
        board.messages.push(botMsg);
        if (board.messages.length > 100) board.messages.shift();
        broadcastToBoard(ws.board, 'message', { message: botMsg });
      }

      return;
    }

    // === Friend Request ===
    if (data.type === 'friend-request') {
      const toUser = data.to;
      if (usersOnline.has(toUser)) {
        const toWS = usersOnline.get(toUser);
        toWS.send(JSON.stringify({
          type: 'friend-request',
          from: ws.username
        }));
      }
      return;
    }

    // === Friend Accept ===
    if (data.type === 'friend-accept') {
      const userToAccept = data.user;
      addFriend(ws.username, userToAccept);

      if (usersOnline.has(userToAccept)) {
        usersOnline.get(userToAccept).send(JSON.stringify({
          type: 'friend-accepted',
          user: ws.username
        }));
      }
      return;
    }

  }); // end of message handler

  // === Clean up on Disconnect ===
  ws.on('close', () => {
    console.log(`${ws.username} disconnected`);
    usersOnline.delete(ws.username);
    if (ws.board && boards[ws.board]) {
      boards[ws.board].users.delete(ws);
    }
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
