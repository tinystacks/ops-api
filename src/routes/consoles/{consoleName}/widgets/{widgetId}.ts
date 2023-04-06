import { Request, Response, NextFunction } from 'express';
import WidgetController from '../../../../controllers/widget-controller.js';
import { parseObjectTypeQueryParam } from '../../../../utils/parsing-utils.js';

export default function () {
  return {
    async GET (request: Request, response: Response, next: NextFunction) {
      try {
        const overrides = parseObjectTypeQueryParam('overrides', request.query);
        const dashboardId = request.query?.dashboardId as string;
        const parameters = parseObjectTypeQueryParam('parameters', request.query);
        const {
          consoleName,
          widgetId
        } = request.params || {};
        const widget = await WidgetController.getWidget({
          consoleName,
          widgetId,
          overrides,
          dashboardId,
          parameters
        });
        response.status(200).send(widget);
      } catch (error) {
        next(error);
      }
    },

    async PUT (request: Request, response: Response, next: NextFunction) {
      try {
        const widget = await WidgetController.putWidget(request.params.consoleName, request.params.widgetId, request.body);
        response.status(200).send(widget);
      } catch (error) {
        next(error);
      }
    },

    async DELETE (request: Request, response: Response, next: NextFunction) {
      try {
        const widget = await WidgetController.deleteWidget(request.params.consoleName, request.params.widgetId);
        response.status(200).send(widget);
      } catch (error) {
        next(error);
      }
    }
  };
}