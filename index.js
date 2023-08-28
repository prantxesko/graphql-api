import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const getAllOts = () => `
{
  getAll{
    count
    ots{
      IDOperarioSolicitante
    }
  }
}
`;
const getOprById = id => `
{
  searchByField(fieldName: "IDOperario", fieldValue: "${id}" ){
    operarios{
      Nombre
      Apellidos
    }
  }
}
`;

const params = {
  method: "POST",
  headers: {
    "Content-type": "application/json",
    Authorization:
      "l4zjxACPYRWuA6xFR_KALOX7rer47Hu9N-JnQ5UDuMzfN7T9zadhj6t-TB3VzmOESY0UKLNU3BL5kqKhBBCladN7CAtIQymAaalXvyL0rlQ8x1UulC3DD11YnMwTH44Yt-L3Ty5Ex48GG0LrSP7GWicPXUD7g9UNbZKIrpfhgvz6Skb5IDd3d18TfCjq9x8PvwA16TrWFM4vQ0haTRgyASX4I7cpUS0MZI7vkNM2cR0",
  },
};

// fetch("https://ot-dot-herjai-2023.ew.r.appspot.com/", { ...params, body: JSON.stringify({ query: getAllOts() }) })
//   .then(response => response.json())
//   .then(
//     ({
//       data: {
//         getAll: { ots },
//       },
//     }) => ots.filter(({ IDOperarioSolicitante: id }) => id)
//   )
//   .then(console.log)
//   .catch(console.log);

fetch("https://operarios-dot-herjai-2023.ew.r.appspot.com/", { ...params, body: JSON.stringify({ query: getOprById("025") }) })
  .then(response => response.json())
  .then(
    ({
      data: {
        searchByField: { operarios },
      },
    }) => console.log(operarios)
  )
  .catch(console.log);

/* const server = new ApolloServer({
  typeDefs: [otTypeDefs, oprTypeDefs],
  resolvers: [otResolvers, oprResolvers],
  introspection: (process.env.NODE_ENV ?? "").toLowerCase() !== "production", //Evita que se sepa cómo es la API en producción
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: async ({ req }) => {
    // De some asinchronous task like get user with req.headers.authorization
    //console.log("req", req.headers)
    return { user: { id: 12345, roles: ["user", "admin"] } };
  },
});

console.log(`🚀 Server ready at ${url}`); */
