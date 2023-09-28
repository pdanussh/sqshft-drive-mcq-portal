import { API_METHODS, API_URL } from "./constants";

export const isUserLoggedIn = () => {
  return localStorage.getItem("email")?.length > 0;
};

export const makeAPICall = async ({
  endpoint = "",
  method = API_METHODS.GET,
  body = {},
  headers = {},
}) => {
  let apiOptions = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
  };
  if(method !== API_METHODS.GET){
    apiOptions['body'] =  JSON.stringify(body)
  }
  const rawResponse = await fetch(`${API_URL}${endpoint}` , {...apiOptions});
  const response = await rawResponse.json();
  return response;
};
