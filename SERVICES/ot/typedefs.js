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
    count: Int
    matches: Int!
    ots: [Search]
    lastUpdate: String
    error: Error
  }
  type Query{
    getAll: CollectionResponse
    search (search: String!): SearchResponse
    searchByField(fieldName: String!, fieldValue: String!): CollectionResponse
  }
  `;
