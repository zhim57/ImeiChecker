import { processImeiActual } from "/funk-enhanced.js";

export const API = {
  async oneImeiDb(imei, result) {
    let res;
    try {
      res = await fetch("/api/imei1F/" + imei);
      if (res) {
        console.log(res.status);
        if (res.status === 200) {
          const json = await res.json();
          result(json.requests);
          return;
        }
      }
    } catch (err) {
      console.log("error api/imei1F/  " + err);
    }
    result("error");

    // const json = await res.json();
    // return json;
  },

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

    // `/result1/:imei` returns a single object, not an array. Returning
    // `json[json.length - 1]` results in `undefined` which breaks callers.
    // Return the parsed object directly instead.
    return json;
  },

  async getAllImei(imei, result) {
    let res;
    try {
      res = await fetch("/api/imeis");
    } catch (err) {
      console.log(err);
    }
    const json = await res.json();
    // result(JSON.stringify(json));

    return json;
  },
  async getAllImei1(imei, result) {
    let res;
    try {
      res = await fetch("/api/imei1");
    } catch (err) {
      console.log(err);
    }
    const json = await res.json();
    // result(JSON.stringify(json));

    return json;
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

  async createModel(data) {
    console.log("create imei1");

    const res = await fetch("/api/createmodel", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();

    return json;
  },
  async createModel2(data) {
    console.log("create imei1");

    const res = await fetch("/api/createmodel2", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();

    return json;
  },

  async getPhoneModel(model) {
    try {
      const res = await fetch(`/api/phone-model/${encodeURIComponent(model)}`);
      if (res.status !== 200) return null;
      return await res.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async createPhoneModel(data) {
    try {
      const res = await fetch('/api/phone-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async updatePhoneModel(model, data) {
    try {
      const res = await fetch(`/api/phone-model/${encodeURIComponent(model)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  // NEW: Intelligent IMEI checking with caching
  async checkImei(imei, userId = null) {
    try {
      const url = userId
        ? `/api/imei/${imei}?userId=${encodeURIComponent(userId)}`
        : `/api/imei/${imei}`;
      const res = await fetch(url);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to check IMEI');
      }
      return await res.json();
    } catch (err) {
      console.error('Error checking IMEI:', err);
      throw err;
    }
  },

  // NEW: Update phone model bands manually
  async updateBands(model, bandsData) {
    try {
      const res = await fetch(`/api/phone-model/${encodeURIComponent(model)}/bands`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bandsData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update bands');
      }
      return await res.json();
    } catch (err) {
      console.error('Error updating bands:', err);
      throw err;
    }
  },

  // NEW: Get system statistics
  async getStats() {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('Error fetching stats:', err);
      return null;
    }
  },
};
