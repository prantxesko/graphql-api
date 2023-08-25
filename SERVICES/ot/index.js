import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import Endpoint from "./API/Endpoint.js";
import { GraphQLError } from "graphql";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const DEFAULT_PORT = 4001;

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
      console.log("Error iniciando el endpoint de ots tercer (último) intento ", error);
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

export const resolvers = {
  Query: {
    query: async (parent, args, { data, lastUpdate, error }) => {
      return { count: data.length, ots: data, lastUpdate, error };
    },
    otById: async (_, { id }, { data, lastUpdate, error }) => {
      const ot = data ? data.find(({ IDOT }) => IDOT == id) : null;
      return { ot, lastUpdate, error };
    },
    otByNumber: async (_, { number }, { data, lastUpdate, error }) => {
      const ot = data ? data.find(({ NROT }) => NROT == number) : null;
      return { ot, lastUpdate, error };
    },
    search: async (_, { search }, { data, lastUpdate, error }) => {
      const result = [];
      for (let el of data) {
        for (let fieldName in el) {
          const fieldValue = el[fieldName];
          // console.log(fieldName, fieldValue, search);
          if (fieldValue?.toString() && fieldValue.toString().toLowerCase().includes(search.toLowerCase())) {
            result.push({ ot: el, fieldName, fieldValue: fieldValue.toString() });
            break;
          }
        }
      }
      return { count: result.length, ots: result, lastUpdate, error };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: (process.env.NODE_ENV ?? "").toLowerCase() !== "production", //Evita que se sepa cómo es la API en producción
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || DEFAULT_PORT },
  context: async ({ req }) => {
    if (endpointError)
      throw new GraphQLError("Se ha producido un error intentando iniciar el servicio", {
        extensions: { code: "500" },
      });
    //Tiene que recibir una authorization (solo token) para acceder a la API de Expertis
    // Añadimos un import condicional para local
    let tokenStr = req.headers.authorization;
    if (process.env.NODE_ENV?.toLowerCase() !== "production") {
      const { token } = await import("./API/token.js");
      tokenStr = token.access_token;
    }
    const { data, lastUpdate, error } = await endpoint.getData(tokenStr);
    if (error?.code == "401")
      throw new GraphQLError("Unauthorized", {
        extensions: { code: "401" },
      });
    return { data, lastUpdate, error };
  },
});

console.log(`🚀 Server ready at ${url}`);
