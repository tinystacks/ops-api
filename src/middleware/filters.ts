import { Request, Response, NextFunction } from 'express';

type Middleware = (request: Request, response: Response, next: NextFunction) => Promise<void>

export function unless (paths: string[], middleware: Middleware) {
  return function (request: Request, response: Response, next: NextFunction) {
    if (paths.find(path => request.path === path)) {
      return next();
    } else {
      return middleware(request, response, next);
    }
  };
}

export function only (paths: string[], middleware: Middleware) {
  return function (request: Request, response: Response, next: NextFunction) {
    if (paths.find(path => request.path === path)) {
      return middleware(request, response, next);
    } else {
      return next();
    }
  };
}