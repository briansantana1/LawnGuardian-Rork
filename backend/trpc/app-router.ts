import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { lawnRouter } from "./routes/lawn";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  lawn: lawnRouter,
});

export type AppRouter = typeof appRouter;
