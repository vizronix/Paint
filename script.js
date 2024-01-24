document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("paintCanvas");
    const context = canvas.getContext("2d");
    let painting = false;
    let eraserMode = false;
    let undoStack = [];
    let redoStack = [];

    // Predefined color palette
    const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];

    // Populate color palette
    const colorPalette = document.getElementById("colorPalette");
    colors.forEach(color => {
        const colorButton = document.createElement("button");
        colorButton.style.backgroundColor = color;
        colorButton.addEventListener("click", () => {
            document.getElementById("colorPicker").value = color;
        });
        colorPalette.appendChild(colorButton);
    });

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function endPosition() {
        painting = false;
        context.beginPath();
        saveState();
    }

    function draw(e) {
        if (!painting) return;

        const x = e.clientX || e.touches[0].clientX;
        const y = e.clientY || e.touches[0].clientY;

        context.lineWidth = document.getElementById("brushSize").value;

        if (eraserMode) {
            context.strokeStyle = "white"; // Use white for erasing
        } else {
            context.strokeStyle = document.getElementById("colorPicker").value;
        }

        const brushShape = document.getElementById("brushShape").value;

        if (brushShape === "round") {
            context.lineCap = "round";
        } else if (brushShape === "square") {
            context.lineCap = "square";
        }

        context.lineTo(x - canvas.offsetLeft, y - canvas.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(x - canvas.offsetLeft, y - canvas.offsetTop);
    }

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        saveState();
    }

    function toggleEraser() {
        eraserMode = !eraserMode;
        const eraserButton = document.getElementById("eraserButton");
        eraserButton.textContent = eraserMode ? "Paint" : "Eraser";
    }

    function saveCanvas() {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "painting.png";
        link.click();
    }

    function saveState() {
        undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
        redoStack = []; // Clear redo stack
    }

    function undo() {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop());
            context.putImageData(undoStack[undoStack.length - 1], 0, 0);
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            undoStack.push(redoStack.pop());
            context.putImageData(undoStack[undoStack.length - 1], 0, 0);
        }
    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("touchstart", startPosition);
    canvas.addEventListener("touchend", endPosition);
    canvas.addEventListener("touchmove", draw);

    document.getElementById("clearButton").addEventListener("click", clearCanvas);
    document.getElementById("eraserButton").addEventListener("click", toggleEraser);
    document.getElementById("saveButton").addEventListener("click", saveCanvas);
    document.getElementById("undoButton").addEventListener("click", undo);
    document.getElementById("redoButton").addEventListener("click", redo);

    // Initial state save
    saveState();
});
