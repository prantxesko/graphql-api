import API from "./API.js";
import { username, password } from "./credentials.js";

await API.init(username, password);
const endpoint = await API.getEndpoint("ot");
const { data } = await endpoint.makeRequest("limitepagina=10&desc=true");

export default class OtHandler {
  static #fieldMap = {
    IDOT: { fieldName: "id", type: "ID" },
    NROT: { fieldName: "number", type: "String" },
    IDOTOrigen: { fieldName: "originId", type: "ID" },
    IDOTSuperPadre: { fieldName: "parentId", type: "ID" },
    DescOT: { fieldName: "description", type: "String" },
    IDTipoOT: { fieldName: "type", type: "String" },
    IDEstadoOT: { fieldName: "state", type: "String" },
    RefPedidoCliente: { fieldName: "reference", type: "String" },
    IDCliente: { fieldName: "client", type: "String" },
    // DescCliente:"SIN DEFINIR",
    IDObra: { fieldName: "project", type: "String" },
    IDActivo: { fieldName: "asset", type: "String" },
    DescActivo: { fieldName: "assetDescription", type: "String" }, //Lo dejamos porque no existe el recurso en la API
    IDZona: { fieldName: "zone", type: "String" },
    DescZona: { fieldName: "zoneDescription", type: "String" }, //Lo dejamos porque no existe el recurso en la API
    coordenadasOT: { fieldName: "location", type: "String" },
    IDOperarioSolicitante: { fieldName: "owner", type: "String" },
    FechaSolicitud: { fieldName: "applicationDate", type: "String" },
    FechaPlanificacion: { fieldName: "planninDate", type: "String" },
    FechaInicio: { fieldName: "startDate", type: "String" },
    FechaCierre: { fieldName: "endDate", type: "String" },
    FechaRevision: { fieldName: "reviewDate", type: "String" },
  };

  static #data = data.map(ot => {
    const mapedOt = {};
    for (let key in ot) {
      //   console.log(key, this.#fieldMap[key])

      const fieldName = this.#fieldMap[key]?.fieldName;

      // Si hemos mapeado el campo, lo pasamos a la data final con la key nueva.
      if (fieldName) mapedOt[fieldName] = ot[key];
    }
    return mapedOt;
  });

  static async getData() {
    return data;
    // Aquí hay que realizar el "refresco" desde la API
    return this.#data;
  }

  static getTypeDef() {
    const map = this.#fieldMap;
    let result = "type Ot {";
    for (let key in map) {
      const { fieldName, type } = map[key];
      result += `
      ${fieldName}:${type}`;
    }
    result += "}";
    return result;
  }
  static test() {
    const map = this.#fieldMap;
    for (let key in map) {
      const field = map[key];
      console.log(`${field.fieldName}:root=>root.${key},`);
    }
  }
}

// console.log(OtHandler.test());
