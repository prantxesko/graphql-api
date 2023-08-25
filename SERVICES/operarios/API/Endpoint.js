import APIFetcher from "./APIFetcher.js";

const enviroment = process.env.NODE_ENV?.toLowerCase() == "production" ? process.env : await import("./env.js");

const { FINAL_URL, ID, USERNAME, PASSWORD } = enviroment;

//console.log("env", enviroment)

/*
Devolver un tipo response
{
  data (si error distinto de 401)
  error
}


*/

export default class Endpoint {
  #apiFetcher = new APIFetcher(`api/${FINAL_URL}`);
  #data;
  #lastUpdate;

  async init() {
    const body = new URLSearchParams();
    body.append("username", USERNAME);
    body.append("password", PASSWORD);
    body.append("grant_type", "password");
    let response = await new APIFetcher("ObtenerToken").setBody(body).makeRequest();
    let { data, error } = response;
    if (error) throw error;
    const { access_token: tokenStr } = data;
    ({ data, error } = await this.#apiFetcher
      .setBody(null)
      .setToken(tokenStr)
      .setQuery("LIMITEPAGINA=10") //  ***PARA TESTING
      .makeRequest());
    if (error) throw error;
    this.#data = data;
    this.#lastUpdate = new Date().toLocaleString("es");
    return this;
  }

  async #refreshData(tokenStr) {
    //Solo se llama si ya existe data
    const { data, error } = await this.#apiFetcher.setToken(tokenStr).setQuery(`?lastUpdate=${this.#lastUpdate}`).makeRequest();
    //if(!error) this.#lastUpdate = new Date().toLocaleString("es");
    return { data, error };
  }

  async getData(tokenStr = "") {
    if (!this.#data) throw { message: "Use init() method before trying to get data" };
    // El endpoint no admite identificadoresp por lo que la única forma de gestionar eliminados es llamada completa
    if (!ID) {
      const { data, error } = await this.#apiFetcher.setToken(tokenStr).makeRequest();
      if (!error) {
        this.#data = data;
        this.#lastUpdate = new Date().toLocaleString("es");
      }
      return { data: this.#data, lastUpdate: this.#lastUpdate, error }; // Puede devolver error
    } else {
      const { data: updatedData, error: updateError } = await this.#apiFetcher.setQuery(`lastUpdate=${this.#lastUpdate}`).setToken(tokenStr).makeRequest();
      const { data: ids, error: idsError } = await new APIFetcher(`api/${FINAL_URL}/identificadores`).setToken(tokenStr).makeRequest();
      // Si no hay errores actualizamos la data
      if (!updateError && !idsError) {
        //Creamos un mapa con los ids vigentes;
        const mapedData = new Map(ids.map(id => [id, true]));
        // console.log(mapedData)
        // Recorremos la data actual y metemos en el mapa las que estén en los ids (no han sido borradas)
        for (let el of this.#data) {
          //guardamos en el mapa las ots no borradas
          const elId = el[ID];
          if (mapedData.get(elId)) {
            mapedData.set(elId, el);
          }
        }
        // Actualizamos o añadimos las actualizadas
        for (let el of updatedData) {
          const elId = el[ID];
          mapedData.set(elId, el);
        }
        //console.log(mapedData)
        this.#data = Array.from(mapedData.values());
        this.#lastUpdate = new Date().toLocaleString("es");
      }
      return { data: this.#data, lastUpdate: this.#lastUpdate, error: updateError || idsError }; // Puede devolver error
    }
  }
}
