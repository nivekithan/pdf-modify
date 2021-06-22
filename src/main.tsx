import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import { HarperProvider } from "./context/harperRoleProvider";

import { registerSW } from "virtual:pwa-register";

registerSW();

ReactDOM.render(
  <React.StrictMode>
    <HarperProvider
      userName={import.meta.env.VITE_HARPER_NAME}
      password={import.meta.env.VITE_HARPER_PASSWORD}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </HarperProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
