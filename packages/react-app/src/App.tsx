import { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useNetwork, useProvider, useSigner } from "wagmi";
import "./App.css";
import routes from "./App.routes";
import buildInfo from "./build_number";
import { targetChain } from "./services/wagmi";
import AppStore from "./store/App.store";

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

const useWeb3WagmiSync = () => {
  const { chain, chains } = useNetwork()
  const { data: signer } = useSigner()
  const provider = useProvider()
  useEffect(() => {
    if (chain && targetChain?.id === chain?.id && signer && provider) {
      AppStore.web3.connect(signer, chain, provider)
      console.log("debug:: chain", chain)
    }

    if (AppStore.web3.signer && !chain && !signer) {
      AppStore.web3.disconnect()
    }
  }, [chain, targetChain, signer, provider])
}

AppStore.init();

function App() {
  useEffect(logAppVersionToConsole, []);
  useWeb3WagmiSync()
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
