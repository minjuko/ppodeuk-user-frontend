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

const shouldRetryQuery = (failureCount, error) => {
  if (failureCount >= 1) return false;

  const status = error?.response?.status;
  return !status || status === 408 || status === 429 || status >= 500;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      retryDelay: 1500,
    },
  },
});

const prepareDemo = __DEMO_BUILD__
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
