const API = {
  async getLastWorkout() {
    let res;
    try {
      res = await fetch("/api/imeis");
      console.log("res: "+ JSON.stringify(res));
 
    } catch (err) {
      console.log(err)
    }
    const json = await res.json();

    return json[json.length - 1];
  },
  async addRequest(data) {
   var id = location.search.split("=")[1];
    console.log(id)
    // const    
     id = 3;
     console.log(id)
    const res = await fetch("/api/requests/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    return json;
  },
  // async addExercise(data) {
  //   const id = location.search.split("=")[1];
  //   // const id = 3;

  //   const res = await fetch("/api/workouts/" + id, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data)
  //   });

  //   const json = await res.json();

  //   return json;
  // },
  async createImei(data={}) {
    console.log("idiot0");
    console.log(data);
    const res = await fetch("/api/requests1", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
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
