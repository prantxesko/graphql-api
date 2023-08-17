import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "./API/ot.js";

const server = new ApolloServer({
  typeDefs:[ otTypeDefs, parteTypeDefs],
  resolvers: [otResolvers, parteResolvers],
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