import isNil from 'lodash.isnil';
import HttpError from 'http-errors';
import ConsoleClient from './console-client/index.js';
import upperFirst from 'lodash.upperfirst';
import camelCase from 'lodash.camelcase';
import { Dashboard } from '@tinystacks/ops-model';
import { ConsoleParser, DashboardParser } from '@tinystacks/ops-core';

const DashboardClient = {
  handleError (error: unknown): never {
    if (HttpError.isHttpError(error)) {
      if (error.message.includes('CONFIG_PATH') || error.message.includes('Config file')) {
        error.message = error.message?.replaceAll('console', 'dashboard');
      }
    }
    throw error;
  },
  async getDashboard (consoleName: string, dashboardId: string): Promise<DashboardParser> { //should return a dashboardParser
    try {
      const consoleClient = new ConsoleClient();
      const console : ConsoleParser = await consoleClient.getConsole(consoleName);
      const existingDashboard = console.dashboards[dashboardId];
      if (!existingDashboard) throw HttpError.NotFound(`Dashboard with id ${dashboardId} does not exist in console ${consoleName}!`);
      return existingDashboard;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async getDashboards (consoleName: string): Promise<DashboardParser[]> {
    try {
      const consoleClient = new ConsoleClient();
      const console = await consoleClient.getConsole(consoleName);
      return Object.values(console.dashboards);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async createDashboard (consoleName: string, dashboard: Dashboard): Promise<DashboardParser> {
    try {
      const consoleClient = new ConsoleClient();
      const console = await consoleClient.getConsole(consoleName);
      const routeId = upperFirst(camelCase(dashboard.route));
      const dashboardId = dashboard.id || routeId;
      dashboard.id = dashboardId;
      const existingDashboard = console.dashboards[dashboardId];
      const existingDashboardWithRoute = Object.values(console.dashboards).find(p => p.route === dashboard.route);
      if (existingDashboard) throw HttpError.Conflict(`Cannot create new dashboard with id ${dashboardId} because a dashboard with this id already exists on console ${consoleName}!`);
      if (existingDashboardWithRoute) throw HttpError.Conflict(`Cannot create new dashboard with route ${dashboard.route} because a dashboard with this route already exists on console ${consoleName}!`);
      console.addDashboard(dashboard, dashboardId);
      await consoleClient.saveConsole(console.name, console);
      return this.getDashboard(consoleName, dashboard.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async updateDashboard (consoleName: string, dashboardId: string, dashboard: Dashboard): Promise<DashboardParser> {
    try {
      const consoleClient = new ConsoleClient();
      const console: ConsoleParser = await consoleClient.getConsole(consoleName);
      const existingDashboard = console.dashboards[dashboardId];
      if (isNil(existingDashboard)) throw HttpError.NotFound(`Cannot update dashboard with id ${dashboardId} because this dashboard does not exist on console ${consoleName}!`);
      // No trickery allowed.
      dashboard.id = dashboardId;
      console.updateDashboard(dashboard, dashboardId);
      await consoleClient.saveConsole(console.name, console);
      return this.getDashboard(consoleName, dashboard.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async deleteDashboard (consoleName: string, dashboardId: string): Promise<DashboardParser> {
    try {
      const consoleClient = new ConsoleClient();
      const console = await consoleClient.getConsole(consoleName);
      const existingDashboard = console.dashboards[dashboardId];
      if (isNil(existingDashboard)) throw HttpError.NotFound(`Cannot delete dashboard with id ${dashboardId} because this dashboard does not exist on console ${consoleName}!`);
      console.deleteDashboard(dashboardId);
      await consoleClient.saveConsole(console.name, console);
      return existingDashboard;
    } catch (error) {
      return this.handleError(error);
    }
  }
};

export default DashboardClient;