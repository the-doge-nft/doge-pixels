import { generatePath } from "react-router-dom";
import { RouteMiddleware } from "./services/middleware";
import { FC } from "react";
import AppLayout from "./layouts/AppLayout/AppLayout";
import ViewerPage from "./pages/Viewer/Viewer.page";
import DSLPage from "./pages/DSL.page";
import LeaderborkPage from "./pages/Leaderbork/Leaderbork.page";
import { isDevModeEnabled } from "./environment/helpers";
import MobileHomePage from "./pages/MobileHome/MobileHome.page";
import PixelArtPage from "./pages/PixelArt/PixelArt.page";
import PerksPage from "./pages/Perks/Perks.page";
import FourOhFour from "./pages/FourOhFour";

export enum NamedRoutes {
  VIEWER = "viewer",
  LEADERBORK = "leaderbork",
  PIXEL_ART = "art",
  SNAKE_GAME = "snake",
  DSL = "dsl",
  MOBILE_HOME = "mobile",
  PIXELS = "pixels",
  PERKS = "perks",
  FOUR_O_FOUR = "fourofour"
}

export interface AppRouteInterface {
  path: string | string[];
  exact: boolean;
  name: NamedRoutes;
  layout: FC;
  component: FC | any;
  middleware?: RouteMiddleware;
  desktopName: string;
  mobileName: string;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  displayOrder: number;
}

export const route = (name: NamedRoutes, params?: {}) => {
  const route = routes.find(item => item.name === name);
  if (!route) {
    throw new TypeError("Unknown named route: " + name);
  }

  if (Array.isArray(route.path)) {
    throw new TypeError("Array paths not supported yet")
  }

  if (params) {
    return generatePath(route.path, params);
  } else {
    return route.path;
  }
};

export const SELECTED_PIXEL_PARAM = "id_with_offset";

/*
  NOTE: Ordering here is specific. Since selected pixels have the route '/<pixel_id_here>'
  it must be rendered as the last child of the <Switch> component
*/
const routes: AppRouteInterface[] = [
  {
    path: ["/leaderbork", "/leaderbork/activity/:activityId?", "/leaderbork/:address/activity/:activityId?", "/leaderbork/:address/wallet/:tokenId?"],
    name: NamedRoutes.LEADERBORK,
    exact: true,
    layout: AppLayout,
    component: LeaderborkPage,
    desktopName: "Leaderbork",
    mobileName: "LEADERBORK",
    showOnDesktop: true,
    showOnMobile: true,
    displayOrder: 1
  },
  {
    path: "/perks",
    name: NamedRoutes.PERKS,
    exact: true,
    layout: AppLayout,
    component: PerksPage,
    desktopName: "Perks",
    mobileName: "PERKS",
    showOnMobile: true,
    showOnDesktop: true,
    displayOrder: 2,
  },
  {
    path: "/art",
    name: NamedRoutes.PIXEL_ART,
    exact: true,
    layout: AppLayout,
    component: PixelArtPage,
    desktopName: "Art",
    mobileName: "ART",
    showOnMobile: true,
    showOnDesktop: true,
    displayOrder: 1,
  },
  {
    path: "/pixels",
    name: NamedRoutes.MOBILE_HOME,
    exact: true,
    layout: AppLayout,
    component: MobileHomePage,
    desktopName: "PIXELS",
    mobileName: "PIXELS",
    showOnMobile: true,
    showOnDesktop: false,
    displayOrder: 0,
  },
  {
    path: `/px/:${SELECTED_PIXEL_PARAM}?`,
    name: NamedRoutes.PIXELS,
    exact: true,
    layout: AppLayout,
    component: ViewerPage,
    desktopName: "Portal",
    mobileName: "Portal",
    showOnDesktop: false,
    showOnMobile: false,
    displayOrder: 0,
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
    displayOrder: 0,
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
    displayOrder: 4,
  });
}

// add last route as a catch all for anything not defined above
routes.push({
  path: "*",
  exact: false,
  name: NamedRoutes.FOUR_O_FOUR,
  layout: AppLayout,
  component: FourOhFour,
  desktopName: '',
  mobileName: '',
  showOnMobile: false,
  showOnDesktop: false,
  displayOrder: 5
})

export default routes;
