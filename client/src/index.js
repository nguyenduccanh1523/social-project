import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import reportWebVitals from './reportWebVitals';

//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//store

import { Provider } from "react-redux";
//reducer
//import { store1 } from "./store";

import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import reduxStore from "./redux";

import { IndexRouters } from "./router";
import { SimpleRouter } from "./router/simple-router";
//import { ChatRouter } from './router/chat-router';

const { store, persistor } = reduxStore();
const router = createBrowserRouter(
  [
    ...IndexRouters,
    ...SimpleRouter,
    //...ChatRouter
  ],
  { basename: process.env.PUBLIC_URL }
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* <BrowserRouter> */}
          <App>
            <RouterProvider router={router}></RouterProvider>
          </App>
          {/* </BrowserRouter> */}
        </PersistGate>
      </Provider>
  </StrictMode>
);
