
class APIFecther{
  #baseUrlList= ["http://192.168.24.204:8083/", "https://api.her-jai.com/"];
  #urlList;
  #requestParams =  {
    method: "POST",
    headers:{},
    redirect: "follow",
  };
  constructor(finalUrl){
    this.#urlList = this.#baseUrlList.map(baseUrl => baseUrl + finalUrl);
  }
 
  set token(tokenStr){
    this.#requestParams.headers.authorization =  `Bearer ${tokenStr}`
    return this;
  }

  set body(data){
    this.#requestParams.body = data;
    return this;
  }

  set method(method){
    this.#requestParams.method = method;
    return this;
  }
  async makeRequest(query){
    try{
      const promises = this.#urlList.map(url => fetch(url + (query ? `?${query}` : ""), this.#requestParams));
      const response = await Promise.any(promises);
      if(!response.ok) throw {message: `${response.status}: ${response.statusText}`};
      return {data: await response.json()};
    }catch(error){
      return {error: error.message || "Desconocido"}
    }
  }
}


class Endpoint{
  #apiFetcher;
  constructor(finalUrl, tokenStr){
    this.#apiFetcher = new APIFecther(`api/${finalUrl}`)
    this.#apiFetcher .token = tokenStr;
    console.log(this.#apiFetcher)
  }

  makeRequest(query){
    return this.#apiFetcher.makeRequest(query);
  }
}

export default class API{
  static #username;
  static #password;
  static #tokenObj;
  constructor() {
    throw new Error('Use API.init() for authorization and API.getEndpoint() for handlers');
 }
  
  static async init(username, password){
    if(this.#tokenObj) return;
    const tokenFetcher = new APIFecther("ObtenerToken");
    const urlencoded = new URLSearchParams();
    urlencoded.append("username", username);
    urlencoded.append("password", password);
    urlencoded.append("grant_type", "password");
    tokenFetcher.body = urlencoded;

    const {data, error} = await tokenFetcher.makeRequest();
      if(error) throw "Error initialaizing API with credentials";
      this.#username= username;
      this.#password = password,
      this.#tokenObj = data;
    }
 
  static getEndpoint(endpointName){
    if(!this.#tokenObj) throw "Use init method to initialize API with username and password"
    return new Endpoint(endpointName, this.#tokenObj.access_token);
  }
}



