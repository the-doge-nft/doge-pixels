import { FC } from "react";
import { generatePath } from "react-router-dom";
import { IconName } from "./DSL/Icon/Icon";
import { isDevModeEnabled } from "./environment/helpers";
import AppLayout from "./layouts/AppLayout/AppLayout";
import DSLPage from "./pages/DSL.page";
import FourOhFour from "./pages/FourOhFour";
import LeaderborkPage from "./pages/Leaderbork/Leaderbork.page";
import { SelectedOwnerTab } from "./pages/Leaderbork/Leaderbork.store";
import MobileHomePage from "./pages/MobileHome/MobileHome.page";
import PerksPage from "./pages/Perks/Perks.page";
import PixelArtPage from "./pages/PixelArt/PixelArt.page";
import PrivacyPolicyPage from "./pages/PrivacyPolicy.page";
import RainbowPage from "./pages/Rainbow/Rainbow.page";
import TermsPage from "./pages/Terms.page";
import ViewerPage from "./pages/Viewer/Viewer.page";
import { RouteMiddleware } from "./services/middleware";

export enum NamedRoutes {
  VIEWER = "viewer",
  LEADERBORK = "leaderbork",
  PIXEL_ART = "art",
  SNAKE_GAME = "snake",
  DSL = "dsl",
  MOBILE_HOME = "mobile",
  PIXELS = "pixels",
  PERKS = "perks",
  FOUR_O_FOUR = "fourofour",
  RAINBOW = "rainbow",
  PRIVACY = "privacy",
  TERMS = "terms",
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
  icon?: IconName;
}

export const route = (name: NamedRoutes, params?: {}) => {
  const route = routes.find(item => item.name === name);
  if (!route) {
    throw new TypeError("Unknown named route: " + name);
  }

  if (Array.isArray(route.path)) {
    throw new TypeError("Array paths not supported yet");
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
    path: "/terms",
    name: NamedRoutes.PRIVACY,
    exact: true,
    layout: AppLayout,
    desktopName: "Privacy",
    mobileName: "Privacy",
    showOnDesktop: false,
    showOnMobile: false,
    displayOrder: 0,
    component: TermsPage,
  },
  {
    path: "/privacy",
    name: NamedRoutes.TERMS,
    exact: true,
    layout: AppLayout,
    desktopName: "Terms",
    mobileName: "Terms",
    showOnDesktop: false,
    showOnMobile: false,
    displayOrder: 0,
    component: PrivacyPolicyPage,
  },
  {
    path: "/rainbow",
    name: NamedRoutes.RAINBOW,
    exact: true,
    layout: AppLayout,
    component: RainbowPage,
    desktopName: "Rainbow Claim",
    mobileName: "Rainbow Claim",
    showOnDesktop: false,
    showOnMobile: false,
    displayOrder: 0,
  },
  {
    path: [
      `/leaderbork/:address/${SelectedOwnerTab.Activity}/:activityId?`,
      `/leaderbork/:address/${SelectedOwnerTab.Wallet}/:tokenId?`,
      `/leaderbork/${SelectedOwnerTab.Activity}/:activityId?`,
      "/leaderbork",
    ],
    name: NamedRoutes.LEADERBORK,
    exact: true,
    layout: AppLayout,
    component: LeaderborkPage,
    desktopName: "Leaderbork",
    mobileName: "LEADERBORK",
    showOnDesktop: true,
    showOnMobile: true,
    displayOrder: 1,
    icon: "person",
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
    icon: "person",
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
    icon: "person",
  },
  {
    path: "/pixels",
    name: NamedRoutes.MOBILE_HOME,
    exact: true,
    layout: AppLayout,
    component: MobileHomePage,
    desktopName: "HOME",
    mobileName: "HOME",
    showOnMobile: true,
    showOnDesktop: false,
    displayOrder: 0,
    icon: "person",
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
    icon: "person",
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
    icon: "person",
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
    icon: "person",
  });
}

// add last route as a catch all for anything not defined above
routes.push({
  path: "*",
  exact: false,
  name: NamedRoutes.FOUR_O_FOUR,
  layout: AppLayout,
  component: FourOhFour,
  desktopName: "",
  mobileName: "",
  showOnMobile: false,
  showOnDesktop: false,
  displayOrder: 5,
});

export default routes;
