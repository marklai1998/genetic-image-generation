import React, { useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Header } from "./components/Header";
import { useMeasure, useMount, useRafLoop, useRafState } from "react-use";
import { init, mainLoop, drawChromo } from "./genetic";
import mona from "./assets/mona.png";

const POP_SIZE = 30;
const POLY_COUNT = 150;
const VERTICES = 3;

export const App = () => {
  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const refChromoCanvasRef = useRef<HTMLCanvasElement>(null);
  const refImageCanvasRef = useRef<HTMLCanvasElement>(null);

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

  const [stopLoop, startLoop, isActive] = useRafLoop(async (time) => {
    setFrameTimeDelta(time - frameTime);
    setFrameTime(time);
    setGeneration((prev) => prev + 1);
    const population = await mainLoop();
    const bestChromo = population[0];

    const canvas = canvasRef.current;
    if (!canvas) return;

    drawChromo(bestChromo, canvas);
  }, false);

  useMount(() => {
    const refImageCanvas = refImageCanvasRef.current;
    const refChromoCanvas = refChromoCanvasRef.current;

    if (!refImageCanvas || !refChromoCanvas) return;

    const ctx = refImageCanvas.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.onload = () => {
        refChromoCanvas.width = img.width;
        refChromoCanvas.height = img.height;

        refImageCanvas.width = img.width;
        refImageCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        init({
          popSize: POP_SIZE,
          vertices: VERTICES,
          polyCount: POLY_COUNT,
          refImageCanvas,
          refChromoCanvas,
        });
      };
      img.src = mona;
    }
  });

  const isLoopActive = isActive();

  return (
    <>
      <GlobalStyle />
      <RefCanvas ref={refChromoCanvasRef} />
      <RefCanvas ref={refImageCanvasRef} />
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

const RefCanvas = styled.canvas`
  display: none;
`;
