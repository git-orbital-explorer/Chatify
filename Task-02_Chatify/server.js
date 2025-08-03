// Simple Node.js WebSocket server for Chatify
const WebSocket = require('ws');

const PORT = 8081;
const wss = new WebSocket.Server({ port: PORT });

let messageHistory = [];
const usernames = [
  'BlueFox', 'GreenTiger', 'RedWolf', 'YellowLion', 'PurpleBear', 'OrangeEagle', 'SilverOtter', 'AquaShark', 'PinkPanda', 'GoldHawk'
];
function getRandomUsername() {
  return usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000);
}

wss.on('connection', (ws) => {
  ws.username = getRandomUsername();
  ws.send(JSON.stringify({ type: 'history', messages: messageHistory, username: ws.username }));

  ws.on('message', (rawMsg) => {
    let data;
    try {
      data = JSON.parse(rawMsg);
    } catch {
      return;
    }
    if (data.type === 'message' && data.message) {
      const msgObj = { user: ws.username, text: data.message.text };
      messageHistory.push(msgObj);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', message: msgObj }));
        }
      });

      // Simple chatbot logic
      const lowerMsg = (data.message.text || '').toLowerCase();
      let botReply = null;
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        botReply = 'Hello! How can I help you today?';
      } else if (lowerMsg.includes('help')) {
        botReply = 'I am ChatBot. You can ask me about this chat or say hello!';
      } else if (lowerMsg.includes('bye')) {
        botReply = 'Goodbye! Have a great day!';
      }
      if (botReply) {
        const botMsg = { user: 'ChatBot', text: botReply };
        messageHistory.push(botMsg);
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message', message: botMsg }));
          }
        });
      }
    }
  });
});




console.log(`WebSocket server running on ws://localhost:${PORT}`);
