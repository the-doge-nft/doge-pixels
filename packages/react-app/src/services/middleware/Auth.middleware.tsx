import React from "react";
import { RouteMiddleware } from "./index";
// import {AppStore} from "../../store/App.store";
import { Redirect } from "react-router-dom";

/**
 *
 * AuthMiddleware
 *
 * Description:
 * Add this middleware to your route to enable access only by authenticated users
 *
 */
const AuthMiddleware: RouteMiddleware = (_route: JSX.Element) => {
  // if (!AppStore.auth.isLoggedIn) {
  //     return <Redirect to={route(NamedRoutes.AUTH_LOGIN)}/>
  // }
};
export default AuthMiddleware;
