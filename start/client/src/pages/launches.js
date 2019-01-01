import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { LaunchTile, Button, Header, Loading } from '../components';

const GET_LAUNCHES_QUERY = gql`
  query GET_LAUNCHES_QUERY($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        id
        isBooked
        rocket {
          id
          name
        }
        mission {
          name
          missionPatch
        }
      }
    }
  }
`;

export default () => (
  <Query query={GET_LAUNCHES_QUERY}>
    {({ data, loading, error, fetchMore }) => {
      if (loading) return <Loading />;
      if (error) return <p>ERROR</p>;
      console.log(data);
      const { launches, hasMore, cursor } = data.launches;

      return (
        <>
          <Header />
          {launches.map(launch => (
            <LaunchTile key={launch.id} launch={launch} />
          ))}
          {hasMore && <MoreButton fetchMore={fetchMore} after={cursor} />}
        </>
      );
    }}
  </Query>
);

const MoreButton = ({ fetchMore, after }) => {
  const updateQuery = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;
    return {
      ...fetchMoreResult,
      launches: {
        ...fetchMoreResult.launches,
        launches: [
          ...prev.launches.launches,
          ...fetchMoreResult.launches.launches,
        ],
      },
    };
  };

  return (
    <Button
      onClick={() =>
        fetchMore({
          variables: { after },
          updateQuery,
        })
      }
    >
      Load More
    </Button>
  );
};
