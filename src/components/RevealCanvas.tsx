import HighlightArrow from '../images/Highlight_Arrow_topRight.svg';
import revealOptions from '../data/revealContent.json';
import { useEffect, useRef, useState } from 'react';

interface RevealCanvasProps {
  eraserRadius?: number;
  className?: string;
}

export default function RevealCanvas({ eraserRadius = 40, className }: RevealCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderReveal, setRenderReveal] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [reveal, setReveal] = useState<(typeof revealOptions)[0]>();

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

  // TODO: Might not want this functionality at all
  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas?.width!, canvas?.height!);
    }
  }

  function fillCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'hsl(180 17% 93% / 0.99)'; // #eaf0f0
      ctx.fillRect(0, 0, canvas?.width!, canvas?.height!);
    }
  }

  useEffect(() => {
    // TODO: If I want this to be responsive on resizing I will need a resizeObserver
    // console.log(`Window is: ${window.innerWidth} x ${window.innerHeight}`);

    fillCanvas();
    setReveal(revealOptions[Math.floor(Math.random() * revealOptions.length)]);
    setRenderReveal(true);
  }, []);

  return (
    <div id="revealCanvasWrapper" className={`${className} flex-col gap-4 items-center intersect-target`}>
      <div className="w-[30rem] h-[36rem] flex justify-center items-center border-[16px] border-primary rounded-tl-full rounded-tr-full">
        {renderReveal && (
          <div className="w-[28rem] h-[34rem] flex flex-col justify-end items-center select-none">
            <div className="mb-56 flex flex-col items-center gap-10">
              <span className="text-6xl">{reveal?.emoji}</span>
              <p className="text-2xl text-center px-6 leading-relaxed text-primary">{reveal?.message}</p>
            </div>
            <img className="absolute z-10 w-[28rem]" src="/waves-1.svg" alt="" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="absolute z-20 w-[28rem] h-[34rem] rounded-tl-full rounded-tr-full"
          onMouseDown={() => setIsErasing(true)}
          onMouseUp={() => setIsErasing(false)}
          onMouseMove={(event) => eraseCanvas(event)}
          width={464}
          height={560}
        ></canvas>
      </div>
      <img src={HighlightArrow.src} alt="" className="absolute top-[10%] right-[10%] select-none" />
    </div>
  );
}
