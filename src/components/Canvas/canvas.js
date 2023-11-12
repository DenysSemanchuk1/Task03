import React, { useEffect, useState } from "react";
const canvasBgColor = "rgba(0,0,0,0.4)";
export const Canvas = ({
  canvasRef,
  allowedToDraw,
  setHistory,
  setUndoIndex,
  undoIndex,
  ctxRef,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    canvas.width = window.innerWidth;

    canvas.height = height;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.015;
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 20;
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    if (allowedToDraw) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };
  const endDrawing = () => {
    if (allowedToDraw) {
      ctxRef.current.closePath();
      setIsDrawing(false);

      setHistory((history) => [
        ...history.slice(0, undoIndex + 1),
        ctxRef.current.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        ),
      ]);
      setUndoIndex(undoIndex + 1);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (allowedToDraw) {
      ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctxRef.current.stroke();
    }
  };
  return (
    <canvas
      id='canvas'
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={draw}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        background: canvasBgColor,
      }}
    />
  );
};
