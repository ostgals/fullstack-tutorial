const { gql } = require('apollo-server');

module.exports = gql`
  enum PatchSize {
    LARGE
    SMALL
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type LaunchConnection {
    cursor: String
    hasMore: Boolean!
    launches: [Launch]!
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Query {
    launches(pageSize: Int, after: String): LaunchConnection
    launch(id: ID!): Launch
    me: User
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Mutation {
    bookTrips(launchIds: [ID!]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String!): String
  }
`;
