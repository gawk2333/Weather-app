import request from "superagent";

const url = "/api/v1/users";

export const signUpApi = async (userInfo) => {
  return request
    .post(`${url}/register`)
    .send(userInfo)
    .then((response) => {
      return response.body;
    });
};

export const signInApi = async (loginInfo) => {
  return request
    .post(`${url}/login`)
    .send(loginInfo)
    .then((response) => {
      return response.body;
    });
};

export const validateUserApi = async (authToken) => {
  return request
    .post(`${url}/validation/${authToken}`)
    .then((response) => response.body);
};
