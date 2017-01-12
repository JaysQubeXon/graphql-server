'user strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
 } = require('graphql');
 const { getVideoById } = require('./src/data');//: after builing index.js of that directory

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

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    video: {
      type: videoType,
      args: {//: in GraphQL it is possible to pass arguments to fields by using the args key.
        id: { //: name of the argument to query
          type: GraphQLID,
          description: 'The id of the video.',
        },
      },//: now, instead of resolving with a static object as was in previous lessons,
        // we can write the resolve as a function. The first argument we don't care about,
        // but the second one will have all the arguments that are being passed in to our
        // resolve statement for our field. we can use that inside of our function -fat arrow => instance,
      resolve: (_, args) => {
        return getVideoById(args.id);// id for the specific video that we want.
      },
    },
  },
});

const schema = new GraphQLSchema({
    query: queryType,
});

/*cut the video data and is now in newly created src/data/index.js file*/


server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));


server.listen(PORT, () => {
  console.log(`Listeing on http://localhost:${PORT}`);
});

/*write in git bash terminal: node <file-name.js>
$ node gql_lesson7.js =>> will bootstrap the server
response:
Listeing on http://localhost:3000

if you go into the browser and look up:
http://localhost:3000/graphql ==> where the middleware is hosted on
and get a graphical view of the tool called GraphiQL that will allow querying
the Schema

note: we created file index.js inside of subdirectories /src/data/index.js

write in GraphiQL:
//GraphiQL is case sensitive
{
  video(id: "a") {    <== id of args field
    title
  }
}
and press Play button

response:
{
  "data": {
    "video": {
      "title": "Create a GraphQL Schema"
    }
  }
}
//id: "b" came out:
{
  "data": {
    "video": {
      "title": "Ember.js CLI"
    }
  }
}
*/
