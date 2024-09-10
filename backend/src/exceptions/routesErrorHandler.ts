import { Request, Response, NextFunction, Router, IRouter } from "express";

// Async error handler wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware to wrap all route handlers
export const wrapAsyncRoutes = (router: Router) => {
  // looping over the route stack
  router.stack.forEach((layer: IRouter["stack"][0]) => {
    if (layer.route) {
      // looping over the route middlewares
      layer.route.stack.forEach((routeLayer: any) => {
        // We only wrap the route if it has 2 arguments, which means it's a route handler with (req, res) arguments.
        if (routeLayer.handle.length === 2) {
          routeLayer.handle = asyncHandler(routeLayer.handle);
        }
        // We wrap All middlewares for the route.
        else {
          routeLayer.handle = asyncHandler(routeLayer.handle);
        }
      });
    } else if (layer.name === "router" && (layer.handle as Router).stack) {
      // Wrapping sub-routers of the main router
      wrapAsyncRoutes(layer.handle as Router);
    }
  });
};
