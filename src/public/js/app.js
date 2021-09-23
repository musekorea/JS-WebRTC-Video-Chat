import '../scss/temp.css';
import 'regenerator-runtime';

const socket = io();

const roomContainer = document.querySelector('#roomContainer');
const roomForm = document.querySelector('#roomForm');
const roomInput = document.querySelector('#roomInput');
const call = document.querySelector('#call');
const myFace = document.querySelector('#myFace');
const audioBtn = document.querySelector('#audioSwitch');
const videoBtn = document.querySelector('#videoSwitch');
const cameraSelect = document.querySelector('#cameras');
const chatContainer = document.querySelector('#chatContainer');
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');
const ul = document.querySelector('ul');

//===============ROOMS==============================//
call.style.display = 'none';
chatContainer.style.display = 'none';
roomInput.focus();

let roomName;
let peerConnection;
let dataChannel;
let myStream;
let audioOff = false;
let videoOff = false;

const handleRoomSubmit = async (e) => {
  e.preventDefault();
  await startMediaDevices();
  socket.emit('join_room', roomInput.value);
  roomName = roomInput.value;
  roomInput.value = '';
};

const startMediaDevices = async () => {
  roomContainer.remove();
  call.style.display = 'block';
  chatContainer.style.display = 'block';
  chatInput.focus();
  await getMedia();
  RTCSignaling();
};

socket.on('welcome', async () => {
  console.log(`someone joined`);
  dataChannel = peerConnection.createDataChannel('chat');
  dataChannel.addEventListener('message', (e) => {
    const li = document.createElement('li');
    li.className = 'you';
    li.innerHTML = `you : ${e.data}`;
    ul.append(li);
  });
  console.log('Made data channel');
  const offer = await peerConnection.createOffer();
  peerConnection.setLocalDescription(offer);
  socket.emit('offer', offer, roomName);
  console.log('sent offer');
});

socket.on('offer', async (offer) => {
  console.log('received offer');
  peerConnection.addEventListener('datachannel', (e) => {
    dataChannel = e.channel;
    dataChannel.addEventListener('message', (e) => {
      console.log(e.data);
      const li = document.createElement('li');
      li.className = 'you';
      li.innerHTML = `you : ${e.data}`;
      ul.append(li);
    });
  });
  peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  peerConnection.setLocalDescription(answer);
  socket.emit('answer', answer, roomName);
  console.log('sent answer');
});
socket.on('answer', (answer) => {
  console.log('received answer');
  peerConnection.setRemoteDescription(answer);
});
socket.on('ice', (ice) => {
  console.log('received candidate from Server');
  peerConnection.addIceCandidate(ice);
});

//===============WEB RTC=====================///

const RTCSignaling = async () => {
  peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
  });
  peerConnection.addEventListener('icecandidate', handleICECandidate);
  peerConnection.addEventListener('addstream', handleAddStream);
  await myStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, myStream);
  });
};

const handleICECandidate = (data) => {
  console.log('received ICE Candidate');
  socket.emit('ice', data.candidate, roomName);
};

const handleAddStream = (data) => {
  const yourFace = document.querySelector('#yourFace');
  yourFace.srcObject = data.stream;
};

//=================CAMERA===============================//

const getDevices = async (selectedCamera) => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => {
      return device.kind === 'videoinput';
    });
    if (selectedCamera) {
      document.querySelectorAll('option').forEach((camera) => {
        console.log(selectedCamera, camera.value, camera.selected);
        if (selectedCamera == camera.value) {
          camera.selected = true;
        } else {
          camera.selected = false;
        }
      });
      return;
    }
    cameras.forEach((camera) => {
      const cameraOption = document.createElement('option');
      cameraOption.value = camera.deviceId;
      cameraOption.innerHTML = camera.label;
      cameraSelect.append(cameraOption);
    });
  } catch (error) {
    console.log(error);
  }
};

const getMedia = async (selectedCamera) => {
  const initialConstrain = {
    audio: true,
    video: { facingMode: 'user' ? 'user' : true },
  };
  const newConstrain = {
    audio: true,
    video: { deviceId: selectedCamera },
  };
  try {
    if (navigator.getUserMedia) {
      await navigator.mediaDevices.getUserMedia(
        selectedCamera ? newConstrain : initialConstrain
      );
      myFace.srcObject = myStream;
    }
  } catch (e) {
    console.log(e);
  }
};

const handleAudioOnOff = () => {
  myStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (audioOff === false) {
    audioBtn.innerHTML = `Audio On`;
    audioOff = true;
  } else {
    audioBtn.innerHTML = `Audio Off`;
    audioOff = false;
  }
};
const handleVideoOnOff = () => {
  myStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (videoOff === false) {
    videoBtn.innerHTML = `Video On`;
    videoOff = true;
  } else {
    videoBtn.innerHTML = `Video Off`;
    videoOff = false;
  }
};

const handleCameraChange = async () => {
  await getMedia(cameraSelect.value);
  await getDevices(cameraSelect.value);
  const devices = peerConnection.getSenders();
  const myAudioTrack = await myStream.getAudioTracks()[0];
  const myVideoTrack = await myStream.getVideoTracks()[0];
  devices.forEach((device) => {
    if (device.track.kind == 'audio') {
      device.replaceTrack(myAudioTrack);
    } else {
      device.replaceTrack(myVideoTrack);
    }
  });
};
//==========CHAT==================//

const handleChatSubmit = (e) => {
  e.preventDefault();
  chatInput.focus();
  dataChannel.send(chatInput.value);
  const li = document.createElement('li');
  li.className = 'me';
  li.innerHTML = `me : ${chatInput.value}`;
  ul.append(li);
  chatInput.value = '';
};
const checkScroll = () => {
  chatContainer.scrollTop = chatContainer.scrollHeight;
};
chatForm.addEventListener('keydown', () => {
  checkScroll();
});
chatForm.addEventListener('keyup', () => {
  checkScroll();
});

//==========EVENT=================//
roomForm.addEventListener('submit', handleRoomSubmit);
chatForm.addEventListener('submit', handleChatSubmit);
audioBtn.addEventListener('click', handleAudioOnOff);
videoBtn.addEventListener('click', handleVideoOnOff);
cameraSelect.addEventListener('change', handleCameraChange);
getDevices();
