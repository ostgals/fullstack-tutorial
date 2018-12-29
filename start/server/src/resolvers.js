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

  Mutation: {},

  Mission: {
    missionPatch(mission, { size = 'LARGE' }, ctx, info) {
      return size === 'LARGE'
        ? mission.missionPatchLarge
        : mission.missionPatchSmall;
    },
  },
};
