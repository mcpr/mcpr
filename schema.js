const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} = require('graphql');

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Plugin',
        fields: {
            title: {
                type: GraphQLString,
                description: 'Title of the plugin.',
                resolve() {
                    return 'Dynmap';
                }
            },
            id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Unique ID of the plugin.',
                resolve() {
                    return 'dynmap';
                }
            },
            author: {
                type: GraphQLString,
                description: 'Author of the plugin.',
                resolve() {
                    return 'mikeprimm';
                }
            },
            short_description: {
                type: GraphQLString,
                description: 'A short description of the plugin.',
                resolve() {
                    return 'Dynamic \"Google Maps\" style web maps for your Spigot/Bukkit server';
                }
            },
            latest_version: {
                type: GraphQLString,
                description: 'Latest version number of the plugin.',
                resolve() {
                    return '2.4';
                }
            },
            last_ver_date: {
                type: GraphQLString,
                description: 'Date on which the last version of the plugin was published.',
                resolve() {
                    return 'Feb 11, 2017';
                }
            },
            source: {
                type: GraphQLString,
                description: 'Url of the source code.',
                resolve() {
                    return 'webbukkit/dynmap';
                }
            },
            github: {
                type: GraphQLString,
                description: 'Specifies if the source code url is from GitHub.',
                resolve() {
                    return 'webbukkit/dynmap';
                }
            }
        }
    })
});