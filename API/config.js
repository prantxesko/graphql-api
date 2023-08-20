const config = {
  operarios: {
    finalUrl: "operarios",
    type: "Operario",
    fields: {
      IDOperario: { name: "id", type: "ID" },
      Nombre: { name: "name", type: "String" },
      Apellidos: { name: "surname", type: "String" },
    },
  },
  ot: {
    finalUrl: "ot",
    type: "Ot",
    fields: {
      IDOT: { name: "id", type: "ID" },
      NROT: { name: "number", type: "String" },
      IDOTOrigen: { name: "originId", type: "ID" },
      IDOTSuperPadre: { name: "parentId", type: "ID" },
      DescOT: { name: "description", type: "String" },
      IDTipoOT: { name: "type", type: "String" },
      IDEstadoOT: { name: "state", type: "String" },
      RefPedidoCliente: { name: "reference", type: "String" },
      IDCliente: { name: "client", type: "String" },
      // DescCliente:"SIN DEFINIR",
      IDObra: { name: "project", type: "String" },
      IDActivo: { name: "asset", type: "String" },
      DescActivo: { name: "assetDescription", type: "String" }, //Lo dejamos porque no existe el recurso en la API
      IDZona: { name: "zone", type: "String" },
      DescZona: { name: "zoneDescription", type: "String" }, //Lo dejamos porque no existe el recurso en la API
      coordenadasOT: { name: "location", type: "String" },
      IDOperarioSolicitante: { name: "owner", type: "String" },
      FechaSolicitud: { name: "applicationDate", type: "String" },
      FechaPlanificacion: { name: "planninDate", type: "String" },
      FechaInicio: { name: "startDate", type: "String" },
      FechaCierre: { name: "endDate", type: "String" },
      FechaRevision: { name: "reviewDate", type: "String" },
    },
  },
};

export default config;
