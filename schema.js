const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Plugin',
        fields: {
            title: {
                type: GraphQLString,
                resolve() {
                    return 'world';
                }
            },
            id: {
                type: GraphQLString,
                resolve() {
                    return 'dynmap';
                }
            }
        }
    })
});