import request from "superagent";

const url = "/api/v1/markers";

export const markerCreateApi = async (markerInfo) => {
  return request
    .post(`${url}/create`)
    .send(markerInfo)
    .then((response) => {
      return response.body;
    });
};

export const markerDeleteApi = async (markerInfo) => {
  return request
    .delete(`${url}/delete`)
    .send(markerInfo)
    .then((response) => {
      return response.body;
    });
};
