// Get DOM elements
const colorpicker = document.getElementById('colorpicker');
const canvaColor = document.getElementById('canvaColor');
const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');
const clearbutton = document.getElementById('clearbutton');
const savebutton = document.getElementById('savebutton');
const retrivebutton = document.getElementById('retrivebutton');
const fontpicker = document.getElementById('fontpicker');
const modeSelector = document.getElementById('modeSelector');
const modeToggle = document.getElementById('modeToggle');
const body = document.body;

// Default drawing settings
let drawing = false;
let color = '#000000'; // Default text color
let fontSize = 5; // Default font size
let currentMode = 'draw'; // Default mode is 'draw'
let eraserSize = 20; // Size of eraser when in erase mode

// Set canvas background color
canvaColor.addEventListener('input', (e) => {
    canvas.style.backgroundColor = e.target.value;
});

// Handle text color change
colorpicker.addEventListener('input', (e) => {
    color = e.target.value;
});

// Set font size for the signature
fontpicker.addEventListener('change', (e) => {
    fontSize = parseInt(e.target.value);
});

// Switch between drawing and erasing mode
modeSelector.addEventListener('change', (e) => {
    currentMode = e.target.value;
});

// Toggle between Dark and Light Mode
modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    canvas.classList.toggle('dark-mode');
    modeToggle.classList.toggle('button-dark');
    modeToggle.innerText = body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// Mouse events to handle drawing and erasing
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    if (currentMode === 'draw') {
        ctx.strokeStyle = color;
        ctx.lineWidth = fontSize;
    } else if (currentMode === 'erase') {
        ctx.strokeStyle = '#FFFFFF'; // Eraser color (white)
        ctx.lineWidth = eraserSize; // Size of the eraser
    }

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

canvas.addEventListener('mouseout', () => {
    drawing = false;
});

// Clear the canvas
clearbutton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save and download the signature
savebutton.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL(); // Get image data URL
    const link = document.createElement('a'); // Create a temporary link element
    link.href = dataUrl;
    link.download = 'signature.png'; // Set download file name
    link.click(); // Trigger download
    localStorage.setItem('signature', dataUrl); // Save to localStorage for retrieval
});

// Retrieve the saved signature
retrivebutton.addEventListener('click', () => {
    const savedImage = localStorage.getItem('signature');
    if (savedImage) {
        const img = new Image();
        img.src = savedImage;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    } else {
        alert('No saved signature found!');
    }
});

// Save the current signature to localStorage on page unload
window.addEventListener('beforeunload', () => {
    const signatureData = canvas.toDataURL();
    localStorage.setItem('signature', signatureData);
});
