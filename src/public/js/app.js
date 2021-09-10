const socket = io();

const roomContainer = document.querySelector('#roomContainer');
const roomForm = document.querySelector('#roomForm');
const call = document.querySelector('#call');
const myFace = document.querySelector('#myFace');
const audioBtn = document.querySelector('#audioSwitch');
const videoBtn = document.querySelector('#videoSwitch');
const cameraSelect = document.querySelector('#cameras');

//===============ROOMS==============================//
call.hidden = true;

let roomName;

const handleRoomSubmit = async (e) => {
  e.preventDefault();
  const roomInput = document.querySelector('#roomInput');
  await startMediaDevices();
  socket.emit('join_room', roomInput.value);
  roomName = roomInput.value;
  roomInput.value = '';
};

const startMediaDevices = async () => {
  roomContainer.hidden = true;
  call.hidden = false;
  await getMedia();
  RTCSignaling();
};

socket.on('welcome', async () => {
  console.log(`someone joined`);
  const offer = await peerConnection.createOffer();
  peerConnection.setLocalDescription(offer);
  socket.emit('offer', offer, roomName);
  await console.log('sent offer');
});

socket.on('offer', async (offer) => {
  console.log('received offer');
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

let peerConnection;

const RTCSignaling = () => {
  peerConnection = new RTCPeerConnection();
  peerConnection.addEventListener('icecandidate', handleICECandidate);
  peerConnection.addEventListener('addstream', handleAddStream);
  myStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, myStream);
  });
};

const handleICECandidate = (data) => {
  console.log('received ICE Candidate');
  console.log(data);
  socket.emit('ice', data.candidate, roomName);
};

const handleAddStream = (data) => {
  const yourFace = document.querySelector('#yourFace');
  yourFace.srcObject = data.stream;
};

//=================CAMERA===============================//

let myStream;
let audioOff = false;
let videoOff = false;

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
    myStream = await navigator.mediaDevices.getUserMedia(
      selectedCamera ? newConstrain : initialConstrain
    );
    myFace.srcObject = myStream;
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

const handleCameraChange = () => {
  getMedia(cameraSelect.value);
  getDevices(cameraSelect.value);
};

roomForm.addEventListener('submit', handleRoomSubmit);
audioBtn.addEventListener('click', handleAudioOnOff);
videoBtn.addEventListener('click', handleVideoOnOff);
cameraSelect.addEventListener('change', handleCameraChange);
getDevices();
