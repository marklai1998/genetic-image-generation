import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Header } from "./components/Header";
import { useMeasure, useRafLoop, useRafState } from "react-use";
import { init, population, startLoop, stopLoop } from "./genetic";
import { drawChromo, drawGenerationInfo, drawImg } from "./genetic/utils";
import ReactCardFlip from "react-card-flip";
import mona from "./assets/mona.png";
import { head } from "ramda";
import { Chromo } from "./genetic/chromo";
import { ChromoCanvas } from "./components/ChromoCanvas";

const POP_SIZE = 50;
const POLY_COUNT = 150;
const VERTICES = 3;

export const App = () => {
  const [populationClone, setPopulationClone] = useRafState<Chromo[]>([]);
  const [start, setStart] = useState(false);
  const [viewSourceImg, setViewSourceImg] = useState(false);
  const [showChromoDrawer, setShowChromoDrawer] = useState(false);
  const [refImage, setRefImg] = useState(mona);

  const [containerRef, { width: containerWidth, height: containerHeight }] =
    useMeasure<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const refImageRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lowestDimension = Math.min(containerWidth, containerHeight, 350);
    canvas.width = lowestDimension;
    canvas.height = lowestDimension;

    const refImageCanvas = refImageRef.current;
    if (!refImageCanvas) return;
    refImageCanvas.width = lowestDimension;
    refImageCanvas.height = lowestDimension;
  }, [containerWidth, containerHeight]);

  // Draw best chromo on screen
  const [stopDrawingLoop, startDrawingLoop] = useRafLoop(async () => {
    showChromoDrawer && setPopulationClone(population);
    const bestChromo = population[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawChromo(bestChromo, canvas);
    drawGenerationInfo(bestChromo, canvas);
  }, false);

  const setup = useCallback(async () => {
    stopLoop();
    setStart(false);
    stopDrawingLoop();

    await init({
      refImage: refImage,
      popSize: POP_SIZE,
      vertices: VERTICES,
      polyCount: POLY_COUNT,
    });
    const refImageCanvas = refImageRef.current;
    if (!refImageCanvas) return;
    await drawImg(refImage, refImageCanvas);
  }, [refImage, stopDrawingLoop]);

  useEffect(() => {
    setup();
  }, [setup]);

  const handleFlipStart = () => {
    if (start) {
      setStart(false);
      stopDrawingLoop();
      stopLoop();
    } else {
      setStart(true);
      startDrawingLoop();
      startLoop();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const img = head(files);

    if (!img) return;

    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => setRefImg(String(reader.result));
  };

  return (
    <>
      <GlobalStyle />
      <Header />
      <Content ref={containerRef}>
        <div>
          <Button
            color="#3c4043"
            onClick={() => {
              setViewSourceImg((v) => !v);
            }}
          >
            {viewSourceImg ? "View Generation" : "View Source Image"}
          </Button>
          <ReactCardFlip isFlipped={viewSourceImg} flipDirection="horizontal">
            <div>
              <Canvas ref={canvasRef} />
              <InputGroup>
                <Button
                  color={start ? "#f50057" : "#1565c0"}
                  onClick={handleFlipStart}
                >
                  {start ? "Pause" : "Start"}
                </Button>
                <Button color="#f50057" onClick={setup}>
                  Reset
                </Button>
              </InputGroup>
            </div>
            <div>
              <Canvas ref={refImageRef} />
              <Button
                color="#3c4043"
                onClick={() => {
                  if (imageInputRef.current) {
                    imageInputRef.current.click();
                  }
                }}
              >
                Change Image
              </Button>
              <StyledFileInput
                type="file"
                name="source"
                accept="image/*"
                onChange={handleFileSelected}
                ref={imageInputRef}
              />
            </div>
          </ReactCardFlip>
        </div>
        <Drawer>
          <Button
            color="#3c4043"
            onClick={() => {
              setShowChromoDrawer((v) => !v);
            }}
          >
            View All Chromo
          </Button>
          <DrawerContent show={showChromoDrawer}>
            {showChromoDrawer && (
              <>
                {populationClone.map((chromo, index) => (
                  <ChromoWrapper>
                    <ChromoId>#{index}</ChromoId>
                    <ChromoCanvas
                      chromo={chromo}
                      containerHeight={230}
                      containerWidth={230}
                      key={index + 1}
                      onDraw={drawGenerationInfo}
                    />
                  </ChromoWrapper>
                ))}
              </>
            )}
          </DrawerContent>
        </Drawer>
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

#app {
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

const Button = styled.button<{ color: string }>`
  display: block;
  width: 100%;
  padding: 5px 10px;
  background-color: ${({ color }) => color};
  border: 0;
  color: #fff;
  position: relative;
  cursor: pointer;
`;

const InputGroup = styled.div`
  display: flex;
`;

const StyledFileInput = styled.input`
  display: none;
`;

const Drawer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const DrawerContent = styled.div<{ show: boolean }>`
  background-color: #242424;
  width: 100%;

  height: ${({ show }) => (show ? 250 : 0)}px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;

const ChromoWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ChromoId = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 4px 8px;
  color: #fff;
  background-color: #3c4043;
`;
