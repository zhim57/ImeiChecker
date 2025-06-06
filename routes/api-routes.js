const router = require("express").Router();
const Imei = require("../models/imei.js");
const Imei1 = require("../models/imei1.js");
const request = require("request");
require("dotenv").config();


router.get("/api/imei1F/:imei", async (req, res) => {
  const imei = req.params.imei;
  try {
    const imei1 = await Imei1.findOne({ "requests.deviceImei": parseInt(imei) });
    if (imei1) {
      return res.json(imei1);
    }

    // If not found locally, fetch from external API using the configured token
    const url =
      "https://imeidb.xyz/api/imei/" +
      imei +
      "?token=" +
      process.env.IMEI_API_TOKEN +
      "&format=json";

    request(url, async (error, response, body) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to fetch IMEI" });
      }

      try {
        const apiData = JSON.parse(body);
        const saved = await Imei1.create({ requests: apiData });
        res.json(saved);
      } catch (dbErr) {
        console.log(dbErr);
        if (dbErr.name === "ValidationError") {
          return res.status(400).send(dbErr.errors);
        }
        res.status(500).send({ message: "Something went wrong" });
      }
    });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).send(err.errors);
    }
    res.status(500).send({ message: "Something went wrong" });
  }

  // Imei.find()
  //   .sort({ date: -1 })
  //   .then((dbImei) => {
  //     res.json(dbImei);
  //   })
  //   .catch((err) => {
  //     res.status(400).json(err);
  //   });
});

router.post("/api/requests1", ({ body }, res) => {
  // create new imei record=====
  Imei.create(body)
    .then((dbImei) => {
      res.json(dbImei);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
router.post("/api/createmodel", (req, res) => {
  // create new model record=====
  console.log(req.body);
  Imei1.create(req.body)
    .then((dbImei1) => {
      res.json(dbImei1);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
router.post("/api/createmodel2", async (req, res) => {
  //====

  try {
    let imei2 = await Imei1.findOne({
      "requests.deviceImei": req.body.requests.deviceImei,
    });
    // let imei2 = await Imei1.findOne({ deviceImei:353283075129556 });
    console.log("looking for the imei in local DB");
    console.log(req.body.requests.deviceImei);

    console.log(imei2);
    if (imei2) {
      return res
        .status(400)
        .send({ message: "a record already exists with that imei" });
    }

    const result = await Imei1.create(req.body);
    res.send(result);
  } catch (err) {
    console.log(err);

    if (err.name === "ValidationError") {
      return res.status(400).send(err.errors);
    }
    res.status(500).send("Something went wrong");
  }
});

//=====

router.put("/api/imeis/:id", ({ body, params }, res) => {
  // push the requests array into the last  imei record=====
  Imei.findByIdAndUpdate(
    params.id,
    { $push: { requests: body } },
    { new: true, runValidators: true }
  )
    .then((dbImei) => {
      res.json(dbImei);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// return all imei request logs sorted by creation date
router.get("/api/imeis", (req, res) => {
  Imei.find()
    .sort({ day: -1 })
    .then((dbImeis) => res.json(dbImeis))
    .catch((err) => res.status(400).json(err));
});

// return a range of imei request logs (most recent first)
router.get("/api/imeis/range", (req, res) => {
  Imei.find()
    .sort({ day: -1 })
    .limit(7)
    .then((dbImeis) => res.json(dbImeis))
    .catch((err) => res.status(400).json(err));
});

// return all imei results stored in the secondary collection
router.get("/api/imei1", (req, res) => {
  Imei1.find()
    .sort({ day: -1 })
    .then((dbImei1) => res.json(dbImei1))
    .catch((err) => res.status(400).json(err));
});

// router.get("/api/imeis", (req, res) => {
//   console.log("111");
//   Imei.find()
//     .sort({ date: -1 })
//     .then((dbImei) => {
//       res.json(dbImei);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });
// router.get("/api/imei1", (req, res) => {
//   console.log("222");
//   Imei1.find()
//     .sort({ date: -1 })
//     .then((dbImei) => {
//       res.json(dbImei);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });
router.delete("/api/requests", ({ body }, res) => {
  Imei.findByIdAndDelete(body.id)
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/result1/:imei", (req, res) => {
  console.log("222");

  let imei = req.params.imei;
  console.log("calling the api for this imei");
  console.log(imei);

  request(
    "https://imeidb.xyz/api/imei/" +
      imei +
      "?token=" +
      process.env.IMEI_API_TOKEN +
      "&format=json",
    (error, response, body) => {
      if (error) {
        console.log(error);
      }
      res.send(response.body);
    }
  );
});

module.exports = router;
