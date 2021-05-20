import { range } from "ramda";

import { Chromo } from "./chromo";
import { eliteScheme } from "./evolveScheme/eliteScheme";
// import { randomScheme } from "./evolveScheme/randomScheme";
import { drawImg, getCanvasData } from "./utils";

export let generation = 0;
export let population: Chromo[] = [];

export const init = async ({
  refImage,
  popSize,
  polyCount: pCount,
  vertices: vCount,
}: {
  refImage: string;
  popSize: number;
  polyCount: number;
  vertices: number;
}) => {
  generation = 0;
  Chromo.polyCount = pCount;
  Chromo.verticesCount = vCount;

  const canvasHeight = 350;
  const canvasWidth = 350;

  Chromo.refChromoCanvas.width = canvasWidth;
  Chromo.refChromoCanvas.height = canvasHeight;

  const refImageCanvas = document.createElement("canvas");
  refImageCanvas.width = canvasWidth;
  refImageCanvas.height = canvasHeight;

  const imgScale = await drawImg(refImage, refImageCanvas);
  Chromo.imgScale = imgScale;

  Chromo.refImageData = getCanvasData(refImageCanvas);

  refImageCanvas.remove();

  const newPopulation = range(0, popSize).map(() => new Chromo());
  await Promise.all(newPopulation.map((chromo) => chromo.calculateFitness()));
  population = newPopulation;
};

export const mainLoop = async () => {
  generation = generation + 1;

  // population = await randomScheme(population);
  population = await eliteScheme(population);
};
