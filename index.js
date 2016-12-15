'user strict';

const { graphql, buildSchema } = require('graphql');
// describe the capabilities of the graphql server with schema
const schema = buildSchema(`
  type Query {
    foo: String
  }

  type Schema {
    query: Query
  }
`);

//create resolver:
const resolvers = {
  foo: () => 'bar',
}

const query = `
query myFirstQuery {
  foo
}
`;

graphql(schema, query, resolvers)
  .then((result) => console.log(result))// promise
  .catch((error) => console.log(error));

  /*write in git bash terminal: node <file-name.js>
  $ node gql_lesson1.js
  { data: { foo: 'bar' } } */
