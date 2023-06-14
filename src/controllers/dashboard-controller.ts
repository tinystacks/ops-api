import { Dashboard as DashboardType } from '@tinystacks/ops-model';
import { Dashboard } from '@tinystacks/ops-core';
import DashboardClient from '../clients/dashboard-client.js';

const DashboardController = {
  async getDashboards (consoleName: string): Promise<DashboardType[]> {
    const dashboards : Dashboard[] = await DashboardClient.getDashboards(consoleName);
    const dashboardTypes: DashboardType[] = dashboards.map( (dashboard) => {
      return dashboard.toJson();
    });
    return dashboardTypes;
  },
  async postDashboard (consoleName: string, createDashboardBody: DashboardType): Promise<DashboardType> {
    const dashboard: Dashboard = Dashboard.fromJson(createDashboardBody);
    return ( await DashboardClient.createDashboard(consoleName, dashboard)).toJson();
  },
  async putDashboard (consoleName: string, dashboardId: string, updateDashboardBody: DashboardType): Promise<DashboardType> {
    const dashboard: Dashboard = Dashboard.fromJson(updateDashboardBody);
    return (await DashboardClient.updateDashboard(consoleName, dashboardId, dashboard)).toJson();
  },
  async deleteDashboard (consoleName: string, dashboardId: string): Promise<DashboardType> {
    return (await DashboardClient.deleteDashboard(consoleName, dashboardId)).toJson();
  }
};

export default DashboardController;