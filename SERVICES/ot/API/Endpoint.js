import APIFecther from "./APIFetcher.js";

const enviroment = process.env.NODE_ENV?.toLowerCase()=="production"  ? process.env : await import("../config.js");

const {FINAL_URL, ID} = enviroment;
console.log("env", enviroment)

export default class Endpoint {
  #apiFetcher;
  #id; 
  #data;
 

  constructor() {
    this.#apiFetcher = new APIFecther(`api/${FINAL_URL}`);
    this.#id = ID;

    // console.log(this.#apiFetcher);
  }
  async refreshData(){

  }
  async getData(tokenStr="") {
    //Aquí tenemos que incluir los refrescos y control de errores en clase extendida
    let response;
    if (!this.#data) {
      response = await this.#apiFetcher.makeRequest(tokenStr);
      //this.#data = response.data; //A AGREGAR CUANDO REFRESQUEMOS
    }
    return response; // Puede devolver error
  }
 
}
