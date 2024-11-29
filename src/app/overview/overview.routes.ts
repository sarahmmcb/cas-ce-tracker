import { Routes } from "@angular/router";
import { OverviewPage } from "./overview.page";
import { ViewExperiencePage } from "./view-experience/view-experience.page";

export const overviewRoutes: Routes = [
    {
      path: '',
      component: OverviewPage
    },
    {
      path: 'view-experience',
      component: ViewExperiencePage
    }
  ];