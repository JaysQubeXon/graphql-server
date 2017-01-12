'use strict';

const {
  nodeDefinitions,
  fromGlobalId,
} = require('graphql-relay');

const { getObjectById } = require('./data');

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);'use strict';
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
