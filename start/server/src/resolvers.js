const { paginateResults } = require('./utils');

module.exports = {
  Query: {
    async launches(parent, { pageSize = 20, after }, ctx, info) {
      const allLaunches = await ctx.dataSources.launchAPI.getAllLaunches();
      allLaunches.reverse();

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      });

      const cursor = launches.length
        ? launches[launches.length - 1].cursor
        : null;
      const lastCursor = allLaunches[allLaunches.length - 1].cursor;

      return {
        cursor,
        hasMore: !!cursor && cursor !== lastCursor,
        launches,
      };
    },

    launch(parent, { id: launchId }, ctx, info) {
      return ctx.dataSources.launchAPI.getLaunchById({ launchId });
    },

    me(root, args, ctx, info) {
      return ctx.dataSources.userAPI.findOrCreateUser();
    },
  },

  Mutation: {
    async bookTrips(root, { launchIds }, ctx, info) {
      const { launchAPI, userAPI } = ctx.dataSources;

      const launches = await launchAPI.getLaunchesByIds({ launchIds });
      const results = await userAPI.bookTrips({ launchIds });
      const success = results && launches.length === results.length;

      return {
        success,
        message: success
          ? 'trips booked successfully'
          : `the following trips couldn't be booked: ${launchIds.filter(
              id => !results.includes(id)
            )}`,
        launches,
      };
    },

    async cancelTrip(root, { launchId }, ctx, info) {
      const { launchAPI, userAPI } = ctx.dataSources;

      const result = await userAPI.cancelTrip({ launchId });
      const launch = await launchAPI.getLaunchById({ launchId });
      const success = !!result;

      return {
        success,
        message: success ? 'trip cancelled' : 'failed to cancel the trip',
        launches: [launch],
      };
    },
  },

  Mission: {
    missionPatch(mission, { size = 'LARGE' }, ctx, info) {
      return size === 'LARGE'
        ? mission.missionPatchLarge
        : mission.missionPatchSmall;
    },
  },

  User: {
    async trips(user, args, ctx, info) {
      const { launchAPI, userAPI } = ctx.dataSources;

      const launchIds = await userAPI.getLaunchIdsByUser();
      return launchAPI.getLaunchesByIds({ launchIds });
    },
  },

  Launch: {
    async isBooked({ id: launchId }, args, ctx, info) {
      return ctx.dataSources.userAPI.isBookedOnLaunch({ launchId });
    },
  },
};
