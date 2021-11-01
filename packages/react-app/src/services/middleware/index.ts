/**
 * RouteMiddleware
 *
 * Description:
 * Middleware takes as parameter content that router wants to render. If checks inside middleware fail it can return <Redirect/>.
 * If checks are ok, it can return passed parameter, aka default render
 */

export type RouteMiddleware = (route: JSX.Element) => JSX.Element | undefined | any;
