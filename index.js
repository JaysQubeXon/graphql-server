'user strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,//import this
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
 } = require('graphql');
 const { getVideoById, getVideos, createVideo} = require('./src/data');

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
          // this is going to be build off of something called GraphQLInputObjectType
        },
      },
      resolve: (_, args) => {
        return createVideo(args.video);//:instead of only args, args.video will be the
                                    //object representing all the fields that we are
                                    //interested in.
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
$ node gql_lesson11.js =>> will bootstrap the server
response:
Listeing on http://localhost:3000

if you go into the browser and look up:
http://localhost:3000/graphql ==> where the middleware is hosted on
and get a graphical view of the tool called GraphiQL that will allow querying
the Schema

//GraphiQL is case sensitive

write in GraphiQL:
mutation M {
  createVideo(video: {
    title: "Foo",
    duration: 300,
    released: false
  }) {
    title
    id
  }
}
result:
{
  "data": {
    "createVideo": {
      "title": "Foo",
      "id": "Rm9v"
    }
  }
}
That video was added to the list, you can check it out.
Also, notice that MutationType in schema panel is now:
createVideo(video: VideoInput!): Video
*/
