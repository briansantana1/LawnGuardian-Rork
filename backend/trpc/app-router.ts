import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";

// Lawn router temporarily disabled due to backend bundling issue
// import { lawnRouter } from "./routes/lawn";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  // lawn: lawnRouter,
});

export type AppRouter = typeof appRouter;
