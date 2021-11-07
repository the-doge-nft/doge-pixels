import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import routes from "./App.routes";

function App() {
  console.log("debug:: app mount");
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
