"use client";
import { useEffect, useRef, useState } from "react";
import { set1 } from "../data";

export default function SpinWheelCanvas({index, color } : { index : number,color : string[]}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const data = set1;
  const total = data.length;

  const size = 400;
  const radius = size / 2;

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };
  // 🎨 DRAW WHEEL
  const drawWheel = (ctx: CanvasRenderingContext2D, rot: number) => {
    ctx.clearRect(0, 0, size, size);

    const anglePerSlice = (2 * Math.PI) / total;

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(rot - Math.PI/2 - anglePerSlice / 2);

    data.forEach((item, i) => {
      const start = i * anglePerSlice ;
      const end = start + anglePerSlice;

      ctx.fillStyle = `hsl(${(i * 360) / total}, 70%, 60%)`;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fill();

      // 📝 TEXT + BACKGROUND
      ctx.save();
      ctx.rotate(start + anglePerSlice / 2 );

      const text = item.key;
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";

      const textX = radius - 25;
      const textY = 0;

      const padding = 6;
      const textWidth = ctx.measureText(text).width;
      const boxWidth = textWidth + padding * 2;
      const boxHeight = 20;


      ctx.fillStyle = "#fff"; // background
        roundRect(
          ctx,
          textX - boxWidth / 2,
          textY - boxHeight / 2,
          boxWidth,
          boxHeight,
          8,
        );
        ctx.fill();

      // 🎯 Highlight selected slice
      // if (i === index) {
      console.log(color[i],i)
        ctx.fillStyle = color[i]; // background
        roundRect(
          ctx,
          textX - boxWidth / 2,
          textY - boxHeight / 2,
          boxWidth,
          boxHeight,
          8,
        );
        ctx.fill();

        ctx.fillStyle = color[i] === "#fff" ? '#000' : "#fff"; // text color
      // } else {
      //   ctx.fillStyle = "#000";
      // }

      ctx.fillText(text, textX, 5);
      ctx.restore();
    });

    ctx.restore();
  };
  // 🎯 DETECT RESULT
// const getResultIndex = (rot: number) => {
//   const anglePerSlice = (2 * Math.PI) / total;

//   const normalized = (2 * Math.PI - (rot % (2 * Math.PI))) % (2 * Math.PI);
// console.log((normalized / anglePerSlice) )
//   return Math.round(normalized / anglePerSlice) % total;
// };
  // useEffect(() => {
  //   const canvas = canvasRef.current!;
  //   const ctx = canvas.getContext("2d")!;
  //   drawWheel(ctx, rotation);
  // }, [index]);

  useEffect(() => {
  const targetRotation = getRotationFromIndex(index);
  setRotation(targetRotation);

  const canvas = canvasRef.current!;
  const ctx = canvas.getContext("2d")!;
  drawWheel(ctx, targetRotation);
}, [index]);

const getRotationFromIndex = (index: number) => {
  const anglePerSlice = (2 * Math.PI) / total;

  // rotate so selected slice lands at top pointer
  return - index * anglePerSlice;
};

  // 🎡 SPIN
  const spin = () => {
    if (spinning) return;

    setSpinning(true);

    const step = (2 * Math.PI) / data.length
    const finalRotation = rotation - step

    let start = performance.now();
    const duration = 4000;

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);

      // ease out
      const ease = 1 - Math.pow(1 - progress, 3);

      const current = rotation + (finalRotation - rotation) * ease;

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      drawWheel(ctx, current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRotation(finalRotation);
        setSpinning(false);

        // 🎯 result
        // const index = getResultIndex(finalRotation);
        // setIndex(index)

      }
    };

    requestAnimationFrame(animate);
  };

  // initial draw
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
    drawWheel(ctx, rotation);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100">
      {/* Pointer */}
      <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-red-500 mb-[-10px] z-10" />

      {/* Canvas */}
      <canvas ref={canvasRef} className="rounded-full shadow-xl" />

      {/* Button */}
      {/* <button
        onClick={spin}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl"
      >
        Spin
      </button> */}
    </div>
  );
}
