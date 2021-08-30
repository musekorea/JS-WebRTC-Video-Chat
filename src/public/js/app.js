const socket = io();

const roomContainer = document.querySelector('#roomContainer');
const roomForm = roomContainer.querySelector('#roomForm');
const roomInput = roomForm.querySelector('#roomInput');
const msgContainer = document.querySelector('#msgContainer');
const msgForm = msgContainer.querySelector('#msgForm');
const msgInput = msgForm.querySelector('#msgInput');
msgContainer.hidden = true;
let roomName;

const hideRoom = () => {
  roomContainer.hidden = true;
  msgContainer.hidden = false;
  const roomTitle = document.createElement('h3');
  roomTitle.innerHTML = `Joining in [${roomName}] room`;
  msgContainer.prepend(roomTitle);
};

const handleRoomSubmit = (e) => {
  e.preventDefault();
  socket.emit('enterRoom', roomInput.value, hideRoom);
  roomName = roomInput.value;
  roomInput.value = '';
};
roomForm.addEventListener('submit', handleRoomSubmit);
