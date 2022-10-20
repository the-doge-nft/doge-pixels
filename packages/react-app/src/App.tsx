import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import routes from "./App.routes";
import AppStore from "./store/App.store";
import "./App.css";
import buildInfo from "./build_number";

const logAppVersionToConsole = () => {
  var styleArray = [
    "background-color: yellow",
    "background-size: cover",
    "background-repeat: no-repeat",
    "background-position: center",
    "color: magenta",
    "font-weight: bold",
    "padding: 10px 10px",
    "line-height: 60px",
    "border : 3px solid black",
    "text-align: center",
  ];
  console.log(`%cdogepixels@${buildInfo.lastHash.substring(0, 6)}`, styleArray.join("; "));
  console.log(`build hash ${buildInfo.lastHash} - no ${buildInfo.buildNumber} - date ${buildInfo.buildTime}`);
};

AppStore.init();
console.log("vercel deploy test 3")

function App() {
  useEffect(logAppVersionToConsole, []);
  return (
    <BrowserRouter>
      <Switch>
        {routes.map((route, index) => {
          const Component = route.component;
          const Layout = route.layout;
          const Middleware = route.middleware;
          const RenderRedirect = Middleware ? Middleware(Component) : undefined;

          return (
            <Route
              path={route.path}
              exact={route.exact}
              key={route.name}
              render={props => {
                if (RenderRedirect) {
                  return RenderRedirect;
                } else {
                  return (
                    <Layout>
                      <Component />
                    </Layout>
                  );
                }
              }}
            />
          );
        })}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
