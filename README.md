# Genetic Image Generation

![Build](https://github.com/marklai1998/genetic-image-generation/actions/workflows/main.yml/badge.svg) ![Test](https://github.com/marklai1998/genetic-image-generation/actions/workflows/runTest.yml/badge.svg)

Web implementation of the [genetic mona problem](https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/) with genetic programming.

## Procedure

1. Generate a set of population(app init)
2. Calculate the fitness score of each chromo [Source](https://github.com/marklai1998/genetic-image-generation/blob/master/src/genetic/worker.ts)
3. Evolve the population with predefined rule [Source](https://github.com/marklai1998/genetic-image-generation/tree/master/src/genetic/evolveScheme)
4. Calculate the fitness score and repeat the evolution process

## Getting Started
1. Clone the repository

2. Install dependency
```
$ npm install
```
3. Start the project
```
$ npm start
```

## Tools
This project was bootstrapped with [Vite](https://vitejs.dev/).

This project is written in [TypeScript](https://www.typescriptlang.org/) with complete definitions.
