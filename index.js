import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs as otTypeDefs, resolvers as otResolvers } from "./GRAPHQL/ot.js";


const server = new ApolloServer({
  typeDefs:[ otTypeDefs],
  resolvers:[otResolvers],
  introspection: (process.env.NODE_ENV ?? "").toLowerCase() !== 'production', //Evita que se sepa cómo es la API en producción
  
  
})

const { url } = await startStandaloneServer(server,{
  listen: {port: 4001},
  context: async ({req})=>{ 
    // De some asinchronous task like get user with req.headers.authorization
    //console.log("req", req.headers)
    return{user: { id: 12345, roles: ['user', 'admin'] } }
  }
})



console.log(`🚀 Server ready at ${url}`)