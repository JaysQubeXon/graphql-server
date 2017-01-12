'user strict';
// rewriting gql_lesson5 schema into JavaScript
const express = require('express');//: web framework to serve up the graphql server
const graphqlHTTP = require('express-graphql');//: allowing us to serve up the graphql schema as a middleware in express
const { //=> need to change the require statement to grab some of the functions needed:
  GraphQLSchema, //to be able to write the schema
  GraphQLObjectType, //:for higher order types
  GraphQLID, //:primitive type in GraphQL
  GraphQLString, //:primitive type in GraphQL
  GraphQLInt, //:primitive type in GraphQL
  GraphQLBoolean, //:primitive type in GraphQL
 } = require('graphql');

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video on Egghead.io',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the video.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video.',
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video (in seconds).',
    },
    watched: {
      type: GraphQLBoolean,
      description: 'Whether or not the viewer has watched the video.',
    },
  },

});

const queryType = new GraphQLObjectType({//defining the queryType
  name: 'QueryType',
  description: 'The root query type.',
  fields: {//: every field has its own type and resolve statement
    video: {
      type: videoType,
      resolve: () => new Promise((resolve) => {
        resolve({
          id: 'a',
          title: 'GraphQL',
          duration: 180,
          watched: false,
        });
      }),// was written before writing the videoType
    },
  },
});

const schema = new GraphQLSchema({//: configuration object that take some keys
  query: queryType,
});

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


server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));// removed the rootValue from gql_lesson5


server.listen(PORT, () => {
  console.log(`Listeing on http://localhost:${PORT}`);
});

/*write in git bash terminal: node <file-name.js>
$ node gql_lesson6.js =>> will bootstrap the server
response:
Listeing on http://localhost:3000

if you go into the browser and look up:
http://localhost:3000/graphql ==> where the middleware is hosted on
and get a graphical view of the tool called GraphiQL that will allow querying
the Schema

write in GraphiQL:

{
  video {
    id
    title
    duration
    watched
  }
}
and press Play button
*/
