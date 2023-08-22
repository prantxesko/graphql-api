import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import Endpoint from "./API/Endpoint.js";
import { GraphQLError } from "graphql";
import APIFecther from "./API/APIFetcher.js";

import {token} from "./API/token.js";




const endpoint = new Endpoint("ot");
//console.log(await endpoint.getData(tokenStr));

const fetcher = new APIFecther("api/ot");
console.log("fecher",await fetcher.setToken(token.access_token).makeRequest())

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
  type Query{
    ots: [Ot]
  }
  `;

// Lo ideal sería añadir aquí una APIFecher y gestionar desde el resolver la data y el refresco.
// Podríamos importar los types de un archivo para no tener que acceder al código

export const resolvers = {
  Query: {
    ots:async (parent,args,{tokenStr})=>{
      const {data, error}= await endpoint.getData(tokenStr);
      if (error) throw new GraphQLError(error.message || "Desconocido",{
        extensions: {code: error.code}
      })
      return data || null;
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
      const{ token:{access_token} }= await import("./API/token.js");
      return {tokenStr: `Bearer ${access_token}`};
    }
    return { tokenStr: req.headers.authorization };
  },
});

console.log(`🚀 Server ready at ${url}`);



