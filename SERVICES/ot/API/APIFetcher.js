export default class APIFecther {
  #hostList = ["http://192.168.24.204:8083/", "https://api.her-jai.com/"];
  #urlList;
  #requestParams = {
    method: "POST",
    headers: {},
    redirect: "follow",
  };
  #query="";
  constructor(url) {
    this.setUrl(url)
  }

  setUrl(url=""){
    this.#urlList = this.#hostList.map(host => host + url);
  }

  setToken(tokenStr) {
    this.#requestParams.headers.authorization = `Bearer ${tokenStr}`;
    return this;
  }

  setQuery(queryStr){
    this.#query=`?${queryStr}`;
  }

  set body(data) {
    this.#requestParams.body = data;
    return this;
  }

  set method(method) {
    this.#requestParams.method = method;
    return this;
  }
  async makeRequest(tokenStr) {
    try {
      if(tokenStr) this.#requestParams.headers.authorization = tokenStr;
       this.#urlList.map(url => console.log(url+this.#query , this.#requestParams));

      const promises = this.#urlList.map(url => fetch(url+this.#query , this.#requestParams));
      const response = await Promise.any(promises);
      if (!response.ok) throw { code: response.status, message: response.statusText };
      return { data: await response.json() };
    } catch (error) {
      return { error };
    }finally{
      this.#query="";
    }
    
  }
}
