const socket = io();

const welcomeRoom = document.querySelector('#roomContainer');
const roomForm = welcomeRoom.querySelector('#roomForm');
const roomInput = roomForm.querySelector('#roomInput');

const handleRoomSubmit = (e) => {
  e.preventDefault();
  socket.emit('enterRoom', { payload: roomInput.value }, () => {
    console.log('Callback From Server');
  });
  roomInput.value = '';
};
roomForm.addEventListener('submit', handleRoomSubmit);
