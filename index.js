'user strict';

const { graphql, buildSchema } = require('./graphql-server/node_modules/graphql');
// describe the capabilities of the graphql server with schema
const schema = buildSchema(`
  type Query {
    id: ID,
    title: String,
    duration: Int,
    watched: Boolean
  }

  type Schema {
    query: Query
  }
`);

//create resolver:
const resolvers = {
  id: () => '1',
  title: () => 'bar',
  duration: () => 180,
  watched: () => true,
};

const query = `
query myFirstQuery {
  id
  title
  duration
  watched
}
`;

graphql(schema, query, resolvers)
  .then((result) => console.log(result))// promise
  .catch((error) => console.log(error));

/*write in git bash terminal: node <file-name.js>
$ node gql_lesson2.js
{ data: { id: '1', title: 'bar', duration: 180, watched: true } } */
