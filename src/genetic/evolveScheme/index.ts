import { Chromo } from "../chromo";

export type EvolveScheme = (population: Chromo[]) => Promise<Chromo[]>;
