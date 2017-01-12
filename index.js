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
const {
  globalIdField,
  connectionDefinitions,
  connectionFromPromisedArray,
  connectionArgs,
  mutationWithClientMutationId,
 } = require('graphql-relay');
const { nodeInterface, nodeField } = require('./src/node');

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video on Egghead.io',
  fields: {
    id: globalIdField(),
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
  interfaces: [nodeInterface],
});
exports.videoType = videoType;

const { connectionType: VideoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: 'A count of the total number of objects in this connection.',
      resolve: (conn) => {
        return conn.edges.length;
      },
    },
  }),
});
const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    node: nodeField,
    videos: {
      type: VideoConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(
        getVideos(),
        args
      ),
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

const videoMutation = mutationWithClientMutationId({
  name: 'AddVideo',
  inputFields: {//what fields are defined on our input object type
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
  outputFields: {//will correspond with what we can query on after the mutation
    video: {
      type: videoType,
    },
  },
  mutateAndGetPayload: (args) => new Promise((resolve, reject) => {
    //arguments that will pass in will correspond with whatever our inputFields are.
    Promise.resolve(createVideo(args))
    .then((video) => resolve({ video }))
    .catch(reject);
    //the value that we will be returning or resolving from this method
    //is what we are going to be able to pick out information from these outputFields.
    //if we want to be able to get the data under the video in outputFields, that is why we
    //are resolving an { object  } and one of the keys on that object is video.
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation type.',
  fields: {
    createVideo: videoMutation,
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
$ node gql_lesson15.js =>> will bootstrap the server
response:
Listeing on http://localhost:3000

if you go into the browser and look up:
http://localhost:3000/graphql ==> where the middleware is hosted on
and get a graphical view of the tool called GraphiQL that will allow querying
the Schema

//GraphiQL is case sensitive

write in GraphiQL:
mutation AddVideoQuery($input: AddVideoInput!) {
  createVideo(input: $input) {
    video {
      title
    }
  }
}
inside the Query Variables panel write:
{
  "input": {
    "title": "video title",
    "duration": 300,
    "released": false,
    "clientMutationId": "abcd"
  }
}
result:
{
  "data": {
    "createVideo": {
      "video": {
        "title": "video title"
      }
    }
  }
}
*/
