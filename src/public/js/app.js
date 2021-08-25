const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');
const messageInput = document.querySelector('input');
const messageBtn = document.querySelector('button');

const socket = new WebSocket(`ws://${window.location.host}`);
messageInput.focus();

socket.addEventListener('open', () => {
  console.log(`WebSocket is Connected to the Server💚`);
});

socket.addEventListener('message', async (message) => {
  if (typeof message.data === 'string') {
    console.log(`New message :`, message.data);
  } else {
    const messageText = await message.data.text();
    console.log(messageText);
  }
});

socket.addEventListener('close', () => {
  console.log(`WebSocket is disconnected from the Server💢`);
});

const handleSubmit = (e) => {
  messageInput.focus();
  e.preventDefault();
  socket.send(messageInput.value);
  messageInput.value = '';
};

messageForm.addEventListener('submit', handleSubmit);
