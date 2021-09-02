const socket = io();

const roomContainer = document.querySelector('#roomContainer');
const roomForm = roomContainer.querySelector('#roomForm');
const roomInput = roomForm.querySelector('#roomInput');
const msgContainer = document.querySelector('#msgContainer');
const msgForm = msgContainer.querySelector('#msgForm');
const msgInput = msgForm.querySelector('#msgInput');
const nickContainer = document.querySelector('#nickContainer');
const nickForm = document.querySelector('#nickForm');
const nickInput = document.querySelector('#nickInput');
const chatUl = document.querySelector('#chatUl');
roomContainer.hidden = true;
msgContainer.hidden = true;

let roomName;
let nickName = 'anonymous';

const showRoom = (nick) => {
  nickName = nick;
  nickContainer.hidden = true;
  roomContainer.hidden = false;
  const welcomeNick = document.createElement('h3');
  welcomeNick.innerHTML = `👲 Welcome ${nickName}! Join the room`;
  roomContainer.prepend(welcomeNick);
  roomInput.focus();
  roomForm.addEventListener('submit', handleRoomSubmit);
};

const showMsg = (nickName, roomName) => {
  roomContainer.hidden = true;
  msgContainer.hidden = false;
  const roomTitle = document.createElement('h3');
  roomTitle.innerHTML = `${nickName} is Joining in [${roomName}] room`;
  msgContainer.prepend(roomTitle);
  msgForm.addEventListener('submit', handleMsgSubmit);
};

const handleNickSubmit = (e) => {
  e.preventDefault();
  socket.emit('makeNick', nickInput.value, showRoom);
  nickName = nickInput.value;
  nickInput.value = '';
};

const handleRoomSubmit = (e) => {
  e.preventDefault();
  socket.emit('enterRoom', roomInput.value, showMsg);
  roomName = roomInput.value;
  roomInput.value = '';
};

const addMessage = (msg) => {
  const li = document.createElement('li');
  li.innerHTML = `${msg}`;
  chatUl.append(li);
};

const handleMsgSubmit = (e) => {
  e.preventDefault();
  const message = msgInput.value;
  socket.emit('sendMessage', msgInput.value, nickName, roomName, () => {
    addMessage(`${nickName}: ${message}`);
  });
  msgInput.value = '';
};

socket.on('welcomeRoom', (msg) => {
  addMessage(`🙋‍♀️ ${msg} Joined`);
});

socket.on('byeRoom', (msg) => {
  addMessage(`🧏‍♂️ ${msg} left`);
});

socket.on('newMessage', (msg, nickName) => {
  addMessage(`${nickName}: ${msg}`);
});

nickForm.addEventListener('submit', handleNickSubmit);
