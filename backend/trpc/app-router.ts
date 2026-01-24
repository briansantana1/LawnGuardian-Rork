import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { lawnRouter } from "./routes/lawn";
import { legalRouter } from "./routes/legal";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  lawn: lawnRouter,
  legal: legalRouter,
});

export type AppRouter = typeof appRouter;
