import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

const VERSION = "19";
console.log(`[Backend] v${VERSION} starting at`, new Date().toISOString());
console.log(`[Backend] RESEND_API_KEY:`, process.env.RESEND_API_KEY ? "configured" : "MISSING");

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "x-trpc-source"],
  exposeHeaders: ["Content-Length"],
  maxAge: 86400,
  credentials: false,
}));

app.get("/", (c) => {
  console.log(`[Backend] v${VERSION} health check`);
  return c.json({ 
    status: "ok", 
    version: VERSION,
    timestamp: new Date().toISOString(),
    resendConfigured: !!process.env.RESEND_API_KEY,
  });
});

app.all("/trpc/*", (c) => {
  console.log(`[Backend] v${VERSION} tRPC:`, c.req.method, c.req.path);
  return trpcServer({
    router: appRouter,
    createContext,
  })(c, async () => {});
});

app.onError((err, c) => {
  console.error(`[Backend] v${VERSION} error:`, err.message);
  return c.json({ error: err.message }, 500);
});

console.log(`[Backend] v${VERSION} ready`);

export default app;
