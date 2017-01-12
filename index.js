'user strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
 } = require('graphql');
const { getVideoById, getVideos, createVideo} = require('./src/data');
const nodeInterface = require('./src/node');//<=== import this

const PORT = process.env.PORT || 3000;
const server = express();

/*const instructorType = new GraphQLObjectType({
  //inside of here, we knew that fields of this will also contain this id field as well.
  //and since we are sharing these fields we would also add the interfaces: array once again
  //and pass in the nodeInterface as the first element of that array. this is garranting that
  //these two types that share the same fields now have a common interface that they both implement.
  fields: {
    id: {
      type: GraphQLID,                              for example only
      description: 'The id of the video.',
    },
  },
  interfaces: [nodeInterface],
});*/
const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video on Egghead.io',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
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
  interfaces: [nodeInterface],//:the goal for this interface is to be able to use
                //it anytime we have shared fields between types.
});
exports.videoType = videoType;

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    videos: {
      type: new GraphQLList(videoType),
      resolve: getVideos,
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the video.',
        },
      },
      resolve: (_, args) => {
        return getVideoById(args.id);
      },
    },
  },
});

const videoInputType = new GraphQLInputObjectType({
  name: 'VideoInput',
  fields: {
    title: {
     type: new GraphQLNonNull(GraphQLString),
     description: 'The title of the video.',
   },
   duration: {
     type: new GraphQLNonNull(GraphQLInt),
     description: 'The duration of the video (in seconds).',
   },
   released: {
     type: new GraphQLNonNull(GraphQLBoolean),
     description: 'Whether or not the video is released.',
   },
  },
});
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation type.',
  fields: {
    createVideo: {
        type: videoType,
        args: {
        video: {
          type: new GraphQLNonNull(videoInputType),
        },
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      },
    },
  },
});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
});

server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));


server.listen(PORT, () => {
  console.log(`Listeing on http://localhost:${PORT}`);
});

/*write in git bash terminal: node <file-name.js>
$ node gql_lesson12.js =>> will bootstrap the server
response:
Listeing on http://localhost:3000

if you go into the browser and look up:
http://localhost:3000/graphql ==> where the middleware is hosted on
and get a graphical view of the tool called GraphiQL that will allow querying
the Schema

//GraphiQL is case sensitive

write in GraphiQL:
none this lesson.
*/
