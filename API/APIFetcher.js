export default class APIFecther {
  #baseUrlList = ["http://192.168.24.204:8083/", "https://api.her-jai.com/"];
  #urlList;
  #requestParams = {
    method: "POST",
    headers: {},
    redirect: "follow",
  };
  constructor(finalUrl) {
    this.#urlList = this.#baseUrlList.map(baseUrl => baseUrl + finalUrl);
  }

  set token(tokenStr) {
    this.#requestParams.headers.authorization = `Bearer ${tokenStr}`;
    return this;
  }

  set body(data) {
    this.#requestParams.body = data;
    return this;
  }

  set method(method) {
    this.#requestParams.method = method;
    return this;
  }
  async makeRequest(query) {
    try {
      const promises = this.#urlList.map(url => fetch(url + (query ? `?${query}` : ""), this.#requestParams));
      const response = await Promise.any(promises);
      if (!response.ok) throw { message: `${response.status}: ${response.statusText}` };
      return { data: await response.json() };
    } catch (error) {
      return { error: error.message || "Desconocido" };
    }
  }
}
