import API from "./API.js";
import { username, password } from "../credentials.js";

await API.init(username, password);
const endpoint = await API.getEndpoint("partes");
const data = await endpoint.makeRequest();

console.log(data);