import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

console.log("[Backend] Server initializing at", new Date().toISOString());
console.log("[Backend] Build version: 9 - improved cors");

app.use("*", cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-trpc-source'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
  credentials: false,
}));

app.get("/", (c) => {
  console.log("[Backend] Health check endpoint called");
  return c.json({ status: "ok", message: "API is running", timestamp: new Date().toISOString() });
});

app.use(
  "/api/trpc/*",
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
