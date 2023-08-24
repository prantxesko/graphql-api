import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import Endpoint from "./API/Endpoint.js";
import { GraphQLError } from "graphql";

const DEFAULT_PORT=4001;

let endpoint, endpointError;

//Inicio del servicio. Error si no puede acceder a la API de Cobertec

try {
  endpoint = await new Endpoint().init();
} catch (error) {
  console.log("Error iniciando el endpoint de ots primer intento", error);
  try {
    endpoint = await new Endpoint().init();
  } catch (error) {
    console.log("Error iniciando el endpoint de ots segundo intento", error);
    try {
      endpoint = await new Endpoint().init();
    } catch (error) {
      console.log(
        "Error iniciando el endpoint de ots tercer (último) intento ",
        error
      );
      endpointError = error;
    }
  }
}

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
  
  type CollectionResponse {
    count: Int!
    ots: [Ot]
    lastUpdate: String
    error: Error
  }
  type Response{
    ot: Ot
    lastUpdate: String
    error: Error
  }
  type Search{
    ot: Ot
    fieldName: String!
    fieldValue: String!
  }
  type SearchResponse{
    count: Int!
    ots: [Search]
    lastUpdate: String
    error: Error
  }
  type Query{
    query: CollectionResponse
    search (search: String!): SearchResponse
    otById(id:Int!): Response
    otByNumber(number: String!): Response

  }
  `;

// Lo ideal sería añadir aquí una APIFecher y gestionar desde el resolver la data y el refresco.
// Podríamos importar los types de un archivo para no tener que acceder al código

export const resolvers = {
  Query: {
    query: async (parent, args, { data:ots, lastUpdate, error }) => {
      return { count:ots.length, ots, lastUpdate, error };
    },
    otById: async (_, { id }, { data, lastUpdate, error }) => {
      console.log("otByID");
      const ot = data ? data.find(({ IDOT }) => IDOT == id) : null;
      return {  ot, lastUpdate, error };
    },
    otByNumber: async (_, { number }, { data, lastUpdate, error }) => {
      const ot = data ? data.find(({ NROT }) => NROT == number) : null;
      return { ot, lastUpdate, error };
    },
    search: async (_, { search }, { data, lastUpdate, error }) => {
      const ots = [];
      for(let ot of data){
        for(let fieldName in ot){
          const fieldValue = ot[fieldName];
          if(fieldValue?.toString() && fieldValue.toString().toLowerCase().includes(search.toLowerCase())){
            //console.log(fieldValue)
            ots.push({ot, fieldName, fieldValue:fieldValue.toString()});
            break;
          }
        }
      }
      return {count:ots.length, ots, lastUpdate, error}
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  //introspection: (process.env.NODE_ENV ?? "").toLowerCase() !== 'production', //Evita que se sepa cómo es la API en producción
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || DEFAULT_PORT },
  context: async ({ req }) => {
    if (endpointError)
      throw new GraphQLError(
        "Se ha producido un error intentando iniciar el servicio",
        {
          extensions: { code: "500" },
        }
      );
    //Tiene que recibir una authorization (solo token) para acceder a la API de Expertis
    // Añadimos un import condicional para local
    let tokenStr = req.headers.authorization;
    if (process.env.NODE_ENV?.toLowerCase() !== "production") {
      const { token } = await import("./API/token.js");
      
      tokenStr = token.access_token;
    }
    const { data, lastUpdate, error } = await endpoint.getData(tokenStr );
    if (error?.code == "401")
      throw new GraphQLError("Unauthorized", {
        extensions: { code: "401" },
      });

    return { data, lastUpdate, error };
  },
});

console.log(`🚀 Server ready at ${url}`);
