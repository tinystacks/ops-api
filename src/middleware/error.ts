import HttpError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { TinyStacksError } from '@tinystacks/ops-core';

export default async function errorMiddleware (error: unknown, request: Request, response: Response, next: NextFunction) {
  console.error(error);
  if (TinyStacksError.isTinyStacksError(error) || HttpError.isHttpError(error)) {
    const { status, message } = error as TinyStacksError | HttpError.HttpError;
    response.status(status).json({ status, message });
  } else {
    const ise = HttpError.InternalServerError('An unexpected error occured! See the API logs for more details.');
    response.status(ise.status).json(ise);
  }
  next();
}