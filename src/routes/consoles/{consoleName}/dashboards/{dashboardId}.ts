import { Request, Response, NextFunction } from 'express';
import DashboardController from '../../../../controllers/dashboard-controller.js';

export default function () {
  return {
    async PUT (request: Request, response: Response, next: NextFunction) {
      try {
        const dashboard = await DashboardController.putDashboard(request.params.consoleName, request.params.dashboardId, request.body);
        response.status(200).send(dashboard);
      } catch (error) {
        next(error);
      }
    },

    async DELETE (request: Request, response: Response, next: NextFunction) {
      try {
        const dashboard = await DashboardController.deleteDashboard(request.params.consoleName, request.params.dashboardId);
        response.status(200).send(dashboard);
      } catch (error) {
        next(error);
      }
    }
  };
}