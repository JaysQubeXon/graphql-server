'user strict';

const { graphql, buildSchema } = require('./graphql-server/node_modules/graphql');
// describe the capabilities of the graphql server with schema
const schema = buildSchema(`
  type Video {
    id: ID,
    title: String,
    duration: Int,
    watched: Boolean
  }

  type Query {
    video: Video,
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

const videos = [videoA, videoB];//collection of videos

//create resolver:
const resolvers = {//resolvers for the schema
  video: () => ({
    id: () => '1',
    title: () => 'Foo',
    duration: () => 180,
    watched: () => true,
  }),// need to update resolvers. now we have a videos field  need to tell
       // our GraphQL Schema how to resolve the videos field exactly:
    videos: () => videos,
};
// need to update video to videos by adding one letter:
const query = `
query myFirstQuery {
  video {
    id,
    title,
    duration,
    watched
  }
  videos {
    id,
    title,
    duration,
    watched
  }
}
`;
// run our query agenst the schema we had defined and including our resolvers:
graphql(schema, query, resolvers)
  .then((result) => console.log(result))// promise
  .catch((error) => console.log(error));

/*write in git bash terminal: node <file-name.js>
$ node gql_lesson4.js
{ data: { video: { id: '1', title: 'Foo', duration: 180, watched: true },
{ data: { videos: [ [Object], [Object] ] } }*/
