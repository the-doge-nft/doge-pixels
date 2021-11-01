import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ScaffoldIndex from "./ScaffoldIndex";
import "./Scaffold.css"
import {Box} from "@chakra-ui/react";

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

const Scaffold = () => {
  return <Box color={"black"}>
    <ApolloProvider client={client}>
      <ScaffoldIndex subgraphUri={subgraphUri} />
    </ApolloProvider>
  </Box>
}

export default Scaffold
