import React, { useCallback, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Header } from "./components/Header";
import { useMeasure, useMount, useRafLoop, useRafState } from "react-use";
import { Chromo, init, mainLoop } from "./genetic";

const POP_SIZE = 30;
const POLY_COUNT = 150;
const VERTICES = 3;

export const App = () => {
  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generation, setGeneration] = useRafState(0);
  const [frameTime, setFrameTime] = useRafState(0);
  const [frameTimeDelta, setFrameTimeDelta] = useRafState(0);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lowestDimension = Math.min(width, height, 350);
    canvas.width = lowestDimension;
    canvas.height = lowestDimension;
  }, [width, height]);

  const drawChromo = useCallback(
    (chromo: Chromo) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      chromo.polygon.forEach((polygon) => {
        const [firstPt, ...restPoint] = polygon.vertices;
        const color = polygon.color;
        ctx.fillStyle = `rgba(${color[0] * 255}, ${color[1] * 255}, ${
          color[2] * 255
        }, ${color[3]})`;

        ctx.beginPath();
        ctx.moveTo(firstPt.x * width, firstPt.y * height);
        restPoint.forEach((point) => {
          ctx.lineTo(point.x * width, point.y * height);
        });

        ctx.closePath();
        ctx.fill();
      });
    },
    [canvasRef]
  );

  const [stopLoop, startLoop, isActive] = useRafLoop((time) => {
    setFrameTimeDelta(time - frameTime);
    setFrameTime(time);
    setGeneration((prev) => prev + 1);
    const population = mainLoop();
    const bestChromo = population[0];
    drawChromo(bestChromo);
  });

  useMount(() => {
    init({ popSize: POP_SIZE, vertices: VERTICES, polyCount: POLY_COUNT });
    startLoop();
  });

  const isLoopActive = isActive();

  return (
    <>
      <GlobalStyle />
      <Header />
      <Content ref={containerRef}>
        <div>
          <Info>
            Generation: {generation}
            <FPS>FPS: {Math.round((1000 / frameTimeDelta) * 100) / 100}</FPS>
          </Info>
          <Canvas ref={canvasRef} />
          <Button
            isActive={isLoopActive}
            onClick={isLoopActive ? stopLoop : startLoop}
          >
            {isLoopActive ? "Stop" : "Start"}
          </Button>
        </div>
      </Content>
    </>
  );
};

const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Rajdhani', Microsoft JhengHei, sans-serif;
  background-color: #151515;
  height: 100%;
}

button{
  font-family: 'Rajdhani', Microsoft JhengHei, sans-serif;
}

#root {
  height: 100%;
  display: flex;
  flex-direction: column;
}
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

const Canvas = styled.canvas`
  background-color: #000000;
`;

const Info = styled.div`
  background-color: #2d3034;
  padding: 5px 10px;
  color: #fff;
`;

const FPS = styled.div`
  float: right;
`;

const Button = styled.button<{ isActive: boolean }>`
  display: block;
  width: 100%;
  padding: 5px 10px;
  background-color: ${({ isActive }) => (isActive ? "#f50057" : "#1565c0")};
  border: 0;
  color: #fff;
  position: relative;
  top: -4px;
`;
