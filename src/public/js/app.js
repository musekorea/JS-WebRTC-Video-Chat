const socket = io();

const myFace = document.querySelector('#myFace');
const audioBtn = document.querySelector('#audioSwitch');
const videoBtn = document.querySelector('#videoSwitch');
const cameraSelect = document.querySelector('#cameras');

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
        if (selectedCamera == camera.value) {
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

audioBtn.addEventListener('click', handleAudioOnOff);
videoBtn.addEventListener('click', handleVideoOnOff);
cameraSelect.addEventListener('input', handleCameraChange);

getMedia();
getDevices();
