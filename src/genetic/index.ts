import { range } from "ramda";

import mona from "../assets/mona.png";

import { Chromo } from "./chromo";
import { eliteScheme } from "./evolveScheme/eliteScheme";
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
    const width = img.width;
    const height = img.height;

    Chromo.refChromoCanvas.width = width;
    Chromo.refChromoCanvas.height = height;

    const refImageCanvas = document.createElement("canvas");
    const ctx = refImageCanvas.getContext("2d");
    if (!ctx) return;

    refImageCanvas.width = width;
    refImageCanvas.height = height;

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
