'use strict';
// was added to the work flow at gql_lesson13
const {
  nodeDefinitions,
  fromGlobalId,
} = require('graphql-relay');

const { getObjectById } = require('./data');
/*when we use nodeDefinitions we would be able to get both nodeInterface and nodeField
that we have defined below as well as nodeField that will add to our query type all from
using nodeDefinitions function.
what this function takes in are two methods: the first one is given a global id, and from
that id we should be able to resolve any kind of id to an individual object.
The second one takes in an object and tells the nodeDefinitions function what kind of type
this object is. and we will need to implement both of them for this nodeInterface and
nodeField to work as expected.
*/
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    return getObjectById(type.toLowerCase(), id);
  },
  (object) => {
    const { videoType } = require('../');
    if (object.title) {
      return videoType;
    }

    return null;
  }
);

exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;
