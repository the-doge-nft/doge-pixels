import React, {useEffect} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import routes from "./App.routes";
import AppStore from "./store/App.store";
import "./App.css";
import buildInfo from "./build_number";


const logAppVersionToConsole = () => {
    var styleArray= [
        'background-image:url("https://media2.giphy.com/media/s51QoNAmM6dkWcSC0P/giphy.gif?cid=790b7611b9d3af20f12f55d06c1ea052d631612235f0b1af&rid=giphy.gif&ct=g")',
        'background-size: cover',
        'color: magenta',
        'font-weight: bold',
        'padding: 10px 10px',
        'line-height: 60px',
        'border : 3px solid black',
        'text-align: center'
    ];
    console.log(`%c dogepixels@${buildInfo.lastHash.substring(0, 6)}`, styleArray.join(';'))
    console.debug(`build hash ${buildInfo.lastHash} - no ${buildInfo.buildNumber} - date ${buildInfo.buildTime}`);
}


AppStore.init()

console.log('TEST --- DEPLOY')

function App() {
  useEffect(logAppVersionToConsole, [])
  return <BrowserRouter>
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
}

export default App;
