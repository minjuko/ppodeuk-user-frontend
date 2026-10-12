import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import Loader from "./components/atoms/Loader.jsx";
import { startDemoWorker } from "./demo/mode.js";
import { ToastProvider } from "./components/feedback/ToastProvider.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const prepareDemo =
  __DEMO_BUILD__ && import.meta.env.VITE_DEMO_MODE === "true"
    ? startDemoWorker(() => import("./mocks/worker"))
    : Promise.resolve();

prepareDemo.then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <App />
            </ToastProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>,
  );
});
