const enviroment = process.env.NODE_ENV == "production" ? process.env : await import("./credentials.js");

const { USERNAME, PASSWORD } = enviroment;

import config from "./config.js";
import APIFecther from "./APIFetcher.js";
import Endpoint from "./Endpoint.js";

export default class API {
  static #tokenObj;
  static #endpoints = {};
  constructor() {
    throw new Error("Use API.init() for authorization and API.getEndpoint() for handlers");
  }

  static async init() {
    if (this.#tokenObj) return;
    const tokenFetcher = new APIFecther("ObtenerToken");
    const urlencoded = new URLSearchParams();
    urlencoded.append("username", USERNAME);
    urlencoded.append("password", PASSWORD);
    urlencoded.append("grant_type", "password");
    tokenFetcher.body = urlencoded;

    const { data, error } = await tokenFetcher.makeRequest();

    if (error) throw "Error initialaizing API with credentials";
    this.#tokenObj = data;
    for (let endpoint in config) {
      this.#endpoints[endpoint] = new Endpoint(endpoint, this.#tokenObj.access_token);
    }
  }

  static getEndpoint(endpointName) {
    if (!this.#tokenObj) throw "Use init method to initialize API with username and password";
    return this.#endpoints[endpointName];
  }
}
try {
  await API.init();
} catch (error) {
  console.log(error);
  console.log("Error iniciando la API. Comprueba que las variables de entorno USERNAME Y PASSWORD estén definidas");
}
