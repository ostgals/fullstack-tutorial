import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

import React from 'react';
import { render } from 'react-dom';

import gql from 'graphql-tag';

import Pages from './pages';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache(),
});

render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.querySelector('#root')
);
