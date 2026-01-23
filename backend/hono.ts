import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

console.log("[Backend] Server initializing at", new Date().toISOString());

app.use("*", cors());

app.get("/", (c) => {
  console.log("[Backend] Health check endpoint called");
  return c.json({ status: "ok", message: "API is running", timestamp: new Date().toISOString() });
});

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  }),
);

app.onError((err, c) => {
  console.error("[Backend] Error:", err);
  return c.json({ error: err.message }, 500);
});

console.log("[Backend] Server ready");

export default app;
