import { Request, Response, NextFunction } from 'express';
import ConsoleController from '../controllers/console-controller.js';

export default function () {
  return {
    async GET (_request: Request, response: Response, next: NextFunction) {
      try {
        const console = await ConsoleController.getConsoles();
        response.status(200).send(console);
      } catch (error) {
        next(error);
      }
    },
    
    async POST (request: Request, response: Response, next: NextFunction) {
      try {
        const console = await ConsoleController.postConsole(request.body);
        response.status(200).send(console);
      } catch (error) {
        next(error);
      }
    }
  };
}