import { beforeEach, describe, expect, it } from "vitest";
import { instance } from "./instance";

const captureRequestConfig = async (config) => ({
  config,
  data: {},
  headers: {},
  status: 200,
  statusText: "OK",
});

describe("authenticated API request headers", () => {
  beforeEach(() => localStorage.clear());

  it("sends the stored server-issued Bearer token unchanged", async () => {
    localStorage.setItem("token", "Bearer valid-token");

    const response = await instance.get("/auth-probe", {
      adapter: captureRequestConfig,
    });

    expect(response.config.headers.get("Authorization")).toBe(
      "Bearer valid-token",
    );
  });

  it("does not add an Authorization header when no token is stored", async () => {
    const response = await instance.get("/auth-probe", {
      adapter: captureRequestConfig,
    });

    expect(response.config.headers.get("Authorization")).toBeUndefined();
  });
});
