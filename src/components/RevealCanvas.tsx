import { useEffect, useRef, useState } from 'react';

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
    <div className="w-[30rem] h-[36rem] flex justify-center items-center border-8 border-amber-500 bg-teal-100 rounded-tl-full rounded-tr-full">
      <span className="absolute text-2xl z-10 select-none text-green-500">{revealText}</span>
      <canvas
        ref={canvasRef}
        className="absolute z-20 w-[29rem] h-[35rem] rounded-tl-full rounded-tr-full"
        onMouseDown={() => setIsErasing(true)}
        onMouseUp={() => setIsErasing(false)}
        onMouseMove={(event) => eraseCanvas(event)}
        width={464} // TODO: How to make this dynamic?
        height={560}
      ></canvas>
    </div>
  );
}
