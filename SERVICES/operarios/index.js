import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import Endpoint from "./API/Endpoint.js";
import { GraphQLError } from "graphql";

const DEFAULT_PORT=4002;

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
  type Operario{
    IOperario: ID
    Nombre: String  
    Apellidos: String
    FechaAlta: String
    DescOperario: String
   
  }
  type Error{
    code: String
    message: String
  }
  
  type CollectionResponse {
    count: Int!
    operarios: [Operario]
    lastUpdate: String
    error: Error
  }
  type Response{
    operario: Operario
    lastUpdate: String
    error: Error
  }
  type Search{
    operario: Operario
    fieldName: String!
    fieldValue: String!
  }
  type SearchResponse{
    count: Int!
    operarios: [Search]
    lastUpdate: String
    error: Error
  }
  type Query{
    query: CollectionResponse
    search (search: String!): SearchResponse
   

  }
  `;

// Lo ideal sería añadir aquí una APIFecher y gestionar desde el resolver la data y el refresco.
// Podríamos importar los types de un archivo para no tener que acceder al código

export const resolvers = {
  Query: {
    query: async (parent, args, { data, lastUpdate, error }) => {
      return { count:data.length, operarios:data, lastUpdate, error };
    },
   
    search: async (_, { search }, { data, lastUpdate, error }) => {
      const result = [];
      for(let el of data){
        for(let fieldName in el){
          const fieldValue = el[fieldName];
          if(fieldValue?.toString() && fieldValue.toString().toLowerCase().includes(search.toLowerCase())){
            //console.log(fieldValue)
            result.push({el, fieldName, fieldValue:fieldValue.toString()});
            break;
          }
        }
      }
      return {count:result.length, operarios:result, lastUpdate, error}
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
