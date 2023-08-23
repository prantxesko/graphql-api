import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import Endpoint from "./API/Endpoint.js";






const endpoint = await new Endpoint().init();



export const typeDefs = `
  type Ot{
    IDOT: ID
    NROT: String
    IDOTOrigen: ID
    IDOTSuperPadre: ID      
    DescOT: String
    IDTipoOT: String        
    IDEstadoOT: String      
    RefPedidoCliente: String
    IDCliente: String       
    DescCliente: String     
    IDObra: String
    IDActivo: String
    DescActivo: String
    IDZona: String
    DescZona: String
    coordenadasOT: String
    IDOperarioSolicitante: String
    FechaSolicitud: String
    FechaPlanificacion: String
    FechaInicio: String
    FechaCierre: String
    FechaRevision: String
  }
  type Error{
    code: String
    message: String
  }
  
  type Response {
    ots: [Ot]
    lastUpdate: String
    error: Error
  }
  type Query{
    otQuery: Response
  }
  `;

// Lo ideal sería añadir aquí una APIFecher y gestionar desde el resolver la data y el refresco.
// Podríamos importar los types de un archivo para no tener que acceder al código

export const resolvers = {
  Query: {
    otQuery:async (parent,args,{tokenStr})=>{
      //console.log(tokenStr)
     const response = await endpoint.getData(tokenStr);
      //console.log("response",response)
      const {data, lastUpdate, error} = response;
    
      return {ots:data, lastUpdate, error }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  //introspection: (process.env.NODE_ENV ?? "").toLowerCase() !== 'production', //Evita que se sepa cómo es la API en producción
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4001 },
  context: async ({ req }) => {
    // De some asinchronous task like get user with req.headers.authorization
    //console.log("req", req.headers.authorization)
    //Tiene que recibir una authorization "Bearer ..." para acceder a la API de Expertis
    // Añadimos un import condicional para local
    if(process.env.NODE_ENV?.toLowerCase()!=="production"){
      const{ token:{access_token:tokenStr} }= await import("./API/token.js");
      return {tokenStr};
    }
    return { tokenStr: req.headers.authorization };
  },
});

console.log(`🚀 Server ready at ${url}`);



