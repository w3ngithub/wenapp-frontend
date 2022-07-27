import React from "react";
import { createRoot } from 'react-dom/client';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
// Add this import:
import {AppContainer} from 'react-hot-loader';

const root = createRoot(document.getElementById('root'))

// Wrap the rendering in a function:
const render = Component => {
  root.render(
    // Wrap App inside AppContainer
    <AppContainer>
      <App/>
    </AppContainer>,
  );
};

// Do this once
registerServiceWorker();

// Render once
render(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
