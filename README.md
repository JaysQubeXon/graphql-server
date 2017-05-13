# graphql-server
GraphQL server for backend state management for my React-Native Applications

# clone and install

`git clone https://github.com/JaysQubeXon/graphql-server.git`

`npm install`


# tutorial 
## initial setup:

`npm install express express-graphql graphql --save`

require in `index.js` at root directory:

```
  'user strict';

  const express = require('express');
  const graphqlHTTP = require('express-graphql');

  const {
    GraphQLSchema,
    GraphQLObjectType,
  } = require('graphql');
  
```

then add the schema:

```
  const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
  });

  server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
  }));
```

and start the server:
```
  server.listen(PORT, () => {
    console.log(`Listeing on http://localhost:${PORT}`);
  });
```

TODO: add a queryType and mudationType.
