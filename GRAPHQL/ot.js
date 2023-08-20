import API from "../API/API.js";
const endpoint = await API.getEndpoint("ot");

const { data, error } = await endpoint.getGqlData();
import { resolvers as oprResolvers } from "./operarios.js";
const { opr } = oprResolvers.Query;

export const typeDefs = `
type Ot{

  ${endpoint.gqlTypeDefs}
  ownerDetail: Operario
}
type Query {
  otCount: Int
  ots: [Ot]
  ot(id: String): Ot
  otSearch(search: String): [Ot]
}
`;

export const resolvers = {
  Ot: {
    ownerDetail: root => {
      return opr(undefined, { id: root.owner });
    },
  },
  Query: {
    otCount: () => data.length,
    ots: () => {
      //console.log(data.length);
      return data;
    },
    ot: id => ({ id: "TEST" }),
    otSearch: (_, { search }) => {
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
