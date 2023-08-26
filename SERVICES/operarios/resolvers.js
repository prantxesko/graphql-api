export const resolvers = {
  Query: {
    getAll: async (_, __, { data, lastUpdate, error }) => ({ count: data.length, operarios: data, lastUpdate, error }),

    search: async (_, { search }, { data, lastUpdate, error }) => {
      const result = [];
      for (let el of data) {
        for (let fieldName in el) {
          const fieldValue = el[fieldName];
          if (fieldValue?.toString() && fieldValue.toString().toLowerCase().includes(search.toLowerCase())) {
            result.push({ operario: el, fieldName, fieldValue: fieldValue.toString() });
            break;
          }
        }
      }
      return { count: result.length, operarios: result, lastUpdate, error };
    },
    searchByField: async (_, { fieldName, fieldValue }, { data, lastUpdate, error }) => {
      const result = data.filter(el => el[fieldName]?.toString().toLowerCase() == fieldValue?.toString().toLowerCase());
      return {
        count: result.length,
        operarios: result,
        lastUpdate,
        error,
      };
    },
  },
};
