import React, { useState, useRef, Fragment } from "react";
import { Stage, Layer, Line } from "react-konva";
import "./App.css";

interface LineData {
  points: number[];
  strokeWidth: number;
  color: string;
}

function DrawingApp() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [eraser, setEraser] = useState(false);
  const [lines, setLines] = useState<LineData[]>([]);
  const [selectedColor, setSelectedColor] = useState("#fff");
  const [selectedSize, setSelectedSize] = useState(5); // Initial size
  const canvasRef = useRef(null);
  const [undoHistory, setUndoHistory] = useState<LineData[] | any>([]); // Array for undo
  const [redoHistory, setRedoHistory] = useState<LineData[] | any>([]);

  const handleColorChange = (color: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(color.target.value); // Update color state
  };

  const handleMouseDown = (e: any) => {
    if (!eraser) {
      setIsDrawing(true);
      setLines([
        ...lines,
        {
          points: [e.evt.offsetX, e.evt.offsetY],
          strokeWidth: selectedSize,
          color: selectedColor,
        },
      ]);
    } else {
      setIsDrawing(true);
      setLines([
        ...lines,
        {
          points: [e.evt.offsetX, e.evt.offsetY],
          strokeWidth: selectedSize,
          color: "#000",
        },
      ]);
    }
    setUndoHistory([...undoHistory, [...lines]]);
    setRedoHistory([]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) {
      return;
    }
    // if (!eraser) {
    //   return;
    // }
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([e.evt.offsetX, e.evt.offsetY]);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    // setEraser(false);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value);
    if (isNaN(newSize) || newSize < 1 || newSize > 100) {
      console.error(
        "Invalid size value. Please enter a number between 1 and 100."
      );
      return;
    }
    setSelectedSize(newSize);
  };
  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const newHistory = [...undoHistory];
      const lastState = newHistory.pop();
      setLines(lastState);
      setUndoHistory(newHistory);
      redoHistory.push(lastState);
      setRedoHistory([...redoHistory, lines]);
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const newRedoHistory = [...redoHistory];
      const nextState = newRedoHistory.pop();
      setLines(nextState);
      setRedoHistory(newRedoHistory);
      setUndoHistory([...undoHistory, lines]);
    }
  };
  const handleDownload = () => {
    const canvas = canvasRef.current.getStage().toDataURL("image/png");
    const link = document.createElement("a");
    link.href = canvas;
    link.download = "drawing.png";
    link.click();
  };

  return (
    <Fragment>
      <div className="table mx-auto" style={{ backgroundColor: "black" }}>
        <Stage
          width={800}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={canvasRef}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <div id="canvas-container mx-auto ">
        <div className="control-container flex flex-row items-center justify-between  mt-2 ">
          <div
            className="pencil tools-items hover-scale"
            onMouseDown={() => setEraser(false)}
          >
            <img
              className="object-scale-down h-14"
              src="https://cdn.jsdelivr.net/gh/hicodersofficial/drawing-tablet@main/assets/pencil.svg"
              title="Brush"
              id="pencil"
              alt=""
              sizes="sm"
            />
          </div>

          <div
            className="tools-items"
            onMouseDown={() => setEraser(true)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img
              className="object-scale-down h-14"
              src="https://cdn.jsdelivr.net/gh/hicodersofficial/drawing-tablet@main/assets/eraser.png"
              title="Eraser"
              id="eraser"
              alt=""
            />
          </div>
          <div
            className="tools-items"
            style={{ marginRight: "0.8rem" }}
            onClick={() => setLines([])}
          >
            <img
              className="object-scale-down h-14"
              src="https://cdn.jsdelivr.net/gh/hicodersofficial/drawing-tablet@main/assets/clear-all.png"
              title="clear"
              id="clear"
              alt=""
            />
          </div>

          <div className="size dt-cp-items flex items-center justify-between">
            <input
              className="border-2 border-inherit"
              type="number"
              min="1"
              max="100"
              id="size"
              value={selectedSize}
              onChange={handleSizeChange}
            />
            <label htmlFor="dtPicker" className="color-picker">
              <input
                className="rounded-full "
                id="dtPicker"
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
              />
            </label>
          </div>

          <div
            className="dt-undo-redo-items flex felx-row items-center justify-between"
            onClick={handleUndo}
          >
            <div className="undo">
              <img
                className="object-scale-down h-14"
                src="https://cdn.jsdelivr.net/gh/hicodersofficial/drawing-tablet@main/assets/undo.png"
                title="Undo (Ctrl + Z)"
                id="undo"
                alt=""
              />
            </div>
            <div className="redo" onClick={handleRedo}>
              <img
                className="object-scale-down h-14"
                src="https://cdn.jsdelivr.net/gh/hicodersofficial/drawing-tablet@main/assets/redo.png"
                title="Redo (Ctrl + Y)"
                id="redo"
                alt=""
              />
            </div>
          </div>
          <div className="dt-download-items" onClick={handleDownload}>
            <a href="" type="download"></a>
            <img
              className="object-scale-down h-14"
              src="https://cdn.jsdelivr.net/gh/hicodersofficial/drawing-tablet@main/assets/download.png"
              title="Download (Ctrl + E)"
              id="download"
              alt=""
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default DrawingApp;
