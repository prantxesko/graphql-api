import host from "./host.js";

export default class APIFetcher {
  #hostList = host;
  #urlList;
  #requestParams = {
    method: "POST",
    headers: {},
    redirect: "follow",
  };
  #query = "";
  constructor(url) {
    this.#setUrl(url);
  }

  #setUrl(url = "") {
    this.#urlList = this.#hostList.map(host => host + url);
    return this;
  }

  setToken(tokenStr) {
    this.#requestParams.headers.authorization = `Bearer ${tokenStr}`;
    return this;
  }

  setQuery(queryStr) {
    this.#query = `?${queryStr}`;
    return this;
  }

  setBody(data) {
    this.#requestParams.body = data;
    return this;
  }

  set method(method) {
    this.#requestParams.method = method;
    return this;
  }
  async makeRequest(trace) {
    let result = {};
    try {
      if (trace) this.#urlList.map(url => console.log(url + this.#query, "\n", this.#requestParams));

      const promises = this.#urlList.map(url => fetch(url + this.#query, this.#requestParams));
      const response = await Promise.any(promises);
      if (trace) console.log("RESPONSE: ", response.status, response.statusText);
      if (!response.ok) throw { code: response.status, message: response.statusText };
      result.data = await response.json();
    } catch (error) {
      result.error = error;
    } finally {
      this.#query = "";
      return result;
    }
  }
}
