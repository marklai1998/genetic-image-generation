import { range } from "ramda";

import mona from "../assets/mona.png";

import { Chromo } from "./chromo";
import { eliteScheme } from "./evolveScheme/eliteScheme";
import { randomScheme } from "./evolveScheme/randomScheme";
import { getCanvasData } from "./utils";

export let generation = 0;
export let population: Chromo[] = [];

export const init = async ({
  popSize,
  polyCount: pCount,
  vertices: vCount,
}: {
  popSize: number;
  polyCount: number;
  vertices: number;
}) => {
  generation = 0;
  Chromo.polyCount = pCount;
  Chromo.verticesCount = vCount;

  const img = new Image();
  img.onload = async () => {
    const canvasHeight = 350;
    const canvasWidth = 350;

    Chromo.refChromoCanvas.width = canvasWidth;
    Chromo.refChromoCanvas.height = canvasHeight;

    const refImageCanvas = document.createElement("canvas");
    const ctx = refImageCanvas.getContext("2d");
    if (!ctx) return;

    refImageCanvas.width = canvasWidth;
    refImageCanvas.height = canvasHeight;

    const { width: imgWidth, height: imageHeight } = img;

    Chromo.imgScale = Math.min(
      canvasWidth / imgWidth,
      canvasHeight / imageHeight
    );

    ctx.drawImage(img, 0, 0);
    Chromo.refImageData = getCanvasData(refImageCanvas);
    refImageCanvas.remove();

    const newPopulation = range(0, popSize).map(() => new Chromo());
    await Promise.all(newPopulation.map((chromo) => chromo.calculateFitness()));
    population = newPopulation;
  };
  img.src = mona;
};

export const mainLoop = async () => {
  generation = generation + 1;

  // population = await randomScheme(population);
  population = await eliteScheme(population);
};
