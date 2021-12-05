import { generatePath } from "react-router-dom";
import { RouteMiddleware } from "./services/middleware";
import { FC } from "react";
import AppLayout from "./layouts/AppLayout";
import ViewerPage from "./pages/Viewer/Viewer.page";
import DSLPage from "./pages/DSL.page";
import DogParkPage from "./pages/DogPark/DogPark.page";
import {isDevModeEnabled} from "./environment/helpers";
import PoolPage from "./pages/Pool/Pool.page";

export enum NamedRoutes {
  VIEWER = "viewer",
  POOLSTATS = "stats",
  DOG_PARK = "profile",
  DEV = "dev",
  POOL = "pool",
  DSL = "dsl",
}


export interface AppRouteInterface {
  path: string;
  exact: boolean;
  name?: NamedRoutes;
  layout: FC;
  component: FC | any;
  middleware?: RouteMiddleware;
  title: string;
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
    title: "Portal",
  },
  {
    path: "/park/:address?/:tokenID?",
    name: NamedRoutes.DOG_PARK,
    exact: true,
    layout: AppLayout,
    component: DogParkPage,
    title: "Dog park",
  },
  {
    path: "/pool",
    name: NamedRoutes.POOL,
    exact: true,
    layout: AppLayout,
    component: PoolPage,
    title: "Pool"
  }
];

if (isDevModeEnabled()) {
  routes.push({
    path: "/dsl",
    name: NamedRoutes.DSL,
    exact: true,
    layout: AppLayout,
    component: DSLPage,
    title: "DSL",
  })
}

export default routes;