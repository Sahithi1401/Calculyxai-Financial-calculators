import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { __NotFoundComponent, __ErrorComponent, __PendingComponent } from "./routes/__root";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: __ErrorComponent,
    defaultNotFoundComponent: __NotFoundComponent,
    defaultPendingComponent: __PendingComponent,
    defaultPendingMs: 400,
  });

  return router;
};
