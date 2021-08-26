const messageList = document.querySelector('ul');
const nicknameForm = document.querySelector('#nicknameForm');
const nicknameInput = document.querySelector('#nicknameInput');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#messageInput');
const messageBtn = document.querySelector('button');

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
  console.log(`WebSocket is Connected to the Server💚`);
});

const paintMessage = (message) => {
  const li = document.createElement('li');
  li.innerHTML = message.data;
  messageList.append(li);
};

socket.addEventListener('message', async (message) => {
  console.log(`message from server`, message.data);
  paintMessage(message);
});

socket.addEventListener('close', () => {
  console.log(`WebSocket is disconnected from the Server💢`);
});

const handleNickSubmit = (e) => {
  e.preventDefault();
  socket.send(
    JSON.stringify({ type: 'nickname', payload: nicknameInput.value })
  );
};

const handleMessageSubmit = (e) => {
  e.preventDefault();
  socket.send(JSON.stringify({ type: 'message', payload: messageInput.value }));
  messageInput.value = '';
};

nicknameForm.addEventListener('submit', handleNickSubmit);
messageForm.addEventListener('submit', handleMessageSubmit);
