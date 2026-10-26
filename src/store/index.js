// @ts-check

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import {
  migrateReservationState,
  reservationReducer,
} from "./reservationReducer";

const persistConfig = {
  key: "root",
  storage,
  migrate: migrateReservationState,
};

const rootReducer = combineReducers({
  reservationProcess: persistReducer(persistConfig, reservationReducer),
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
