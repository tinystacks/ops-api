import HttpError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { TinyStacksError } from '@tinystacks/ops-core';

export default async function errorMiddleware (e: unknown, _request: Request, response: Response, next: NextFunction) {
  console.error(e);
  if (TinyStacksError.isTinyStacksError(e) || HttpError.isHttpError(e)) {
    const error = TinyStacksError.fromJson(e as any);
    response.status(error.status).json(error);
  } else {
    const ise = HttpError.InternalServerError('An unexpected error occured! See the API logs for more details.');
    response.status(ise.status).json(ise);
  }
  next();
}