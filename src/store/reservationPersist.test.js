import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { afterEach, describe, expect, it } from "vitest";
import {
  clearPayment,
  saveReservation,
  saveTid,
  setBayId,
  setCarwashId,
} from "./action";
import {
  migrateReservationState,
  reservationReducer,
} from "./reservationReducer";

const persistKey = "persist:root";
const persistors = [];

const createMemoryStorage = (initialValues = {}) => ({
  values: { ...initialValues },
  getItem(key) {
    return Promise.resolve(this.values[key] ?? null);
  },
  setItem(key, value) {
    this.values[key] = value;
    return Promise.resolve(value);
  },
  removeItem(key) {
    delete this.values[key];
    return Promise.resolve();
  },
});

const createPersistedStore = (storage) => {
  const reducer = persistReducer(
    { key: "root", storage, migrate: migrateReservationState },
    reservationReducer,
  );
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
  const persistor = persistStore(store);
  persistors.push(persistor);
  return { store, persistor };
};

const waitForRehydration = (persistor) =>
  new Promise((resolve) => {
    if (persistor.getState().bootstrapped) {
      resolve();
      return;
    }
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        unsubscribe();
        resolve();
      }
    });
  });

const encodePersistedState = (state) =>
  JSON.stringify(
    Object.fromEntries(
      Object.entries(state).map(([key, value]) => [key, JSON.stringify(value)]),
    ),
  );

afterEach(async () => {
  await Promise.all(persistors.splice(0).map((persistor) => persistor.flush()));
});

describe("reservation Redux Persist compatibility", () => {
  it("uses redux-persist storage serialization and restores the saved reservation", async () => {
    const storage = createMemoryStorage();
    const first = createPersistedStore(storage);
    await waitForRehydration(first.persistor);

    first.store.dispatch(setCarwashId("101"));
    first.store.dispatch(setBayId(1011));
    first.store.dispatch(
      saveReservation("2026-08-11T10:00", "2026-08-11T11:00"),
    );
    first.store.dispatch(saveTid("payment-tid"));
    await first.persistor.flush();

    const serializedEnvelope = JSON.parse(storage.values[persistKey]);
    expect(JSON.parse(serializedEnvelope.selectedCarwashId)).toBe("101");
    expect(JSON.parse(serializedEnvelope.reservations)).toEqual({
      startTime: "2026-08-11T10:00",
      endTime: "2026-08-11T11:00",
    });

    const restored = createPersistedStore(storage);
    await waitForRehydration(restored.persistor);
    expect(restored.store.getState()).toMatchObject({
      selectedCarwashId: "101",
      selectedBayId: 1011,
      reservations: {
        startTime: "2026-08-11T10:00",
        endTime: "2026-08-11T11:00",
      },
      tid: "payment-tid",
    });
  });

  it("keeps the previous empty-array reservation shape and drops its stale TID", async () => {
    const storage = createMemoryStorage({
      [persistKey]: encodePersistedState({
        selectedCarwashId: 101,
        selectedBayId: 1011,
        selectedReservationId: null,
        reservations: [],
        tid: "stale-tid",
        _persist: { version: -1, rehydrated: true },
      }),
    });
    const { store, persistor } = createPersistedStore(storage);
    await waitForRehydration(persistor);

    expect(store.getState()).toMatchObject({
      selectedCarwashId: 101,
      selectedBayId: 1011,
      reservations: [],
      tid: null,
    });
  });

  it("normalizes partial persisted data without discarding valid independent IDs", async () => {
    const storage = createMemoryStorage({
      [persistKey]: encodePersistedState({
        selectedCarwashId: "101",
        selectedBayId: { invalid: true },
        selectedReservationId: "501",
        reservations: { startTime: "", endTime: 11 },
        tid: "stale-tid",
        _persist: { version: -1, rehydrated: true },
      }),
    });
    const { store, persistor } = createPersistedStore(storage);
    await waitForRehydration(persistor);

    expect(store.getState()).toMatchObject({
      selectedCarwashId: "101",
      selectedBayId: null,
      selectedReservationId: "501",
      reservations: [],
      tid: null,
    });
    await expect(migrateReservationState(null, -1)).resolves.toEqual({
      selectedCarwashId: null,
      selectedBayId: null,
      selectedReservationId: null,
      reservations: [],
      tid: null,
      _persist: { version: -1, rehydrated: false },
    });
  });

  it("keeps reservation details available when clearing only payment state", async () => {
    const storage = createMemoryStorage();
    const { store, persistor } = createPersistedStore(storage);
    await waitForRehydration(persistor);
    store.dispatch(setCarwashId(101));
    store.dispatch(setBayId(1011));
    store.dispatch(saveReservation("2026-08-11T10:00", "2026-08-11T11:00"));
    store.dispatch(saveTid("payment-tid"));
    store.dispatch(clearPayment());

    expect(store.getState()).toMatchObject({
      reservations: {
        startTime: "2026-08-11T10:00",
        endTime: "2026-08-11T11:00",
      },
      tid: null,
    });
  });
});
