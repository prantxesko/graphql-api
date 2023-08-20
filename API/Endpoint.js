import config from "./config.js";
import APIFecther from "./APIFetcher.js";

export default class Endpoint {
  #apiFetcher;
  #type;
  #fields;
  #data;
  #mapDataToGql = () => {
    const mapedData = [];
    this.#data.forEach(el => {
      const mapedEl = {};
      for (let key in el) {
        const field = this.#fields[key];
        const name = field ? field.name : null;

        if (name) mapedEl[name] = el[key];
      }
      mapedData.push(mapedEl);
    });
    return mapedData;
  };

  constructor(name, tokenStr) {
    const { finalUrl, type, fields } = config[name];
    this.#apiFetcher = new APIFecther(`api/${finalUrl}`);
    this.#apiFetcher.token = tokenStr;
    this.#type = type;
    this.#fields = fields;

    // console.log(this.#apiFetcher);
  }

  async getData() {
    //Aquí tenemos que incluir los refrescos y control de errores
    let response;
    if (!this.#data) {
      response = await this.#apiFetcher.makeRequest("desc=true");
      this.#data = response.data;
    }
    return response; // Puede devolver error
  }
  async getGqlData() {
    await this.getData();
    return { data: this.#mapDataToGql() };
  }
  get gqlTypeDefs() {
    return Object.values(this.#fields).map(({ name, type }) => `${name}:${type}`);
  }
}
