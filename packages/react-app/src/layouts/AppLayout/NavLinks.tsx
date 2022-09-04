import routes, { AppRouteInterface, NamedRoutes, route, SELECTED_PIXEL_PARAM } from "../../App.routes";
import AppStore from "../../store/App.store";
import Link from "../../DSL/Link/Link";
import { matchPath, useLocation } from "react-router-dom";

const NavLinks = ({ isMobile }: { isMobile?: boolean }) => {
  const location = useLocation();


  const getPath = (routeName: NamedRoutes) => {
    let path = route(routeName, {
      address: routeName === NamedRoutes.DOG_PARK && AppStore.web3.address ? AppStore.web3.address : undefined,
    });
    return path;
  };

  const getMatch = (routePath: string) => {
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
    const aOrder = a.order;
    const bOrder = b.order;
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
              isNav
              to={getPath(appRoute.name)}
              display="block"
              key={`mobile-nav-${appRoute.path}`}
              textDecoration={getMatch(appRoute.path) ? "underline" : "none"}
              marginBottom="5px"
            >
              {appRoute.mobileName}
            </Link>
          ))
        : [...routes]
          .sort(sortBy)
          .filter(route => route.showOnDesktop)
          .map(appRoute => (
            <Link
              size={"md"}
              isNav
              key={`desktop-nav-${appRoute.path}`}
              to={getPath(appRoute.name)}
              textDecoration={getMatch(appRoute.path) ? "underline" : "none"}
            >
              {appRoute.desktopName}
            </Link>
          ))}
    </>
  );
};

export default NavLinks
