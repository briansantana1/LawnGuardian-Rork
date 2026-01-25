import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

console.log("[Backend] Server initializing at", new Date().toISOString());
console.log("[Backend] Build version: 11 - retry fix");

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

app.all("/api/trpc/*", async (c, next) => {
  console.log("[Backend] tRPC request:", c.req.method, c.req.url);
  return trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })(c, next);
});

app.onError((err, c) => {
  console.error("[Backend] Error:", err);
  return c.json({ error: err.message }, 500);
});

console.log("[Backend] Server ready");

export default app;
