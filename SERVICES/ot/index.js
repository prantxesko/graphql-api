import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import Endpoint from "./API/Endpoint.js";
import { GraphQLError } from "graphql";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typedefs.js";

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
