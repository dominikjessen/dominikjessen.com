import { useEffect, useRef, useState } from 'react';

interface RevealCanvasProps {
  revealContent: string;
  eraserRadius?: number;
}

export default function RevealCanvas({ revealContent, eraserRadius = 40 }: RevealCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderReveal, setRenderReveal] = useState(false);
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

  // TODO: Can we animate this?
  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas?.width!, canvas?.height!);
    }
  }

  // TODO: Can we animate this?
  function fillCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas?.width!, canvas?.height!);
    }
  }

  useEffect(() => {
    fillCanvas();
    setRenderReveal(true);
  }, []);

  return (
    <div className="hidden md:flex flex-col gap-4 items-center">
      <div className="w-[30rem] h-[36rem] flex justify-center items-center border-[16px] border-primary rounded-tl-full rounded-tr-full">
        {renderReveal && (
          <div className="w-[28rem] h-[34rem] flex flex-col justify-end items-center select-none">
            <span className="text-8xl mb-64">🌵</span>
            <img className="absolute z-10 w-[28rem]" src={revealContent} alt="Hidden Image" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="absolute z-20 w-[28rem] h-[34rem] rounded-tl-full rounded-tr-full"
          onMouseDown={() => setIsErasing(true)}
          onMouseUp={() => setIsErasing(false)}
          onMouseMove={(event) => eraseCanvas(event)}
          width={464} // TODO: How to make this dynamic?
          height={560}
        ></canvas>
      </div>
      <div className="flex gap-8">
        <button className="h-9 rounded-md px-3 border-2 border-accent text-accent hover:bg-accent hover:text-white" onClick={clearCanvas}>
          Reveal
        </button>
        <button className="h-9 rounded-md px-3 border-2 border-accent text-accent hover:bg-accent hover:text-white" onClick={fillCanvas}>
          Reset
        </button>
      </div>
    </div>
  );
}

// let x = canvas.width * 0.5;
// let y = canvas.height * 0.5;
// let dx = 0;
// let dy = 0;

// ctx.fillStyle = "green";

// function render() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillRect(x, y, dx, dy);
//   x -= 1;
//   y -= 1;
//   dx += 2;
//   dy += 2;
//   if (x <= 0) return;
//   requestAnimationFrame(render);
// }

// requestAnimationFrame(render);
