import {generatePath} from "react-router-dom";
import {RouteMiddleware} from "./services/middleware";
import {FC} from "react";
import AppLayout from "./layouts/AppLayout/AppLayout";
import ViewerPage from "./pages/Viewer/Viewer.page";
import DSLPage from "./pages/DSL.page";
import DogParkPage from "./pages/DogPark/DogPark.page";
import {isDevModeEnabled} from "./environment/helpers";
import MobileHomePage from "./pages/MobileHome/MobileHome.page";
import PerksPage from "./pages/Perks/Perks.page";

export enum NamedRoutes {
  VIEWER = "viewer",
  DOG_PARK = "park",
  DSL = "dsl",
  MOBILE_HOME = "mobile",
  PIXELS = "pixels",
  PERKS = "perks"
}

export interface AppRouteInterface {
  path: string;
  exact: boolean;
  name: NamedRoutes;
  layout: FC;
  component: FC | any;
  middleware?: RouteMiddleware;
  desktopName: string;
  mobileName: string
  showOnMobile: boolean;
  showOnDesktop: boolean;
  order: number;
}


export const route = (name: NamedRoutes, params?: {}) => {
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

export const SELECTED_PIXEL_PARAM = "id_with_offset"

/*
  NOTE: Ordering here is specific. Since selected pixels have the route '/<pixel_id_here>'
  it must be rendered as the last child of the <Switch> component
*/
const routes: AppRouteInterface[] = [
  {
    path: "/perks",
    name: NamedRoutes.PERKS,
    exact: true,
    layout: AppLayout,
    component: PerksPage,
    desktopName: "Perks",
    mobileName: "Perks",
    showOnMobile: true,
    showOnDesktop: true,
    order: 2
  },
  {
    path: "/park/:address?/:tokenID?",
    name: NamedRoutes.DOG_PARK,
    exact: true,
    layout: AppLayout,
    component: DogParkPage,
    desktopName: "Park",
    mobileName: "Park",
    showOnMobile: false,
    showOnDesktop: true,
    order: 1
  },
  {
    path: "/pixels",
    name: NamedRoutes.MOBILE_HOME,
    exact: true,
    layout: AppLayout,
    component: MobileHomePage,
    desktopName: "Pixels",
    mobileName: "PIXELS",
    showOnMobile: true,
    showOnDesktop: false,
    order: 0
  },
  {
    path: `/px/:${SELECTED_PIXEL_PARAM}`,
    name: NamedRoutes.PIXELS,
    exact: true,
    layout: AppLayout,
    component: ViewerPage,
    desktopName: "Portal",
    mobileName: "Portal",
    showOnDesktop: false,
    showOnMobile: false,
    order: 0
  },
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
    order: 0
  },
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
    showOnMobile: true,
    showOnDesktop: true,
    order: 4
  })
}

export default routes;