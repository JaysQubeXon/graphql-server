'user strict';

const express = require('./graphql-server/node_modules/express');//: web framework to serve up the graphql server
const graphqlHTTP = require('./graphql-server/node_modules/express-graphql');//: allowing us to serve up the graphql schema as a middleware in express
const { graphql, buildSchema } = require('./graphql-server/node_modules/graphql');

const PORT = process.env.PORT || 3000;
const server = express();

const schema = buildSchema(`
  type Video {
    id: ID,
    title: String,
    duration: Int,
    watched: Boolean
  }

  type Query {
    video: Video
    videos: [Video]
  }

  type Schema {
    query: Query
  }
`);

const videoA = {
  id: 'a',
  title: 'Create a GraphQL Schema',
  duration: 120,
  watched: true,
};

const videoB = {
  id: 'b',
  title: 'Ember.js CLI',
  duration: 240,
  watched: false,
};

const videos = [videoA, videoB];

//create resolver:
const resolvers = {
  video: () => ({
    id: () => '1',
    title: () => 'Foo',
    duration: () => 180,
    watched: () => true,
  }),

    videos: () => videos,
};


//can get rid off the graphql utility function and write instead:
server.use('/graphql', graphqlHTTP({//: mount it on the graphql endpoint and pass in the graphqlHTTP middleware function
  schema,// pass in configuration objects. schema corresponds to the schema that we are constructing above
  graphiql: true,//: the second option: for using a tool called graphiql = a virual editor for graphql schemas
  rootValue: resolvers, //: similar to how we used the graphql utility function
}));                    //and passed resolvers that is defined up above, that defines
                        // how to fetch some of these fields.


server.listen(PORT, () => {
  console.log(`Listeing on http://localhost:${PORT}`);
});

/*write in git bash terminal: node <file-name.js>
$ node gql_lesson5.js =>> will bootstrap the server
response:
Listeing on http://localhost:3000

if you go into the browser and look up:
http://localhost:3000/graphql ==> where the middleware is hosted on
and get a graphical view of the tool called GraphiQL that will allow querying
the Schema
*/
