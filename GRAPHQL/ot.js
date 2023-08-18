import OtHandler from "../API/OtHandler.js";



export const typeDefs = `
${OtHandler.getTypeDef()}
type User{
  name: String!
  age: Int!
}

type Query {
  testQuery: User
  ots: [Ot]
  ot(id: String): Ot
}
`;

export const resolvers = {
  Query:{
    testQuery: ()=>({
      name: "Xabier",
      age: 0
    }),
    ots: async ()=> await OtHandler.getData(),
    ot: id => ({id:"TEST"})
  }
}