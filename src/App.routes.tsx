import {generatePath} from "react-router-dom";
import {RouteMiddleware} from "./services/middleware";
import {FC} from "react";
import AppLayout from "./layouts/AppLayout";
import Viewer from "./pages/Viewer/Viewer";
import PoolStats from "./pages/PoolStats/PoolStats";

export enum NamedRoutes {
    VIEWER = "viewer",
    POOLSTATS = "stats",
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
        return route.path
    }
};

const routes: AppRouteInterface[] = [
    {
        path: "/",
        name: NamedRoutes.VIEWER,
        exact: true,
        layout: AppLayout,
        component: Viewer,
        title: "Viewer"
    },
    {
        path: "/stats",
        name: NamedRoutes.POOLSTATS,
        exact: true,
        layout: AppLayout,
        component: PoolStats,
        title: "Stats"
    }
]
export default routes;
