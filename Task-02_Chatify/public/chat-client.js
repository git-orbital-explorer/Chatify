const chatRoom = document.getElementById('chatRoom');
const sendBtn = document.querySelector('.send-btn');
const messageInput = document.querySelector('.message-input');
const boardSelect = document.getElementById('boardSelect');

// 🎲 Username logic
const names = ['Apple', 'Banana', 'Tiger', 'Wolf', 'Koala', 'Falcon'];
const username = names[Math.floor(Math.random() * names.length)] + '#' + Math.floor(100 + Math.random() * 900);

// 🌐 Connect to WebSocket
const ws = new WebSocket('ws://localhost:8081');

// Track current board
let currentBoard = boardSelect.value;

ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'join-board', board: currentBoard }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'welcome') {
    console.log('Connected as:', data.username);
  }

  if (data.type === 'board-joined') {
    chatRoom.innerHTML = '';
    data.messages.forEach(msg => addMessage(msg.user, msg.text));
  }

  if (data.type === 'message') {
    addMessage(data.message.user, data.message.text);
  }
};

function addMessage(user, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-bubble');

  if (user === username) {
    msgDiv.classList.add('sent');
    msgDiv.innerHTML = `<strong>${user} (you):</strong> ${text}`;
  } else {
    msgDiv.classList.add('received');
    msgDiv.innerHTML = `<strong>${user}:</strong> ${text}`;
  }

  chatRoom.appendChild(msgDiv);
  chatRoom.scrollTop = chatRoom.scrollHeight;
}

function sendMessage() {
  const text = messageInput.value.trim();
  if (text && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'message', message: { user: username, text } }));
    messageInput.value = '';
  }
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

// 🔄 Switch boards
boardSelect.addEventListener('change', () => {
  const selectedBoard = boardSelect.value;
  if (selectedBoard !== currentBoard) {
    currentBoard = selectedBoard;
    chatRoom.innerHTML = `<p>Switching to #${selectedBoard}...</p>`;
    ws.send(JSON.stringify({ type: 'join-board', board: selectedBoard }));
  }
});

// ⬆️⬇️ Scroll buttons
document.getElementById('scrollUp').addEventListener('click', () => {
  chatRoom.scrollBy({ top: -100, behavior: 'smooth' });
});

document.getElementById('scrollDown').addEventListener('click', () => {
  chatRoom.scrollBy({ top: 100, behavior: 'smooth' });
});
