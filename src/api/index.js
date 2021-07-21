import request from "@/utils/request";

export function add(data) {
  return request({
    url: "/add",
    method: "post",
    data,
  });
}
export function query(data) {
  return request({
    url: "/query",
    method: "post",
    data,
  });
}
export function update(data) {
  return request({
    url: "/update",
    method: "post",
    data,
  });
}
export function del(data) {
  return request({
    url: "/delRow",
    method: "post",
    data,
  });
}
