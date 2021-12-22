import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import routes from "./App.routes";
import AppStore from "./store/App.store";

AppStore.init()


function App() {
  return (
    <>
    {/*<DevBanner/>*/}
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
    </>
  );
}

// const DevBanner = () => {
//   return <>
//     {!isProduction() && <Box w={"100%"} bg={"black"} whiteSpace={"nowrap"} overflowX={"hidden"}>
//         <motion.div
//             animate={{ x: ["100%", "-100%"], display: "flex", alignItems: "center", padding: "3px 0px" }}
//             transition={{ x: {duration: 60, repeat: Infinity, ease: "linear", repeatType: "loop"} }}
//         >
//           {[1,2,3,4,5,6,7,8,9,10].map(item => <Typography
//             key={`${item}-dev-banner`}
//             variant={TVariant.PresStart10}
//             color={"white"}
//             mx={5}
//           >
//             ✨✨✨✨ demo ✨✨✨✨
//           </Typography>)}
//         </motion.div>
//     </Box>}
//   </>
// }

export default App;
