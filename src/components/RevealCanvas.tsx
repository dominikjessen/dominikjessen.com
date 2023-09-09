////////////
// HTML   //
////////////

import { useEffect, useRef, useState } from 'react';

// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Parcel Sandbox</title>
//     <meta charset="UTF-8" />
//   </head>

//   <body>
//     <div class="canvas-container">
//       <span class="canvas-text noselect">Reveal the text</span>
//       <canvas id="canvas" class="canvas"></canvas>
//     </div>

//     <div class="mirror-container">
//       <div class="text">Revealed Text</div>
//       <div class="mirror"></div>
//     </div>

//     <script src="./index.mjs" type="module"></script>
//   </body>
// </html>

////////////
// JS     //
////////////

// import "./styles.css";

// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// // Initial gray layer
// ctx.fillStyle = 'black';
// ctx.fillRect(0, 0, 300, 300);

// let isErasing = false;

// canvas.addEventListener('mousedown', () => {
//   isErasing = true;
// });

// canvas.addEventListener('mouseup', () => {
//   isErasing = false;
// });

// canvas.addEventListener('mousemove', (e) => {
//   if (isErasing) {
//     const x = e.clientX - canvas.getBoundingClientRect().left;
//     const y = e.clientY - canvas.getBoundingClientRect().top;
//     const radius = 20; // Adjust the eraser size as needed

//     // Clear the canvas with a circular eraser effect
//     ctx.globalCompositeOperation = 'destination-out';
//     ctx.beginPath();
//     ctx.arc(x, y, radius, 0, Math.PI * 2);
//     ctx.fill();
//   }
// });

// // Flashlight effect

// const mirrorContainer = document.querySelector(".mirror-container");
// const mirror = document.querySelector(".mirror");

// mirrorContainer.addEventListener("mousemove", (e) => {
//     const rect = mirrorContainer.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const radius = 40; // Adjust the eraser size as needed

//     // Create a circular eraser effect
//     const gradient = `radial-gradient(circle at ${x}px ${y}px, transparent ${radius}px, gray ${
//       radius + 5
//     }px)`;
//     mirror.style.background = gradient;
// });

// mirrorContainer.addEventListener("mousedown", () => {
// });

// window.addEventListener("mouseup", () => {
// });

////////////
// STYLES //
////////////

interface RevealCanvasProps {
  revealText: string;
  eraserRadius?: number;
}

export default function RevealCanvas({ revealText, eraserRadius = 20 }: RevealCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isErasing, setIsErasing] = useState(false);

  function eraseCanvas(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (isErasing) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) return;

      const x = e.clientX - canvas.getBoundingClientRect().left;
      const y = e.clientY - canvas.getBoundingClientRect().top;

      // Clear the canvas with a circular eraser effect
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, eraserRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas?.width!, canvas?.height!);
    }
  }, []);

  return (
    <div className="w-80 h-96 flex justify-center items-center border-8 border-amber-500 bg-teal-100">
      <span className="absolute text-2xl z-10 select-none text-green-500">{revealText}</span>
      <canvas
        ref={canvasRef}
        className="absolute z-20 w-[19rem] h-[23rem]"
        onMouseDown={() => setIsErasing(true)}
        onMouseUp={() => setIsErasing(false)}
        onMouseMove={(event) => eraseCanvas(event)}
        width={304} // TODO: How to make this dynamic?
        height={368}
      ></canvas>
    </div>
  );
}
