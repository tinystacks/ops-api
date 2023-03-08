import { Request, Response, NextFunction } from 'express';
import DashboardController from '../../../controllers/dashboard-controller.js';

export default function () {
  return {
    async GET (request: Request, response: Response, next: NextFunction) {
      try {
        const dashboards = await DashboardController.getDashboards(request.params.consoleName);
        response.status(200).send(dashboards);
      } catch (error) {
        next(error);
      }
    },
    
    async POST (request: Request, response: Response, next: NextFunction) {
      try {
        const dashboard = await DashboardController.postDashboard(request.params.consoleName, request.body);
        response.status(200).send(dashboard);
      } catch (error) {
        next(error);
      }
    }
  };
}