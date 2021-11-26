# Genetic Image Generation

Web implementation of the [genetic mona problem](https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/) with genetic programming.

## Procedure

1. Generate a set of population(app init)
2. Calculate the fitness score of each chromo [Source](https://github.com/marklai1998/genetic-image-generation/blob/master/src/genetic/worker.ts)
3. Evolve the population with predefined rule [Source](https://github.com/marklai1998/genetic-image-generation/tree/master/src/genetic/evolveScheme)
4. Calculate the fitness score and repeat the evolution process
