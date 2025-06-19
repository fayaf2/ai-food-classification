const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');
const switchBtn = document.getElementById('switchBtn');

let currentFacingMode = 'user'; // 'user' for front, 'environment' for back
let currentStream;

// Start the camera with the selected facing mode
function startCamera(facingMode = 'user') {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
    })
    .then(stream => {
        currentStream = stream;
        video.srcObject = stream;
    })
    .catch(err => {
        result.innerText = "Cannot access camera.";
        console.error(err);
    });
}

// Switch between front and back camera
switchBtn.addEventListener('click', () => {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    startCamera(currentFacingMode);
});

// Capture the image and send it to server
function capture() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const image = canvas.toDataURL('image/jpeg');

    fetch('/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image })
    })
    .then(res => res.json())
    .then(data => {
        result.innerText = data.message;
    })
    .catch(err => {
        result.innerText = "Error uploading image.";
        console.error(err);
    });
}

// Initial camera start
startCamera(currentFacingMode);

// Optional: Add some dynamic styling (consider moving to CSS)
document.body.style.fontFamily = 'Arial, sans-serif';
switchBtn.style.padding = '10px 20px';
switchBtn.style.margin = '10px';
switchBtn.style.borderRadius = '5px';
switchBtn.style.border = 'none';
switchBtn.style.backgroundColor = '#007bff';
switchBtn.style.color = 'white';
switchBtn.style.cursor = 'pointer';

result.style.marginTop = '10px';
