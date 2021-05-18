import React, { useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Header } from "./components/Header";
import { useMeasure, useMount, useRafLoop, useRafState } from "react-use";
import { mainLoop } from "./genetic";

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

  const [stopLoop, startLoop, isActive] = useRafLoop((time) => {
    setFrameTimeDelta(time - frameTime);
    setFrameTime(time);
    setGeneration((prev) => prev + 1);
    mainLoop();
  });

  useMount(() => {
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
