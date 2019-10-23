# What's this?
This project is based on Google's [Material Design Components for Web](https://github.com/material-components/material-components-web/blob/master/README.md). 

# Getting started
Once you have node and npm installed:
```bash
npm install
npm start
```

If you want to build production dependencies, use:
```bash
npm run build
```

# Adding a component
To add a new Material Design component, you need to do the following:
1. Install the component's npm package.
1. Add component's HTML.
1. Import the component's CSS.
1. Initialize the component and bind event handlers.

The following shows how you would add the [MDC button component](https://material.io/develop/web/components/buttons/) to the project.

#### Install npm package
```bash
npm install @material/button --save-dev
```

#### Add HTML
```html
<button class="mdc-button">
  <span class="mdc-button__label">Button</span>
</button>
```

#### Import CSS
```css
/* css/_material-design.scss */
@import "@material/button/mdc-button";
```

#### Initialize JS
```js
/* js/app.js */
import {MDCRipple} from '@material/ripple';
const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
```

# Testing
## Unit tests
Unit tests are standalone (no server needed) and run with:
```bash
npm test
```
## Visual regression and accessibility
Visual regression and accessibility tests can be run with the local webpack dev server: 
```bash
npm start # start the server
npm run test-visual-a11y
```
As you make screen changes, you'll need to update the reference screenshots in `./features/screenshots/ref`.  This can be easily done using the `./features/screenshots/compare` images that are created after a test run.
## Behavioural
Behavioural tests run against the [GCdocs collaboration environment](https://dev.gcdocs.gc.ca/collaboration/llisapi.dll?func=llworkspace) and need two environment variables set before running:
```bash
export TEST_USERNAME=your.name@tpsgc-pwgsc.gc.ca
export TEST_PASSWORD=<your AD password>
npm run test-behaviour
```