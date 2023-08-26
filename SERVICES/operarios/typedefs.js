export const typeDefs = `
  type Operario{
    IDOperario: ID
    Nombre: String  
    Apellidos: String
    FechaAlta: String
    DescOperario: String
    Baja: String
   
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
    getAll: CollectionResponse
    search (search: String!): SearchResponse
    searchByField(fieldName: String!, fieldValue:String!): CollectionResponse
   

  }
  `;
