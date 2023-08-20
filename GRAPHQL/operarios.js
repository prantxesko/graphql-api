import API from "../API/API.js";
const endpoint = await API.getEndpoint("operarios");
const { data, error } = await endpoint.getGqlData();
console.log(endpoint.gqlTypeDefs);

export const typeDefs = `
type Operario{

  ${endpoint.gqlTypeDefs}
}
type Query {
  oprCount: Int
  oprs: [Operario]
  opr(id: String): Operario
  oprSearch(search: String): [Operario]
}
`;

export const resolvers = {
  Query: {
    oprCount: () => data.length,
    oprs: () => {
      console.log(data);
      return data;
    },
    opr: (_, { id }) => {
      console.log(
        "opr",
        id,
        data.find(opr => opr.id === id)
      );
      return data.find(opr => opr.id === id);
    },
    oprSearch: (_, { search }) => {
      console.log(search);
      return data.filter(ot => {
        for (let key in ot) {
          if (typeof ot[key] === "string" && ot[key].toLowerCase().includes(search.toLowerCase())) return true;
        }
        return false;
      });
    },
  },
};
