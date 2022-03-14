const express = require('express');
//import appolo server
const { ApolloServer } = require('apollo-server-express');
//import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const {authMiddleware} = require("./utils/auth");
const db = require('./config/connection');
const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  //new appolo server created to pass in schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });

  //start appolo server
  await server.start();
  //integrate appolo server with express app as middleware
  server.applyMiddleware({ app });
  //log location to test our gql API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};
//Appolo server initilized
startServer()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
