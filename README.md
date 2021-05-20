# Genetic Image Generation

Web implementation of the [genetic mona problem](https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/) with genetic programming.

## Procedure

1. Generate a set of population(app init)
2. Calculate the fitness score of each chromo [Source](https://github.com/marklai1998/genetic-image-generation/blob/master/src/genetic/worker.ts)
3. Evolve the population with predefined rule [Source](https://github.com/marklai1998/genetic-image-generation/tree/master/src/genetic/evolveScheme)
4. Calculate the fitness score and repeat the evolution process

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
