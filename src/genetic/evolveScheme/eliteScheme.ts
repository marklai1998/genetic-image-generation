import { range, splitAt } from "ramda";
import { EvolveScheme } from ".";
import { Chromo, Polygon } from "../chromo";

/*
  Elite Scheme is inspired by the Evolution Simulator
  https://www.youtube.com/watch?v=31dsH2Fs1IQ
*/

const CROSSOVER_PROBABILITY = 0.95;
const MUTATION_PROBABILITY = 0.95;

const crossOverRand = (c1: Chromo, c2: Chromo) => {
  const newChromo = new Chromo();

  const polyCount = newChromo.polygons.length;

  newChromo.polygons = range(0, polyCount).map((_, index) => {
    const newPolygon =
      Math.random() < 0.5 ? c1.polygons[index] : c2.polygons[index];

    return Polygon.clone(newPolygon);
  });

  return newChromo;
};

export const eliteScheme: EvolveScheme = async (population) => {
  const popSize = population.length;

  const sortByFitness = population.sort((a, b) => a.compare(b));

  const [keepChromo, killChromo] = splitAt(
    Math.ceil(popSize * (1 / 2)),
    sortByFitness
  );
  const [eliteChromo, mutateChromo] = splitAt(
    Math.floor(keepChromo.length * (1 / 5)),
    keepChromo
  );

  const keepSize = keepChromo.length;

  const mutatedChromo = await Promise.all(
    mutateChromo.map(async (chromo) => {
      let newChromo = chromo;

      if (Math.random() < CROSSOVER_PROBABILITY) {
        // Crossover
        const idx1 = Math.round(Math.random() * (keepSize - 1));
        const idx2 = Math.round(Math.random() * (keepSize - 1));

        newChromo = crossOverRand(keepChromo[idx1], keepChromo[idx2]);
      } else {
        // Mutation
        if (Math.random() < MUTATION_PROBABILITY)
          chromo.mutate(500 * Math.random());
        else newChromo = new Chromo();
      }

      await newChromo.calculateFitness();
      return newChromo;
    })
  );

  const newChromo = await Promise.all(
    killChromo.map(async () => {
      const newChromo = new Chromo();
      await newChromo.calculateFitness();
      return newChromo;
    })
  );

  return [...eliteChromo, ...mutatedChromo, ...newChromo];
};
