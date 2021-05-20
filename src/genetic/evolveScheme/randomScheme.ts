import { range, splitAt } from "ramda";
import { EvolveScheme } from ".";
import { Chromo, Polygon } from "../chromo";

/*
  Elite Scheme is originated at
  https://users.cg.tuwien.ac.at/zsolnai/gfx/mona_lisa_parallel_genetic_algorithm/
  The speed of this strategy is not good on the web compare to the eliteScheme
*/

const CROSSOVER_PROBABILITY = 0.95;
const MUTATION_PROBABILITY = 0.95;

const crossOverPt = (c1: Chromo, c2: Chromo) => {
  const newChromo = new Chromo();
  const polyCount = newChromo.polygons.length;

  const cutOffIdx = Math.floor(Math.random() * polyCount);

  const [firstHalf] = splitAt(cutOffIdx, c1.polygons);
  const [, secondHalf] = splitAt(cutOffIdx, c2.polygons);

  newChromo.polygons = [...firstHalf, ...secondHalf];

  return newChromo;
};

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

export const randomScheme: EvolveScheme = async (population) => {
  const popSize = population.length;
  const cutoffIndex = Math.ceil(popSize * 0.75);
  const splitIndex = popSize - cutoffIndex;

  const sortByFitness = population.sort((a, b) => a.compare(b));
  const [keepChromo, mutateChromo] = splitAt(splitIndex, sortByFitness);

  const mutatedChromo = await Promise.all(
    mutateChromo.map(async (chromo) => {
      let newChromo = chromo;
      if (Math.random() < CROSSOVER_PROBABILITY) {
        // Crossover
        const idx1 = Math.round(Math.random() * splitIndex);
        const idx2 = Math.round(Math.random() * splitIndex);
        const scheme = Math.random() < 0.5 ? crossOverPt : crossOverRand;
        newChromo = scheme(sortByFitness[idx1], sortByFitness[idx2]);
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
  const newPopulation = [...keepChromo, ...mutatedChromo];

  return newPopulation;
};
