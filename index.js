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
    video: Video
  }

  type Schema {
    query: Query
  }
`);

//create resolver:
const resolvers = {
  video: () => ({
    id: () => '1',
    title: () => 'Foo',
    duration: () => 180,
    watched: () => true,
  }),
};//resolvers for the schema

const query = `
query myFirstQuery {
  video {
    id,
    title,
    duration,
    watched
  }
}
`;

graphql(schema, query, resolvers)
  .then((result) => console.log(result))// promise
  .catch((error) => console.log(error));

/*write in git bash terminal: node <file-name.js>
$ node gql_lesson3.js
{ data: { video: { id: '1', title: 'Foo', duration: 180, watched: true } } }*/
