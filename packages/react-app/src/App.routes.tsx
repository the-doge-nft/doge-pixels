import {generatePath} from "react-router-dom";
import {RouteMiddleware} from "./services/middleware";
import {FC} from "react";
import AppLayout from "./layouts/AppLayout";
import ViewerPage from "./pages/Viewer/Viewer.page";
import DSLPage from "./pages/DSL.page";
import DogParkPage from "./pages/DogPark/DogPark.page";
import {isDevModeEnabled} from "./environment/helpers";
import MobileHomePage from "./pages/MobileHome/MobileHome.page";

export enum NamedRoutes {
  VIEWER = "viewer",
  DOG_PARK = "park",
  DSL = "dsl",
  PIXELS = "mobile"
}


export interface AppRouteInterface {
  path: string;
  exact: boolean;
  name?: NamedRoutes;
  layout: FC;
  component: FC | any;
  middleware?: RouteMiddleware;
  desktopName: string;
  mobileName: string
  showOnMobile: boolean;
  showOnDesktop: boolean;
}


export const route = (name: NamedRoutes, params: any = {}) => {
  const route = routes.find(item => item.name === name);
  if (!route) {
    throw new TypeError("Unknown named route: " + name);
  }
  if (params) {
    return generatePath(route.path, params);
  } else {
    return route.path;
  }
};

const routes: AppRouteInterface[] = [
  {
    path: "/",
    name: NamedRoutes.VIEWER,
    exact: true,
    layout: AppLayout,
    component: ViewerPage,
    desktopName: "Portal",
    mobileName: "DOGE",
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    path: "/park/:address?/:tokenID?",
    name: NamedRoutes.DOG_PARK,
    exact: true,
    layout: AppLayout,
    component: DogParkPage,
    desktopName: "Dog park",
    mobileName: "Park",
    showOnMobile: false,
    showOnDesktop: true,

  },
  {
    path: "/pixels",
    name: NamedRoutes.PIXELS,
    exact: true,
    layout: AppLayout,
    component: MobileHomePage,
    desktopName: "Pixels",
    mobileName: "PIXELS",
    showOnMobile: true,
    showOnDesktop: false,
  }
];

if (isDevModeEnabled()) {
  routes.push({
    path: "/dsl",
    name: NamedRoutes.DSL,
    exact: true,
    layout: AppLayout,
    component: DSLPage,
    desktopName: "DSL",
    mobileName: "DSL",
    showOnMobile: false,
    showOnDesktop: false,
  })
}

export default routes;