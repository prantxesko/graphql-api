export const resolvers = {
  Query: {
    getAll: async (parent, args, { data, lastUpdate, error }) => {
      return { count: data.length, ots: data, lastUpdate, error };
    },
    search: async (_, { search }, { data, lastUpdate, error }) => {
      const result = [];
      for (let el of data) {
        for (let fieldName in el) {
          const fieldValue = el[fieldName];
          // console.log(fieldName, fieldValue, search);
          if (fieldValue?.toString() && fieldValue.toString().toLowerCase().includes(search.toLowerCase())) {
            result.push({ ot: el, fieldName, fieldValue: fieldValue.toString() });
            break;
          }
        }
      }
      return { count: data.length, matches: result.length, ots: result, lastUpdate, error };
    },
    searchByField: async (_, { fieldName, fieldValue }, { data, lastUpdate, error }, { schema }) => {
      const result = data.filter(el => el[fieldName]?.toString().toLowerCase() == fieldValue?.toString().toLowerCase());
      return {
        count: result.length,
        ots: result,
        lastUpdate,
        error,
      };
    },
  },
};
