import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ScaffoldIndex from "./ScaffoldIndex";

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

const Scaffold = () => {
  return <ApolloProvider client={client}>
    <ScaffoldIndex subgraphUri={subgraphUri} />
  </ApolloProvider>
}

export default Scaffold
