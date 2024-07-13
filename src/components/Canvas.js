import React, { useEffect, useRef, useState } from 'react';
import socketService from '../services/socketService';
import { throttle } from '../utils/throttle';

const Canvas = ({ roomId }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 5;
    context.strokeStyle = '#000';

    socketService.joinRoom(roomId);
    
    socketService.onDraw((data) => {
      const { x0, y0, x1, y1 } = data;
      drawLine(context, x0, y0, x1, y1);
    });

    socketService.onLoadDrawing((drawData) => {
      drawData.forEach(({ x0, y0, x1, y1 }) => {
        drawLine(context, x0, y0, x1, y1);
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, [roomId]);

  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);
    setLastPos({ x: offsetX, y: offsetY });
    drawLine(canvasRef.current.getContext('2d'), offsetX, offsetY, offsetX, offsetY);
    socketService.emitDraw({
      roomId,
      x0: offsetX,
      y0: offsetY,
      x1: offsetX,
      y1: offsetY
    });
  };

  const handleMouseMove = throttle((event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const context = canvasRef.current.getContext('2d');
    const { x, y } = lastPos;

    drawLine(context, x, y, offsetX, offsetY);
    socketService.emitDraw({
      roomId,
      x0: x,
      y0: y,
      x1: offsetX,
      y1: offsetY
    });
    setLastPos({ x: offsetX, y: offsetY });
  }, 20);

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawLine = (context, x0, y0, x1, y1) => {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseUp}
      width={800}
      height={600}
      style={{ border: '1px solid black' }}
    />
  );
};

export default Canvas;
