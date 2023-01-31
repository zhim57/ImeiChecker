import { processImeiActual } from "/funk.js";
export const API = {
  async getLastImei() {
    let res;
    try {
      res = await fetch("/api/imeis");
    } catch (err) {
      console.log(err);
    }
    const json = await res.json();


    return json[json.length - 1];
  },
  async getImei(imei, result) {
    let res;

    try {
      res = await fetch("/result1/" + imei);
    } catch (err) {
      console.log(err);
    }
    const json = await res.json();
    result(JSON.stringify(json));

    return json[json.length - 1];
  },
  async addRequest(data, id1) {
    if (location.search.split("=")[1] === undefined) {
      let id = id1;
      const res = await fetch("/api/imeis/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      return json;
    } else {
      let id2 = location.search.split("=")[1];
      console.log(id2);

      const res = await fetch("/api/imeis/" + id2, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      return json;
    }
  },
  async addRequests(data, id1) {
    let id = id1;
    console.log("add requests");
    const res = await fetch("/api/imeis/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json;
  },
  async createImei(data = {}) {
       console.log("create imei");
    const res = await fetch("/api/requests1", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();

    return json;
  },

  async getImeisInRange() {
    const res = await fetch(`/api/imeis/range`);
    const json = await res.json();

    return json;
  },
};
