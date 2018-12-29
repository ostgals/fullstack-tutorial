const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const { createStore } = require('./utils');

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }),
  context: async ({ req }) => {
    const token = (req.headers && req.headers.authorization) || '';
    const email = new Buffer(token, 'base64').toString('ascii');
    console.log(token, email);

    if (!isEmail.validate(email)) {
      return { user: null };
    }

    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] ? users[0].dataValues : null;

    return { user };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server is running at ${url}`);
});
