import { useBreakpointValue } from "@chakra-ui/react";
import { matchPath, useLocation } from "react-router-dom";
import routes, { AppRouteInterface, NamedRoutes, route, SELECTED_PIXEL_PARAM } from "../../App.routes";
import { Type } from "../../DSL/Fonts/Fonts";
import Link from "../../DSL/Link/Link";
import { SelectedOwnerTab } from "../../pages/Leaderbork/Leaderbork.store";

const NavLinks = ({
  isMobile,
  size = "sm",
  onClick,
}: {
  isMobile?: boolean;
  size?: "sm" | "lg";
  onClick?: (name: string) => any;
}) => {
  const location = useLocation();
  const showOnXL = useBreakpointValue({ base: true, xl: false });

  const getPath = (routeName: NamedRoutes) => {
    if (routeName === NamedRoutes.LEADERBORK) {
      return `/leaderbork/${SelectedOwnerTab.Activity}`;
    } else {
      return route(routeName);
    }
  };

  const getMatch = (routePath: string | string[]) => {
    let match = matchPath<any>(location.pathname, {
      path: routePath,
      exact: true,
      strict: false,
    });

    /*
      Hack to match NamedRoutes.PIXELS route to the NamedRoutes.VIEWER link as they both render the same
      component but NamedRoutes.PIXELS is hidden from desktop & mobile views.
    */
    const isSelectedPixelMatch = matchPath<any>(location.pathname, {
      path: route(NamedRoutes.PIXELS),
      exact: true,
      strict: false,
    });

    if (
      isSelectedPixelMatch &&
      SELECTED_PIXEL_PARAM in isSelectedPixelMatch.params &&
      routePath === route(NamedRoutes.VIEWER)
    ) {
      return true;
    }
    return match;
  };

  const sortBy = (a: AppRouteInterface, b: AppRouteInterface) => {
    const aOrder = a.displayOrder;
    const bOrder = b.displayOrder;
    if (aOrder > bOrder) {
      return 1;
    } else if (aOrder < bOrder) {
      return -1;
    }
    return 0;
  };

  return (
    <>
      {isMobile
        ? [...routes]
            .sort(sortBy)
            .filter(route => route.showOnMobile)
            .map(appRoute => (
              <Link
                size={size}
                isNav
                to={getPath(appRoute.name)}
                key={`mobile-nav-${appRoute.path}`}
                textDecoration={getMatch(appRoute.path) ? "underline" : "none"}
                onClick={() => onClick && onClick(appRoute.name)}
              >
                {appRoute.mobileName}
              </Link>
            ))
        : [...routes]
            .sort(sortBy)
            .filter(route => route.showOnDesktop)
            .map(appRoute => (
              <Link
                variant={Type.PresStart}
                size={size}
                isNav
                key={`desktop-nav-${appRoute.path}`}
                to={getPath(appRoute.name)}
                fontWeight={getMatch(appRoute.path) ? "bold" : "normal"}
                onClick={() => onClick && onClick(route.name)}
                // textDecoration={getMatch(appRoute.path) ? "underline" : "none"}
              >
                {appRoute.desktopName}
                {/* <Icon icon={appRoute.icon} boxSize={4} /> */}
              </Link>
            ))}
    </>
  );
};

export default NavLinks;
