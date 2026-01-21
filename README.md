# famiefi-front

# Languages

1. **[TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)**
1. **[Tailwind CSS](https://tailwindcss.com/docs)**
3. **[Sass](https://sass-lang.com/documentation)**

# Requirements
1. Node v14

# Run development

```sh
docker-compose up
```

# Build production

```sh
./scripts/build.sh
```

NOTE: If you have Windows change the terminal to Git Bash.

# Environment

Required variables to be used on your local development:

- REACT_APP_BASE_URL

# Create components

This structure required the next steps for standardize code:

- Only use react arrow functional components
- Create folder with **kebab-case**
- Create component with **PascalCase** with extention .TSX
- Create a style file with **PascalCase** and the name of its corresponding component with sass format
- In files use 4 spaces or tabs
- Use semicolon
- Use single quotes
- Use [BEM](http://getbem.com/naming/) naming convention for css class
- Use type **rem measurement** in font size, margin, padding
- If you need others components you have to create a folder with name: **components**
- **Components folder** has to be separeted by folders and its name has to be according to function of component

**Example:**

Folder: ``new-component``

Component: ``NewComponent.tsx``

Style component ``NewComponent.scss``

```jsx
//react arrow functional component
const App = () => {
  const greeting = 'Hello Function Component!';

  return <h1>Component</h1>;
};
```

## Faster compilation

This is an option to slightly improve the project's compilation time, but it is optional.

- In craco.config.js, add the following line:
```jsx
webpackConfig.devtool = false;
```

- In package.json, change the scripts to the following:

```jsx
"scripts": {
"start": "GENERATE_SOURCEMAP=false craco --max_old_space_size=16000 start",
"build": "GENERATE_SOURCEMAP=false craco --max_old_space_size=16000 build",
"buildProd": "craco --max_old_space_size=8192 build",
"test": "craco test",
"eject": "react-scripts eject"
},
```

"WARNING": By not generating source maps, craco start loads faster and debugging in the browser is more difficult because you'll see transpiled code instead of the original TypeScript or JSX code.

## Installation and Running with Yarn

- Install yarn if not installed

```jsx
npm install -g yarn
```

- Delete node_modules folder
```jsx
rm -f node_modules
```
-Delete package-lock.json file if this exists
```jsx
rm -f package-lock.json
```
- To install the project dependencies, run:
```jsx
yarn install
```
-Once the dependencies are installed, you can start the project in development mode with the following command:
```jsx
yarn start
```
-To build the project for production, run:
```jsx
yarn build
```
