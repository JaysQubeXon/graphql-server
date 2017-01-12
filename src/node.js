'use strict';
// was added to the work flow at gql_lesson12
const {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');
const { videoType } = require('../');

const nodeInterface = new GraphQLInterfaceType({
  name: 'Node',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolveType: (object) => {
    if (object.title) {
      return videoType;
    }

    return null;
  },
});

module.exports = nodeInterface;
//was used only one lesson.
