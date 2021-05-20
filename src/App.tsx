import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Header } from "./components/Header";
import { useMeasure, useMount, useRafLoop } from "react-use";
import { generation, init, mainLoop, population } from "./genetic";
import { drawChromo } from "./genetic/utils";

const POP_SIZE = 50;
const POLY_COUNT = 150;
const VERTICES = 3;

export const App = () => {
  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();
  const [start, setStart] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lowestDimension = Math.min(width, height, 350);
    canvas.width = lowestDimension;
    canvas.height = lowestDimension;
  }, [width, height]);

  useEffect(() => {
    const loop = async () => {
      while (start) {
        await mainLoop();
      }
    };

    start && loop();
  }, [start]);

  const [stopLoop, startLoop] = useRafLoop(async () => {
    const bestChromo = population[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawChromo(bestChromo, canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = "16px Rajdhani";
    ctx.fillStyle = "white";
    ctx.fillText(`Generation: ${generation}`, 10, 16);
    ctx.fillText(`Fitness: ${bestChromo.fitness}`, 10, 32);
  }, false);

  useMount(() => {
    init({
      popSize: POP_SIZE,
      vertices: VERTICES,
      polyCount: POLY_COUNT,
    });
  });

  const handleFlip = () => {
    if (start) {
      setStart(false);
      stopLoop();
    } else {
      setStart(true);
      startLoop();
    }
  };

  return (
    <>
      <GlobalStyle />
      <Header />
      <Content ref={containerRef}>
        <div>
          <Canvas ref={canvasRef} />
          <Button isActive={start} onClick={handleFlip}>
            {start ? "Stop" : "Start"}
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
