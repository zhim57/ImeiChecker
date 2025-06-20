const router = require("express").Router();
const Imei = require("../models/imei.js");
const Imei1 = require("../models/imei1.js");
const PhoneModel = require("../models/phoneModel.js");
const fetch = global.fetch || ((...args) => import('node-fetch').then(({default: f}) => f(...args)));
require("dotenv").config();


async function updatePhoneModel(raw) {
  // The API returns the payload under a `data` key. Support both shapes.
  const data = raw.data || raw;

  const model = data.models?.[0] || data.model;
  if (!model) return;

  // Extract informational fields for persistence
  const modelName = data.name || data.deviceName || null;
  const deviceImage = data.device_image || data.deviceImage || null;
  const netTech = Array.isArray(data.device_spec?.nettech)
    ? data.device_spec.nettech.join(', ')
    : data.device_spec?.nettech || null;
  const speed = Array.isArray(data.device_spec?.speed)
    ? data.device_spec.speed.join(', ')
    : data.device_spec?.speed || null;

  const freq = data.frequency || [];
  const categories = { lte: [], wcdma: [], twoG: [] };
  freq.forEach((f) => {
    const up = f.toUpperCase();
    if (up.includes('LTE FDD BAND')) categories.lte.push(f.slice(13));
    else if (up.includes('WCDMA FDD BAND')) categories.wcdma.push(f.slice(15));
    else if (up.includes('GSM')) categories.twoG.push(f);
  });

  const providers = {
    att: ['2', '4', '14', '30', '17', '12', '66'],
    tmobile: ['2', '4', '5', '66', '12', '71'],
    verizon: ['2', '5', '4'],
  };
  const score = (name) => {
    const list = providers[name];
    const bands = name === 'verizon' ? categories.wcdma : categories.lte;
    return (
      (list.filter((b) => bands.includes(b)).length / list.length) *
      100
    ).toFixed(0);
  };

  const recordData = {
    model,
    modelName,
    deviceImage,
    netTech,
    speed,
    bands: {
      twoG: categories.twoG,
      wcdma: categories.wcdma,
      lte: categories.lte,
    },
    scores: {
      att4g: Number(score('att')),
      tmobile4g: Number(score('tmobile')),
      verizon4g: Number(score('verizon')),
    },
    compatibleModels: data.models || [],
  };

  const existing = await PhoneModel.findOne({ model });
  if (!existing) {
    await PhoneModel.create(recordData);
  } else {
    const changed =
      existing.modelName !== recordData.modelName ||
      existing.deviceImage !== recordData.deviceImage ||
      existing.netTech !== recordData.netTech ||
      existing.speed !== recordData.speed ||
      JSON.stringify(existing.bands) !== JSON.stringify(recordData.bands) ||
      JSON.stringify(existing.scores) !== JSON.stringify(recordData.scores) ||
      JSON.stringify(existing.compatibleModels) !==
        JSON.stringify(recordData.compatibleModels);
    if (changed) {
      Object.assign(existing, recordData);
      await existing.save();
    }
  }
}

router.get("/api/imei1F/:imei", async (req, res) => {
  const imei = req.params.imei;
  try {
    let imei1 = await Imei1.findOne({ "requests.deviceImei": parseInt(imei) });
    if (imei1) {
      await updatePhoneModel(imei1.requests);
      return res.json(imei1);
    }

    const url =
      "https://imeidb.xyz/api/imei/" +
      imei +
      "?token=" +
      process.env.IMEI_API_TOKEN +
      "&format=json";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log(await response.text());
        return res.status(500).send({ message: "Failed to fetch IMEI" });
      }

      const apiData = await response.json();
      imei1 = await Imei1.create({ requests: apiData });
      await updatePhoneModel(apiData);
      res.json(imei1);
    } catch (dbErr) {
      console.log(dbErr);
      if (dbErr.name === "ValidationError") {
        return res.status(400).send(dbErr.errors);
      }
      res.status(500).send({ message: "Something went wrong" });
    }
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).send(err.errors);
    }
    res.status(500).send({ message: "Something went wrong" });
  }
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

// Fetch stored phone model details
router.get("/api/phone-model/:model", async (req, res) => {
  try {
    const model = req.params.model;
    const record = await PhoneModel.findOne({ model });
    if (!record) {
      return res.status(404).send({ message: "Model not found" });
    }
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/api/phone-model", async (req, res) => {
  try {
    const { model } = req.body;
    if (!model) {
      return res.status(400).send({ message: "Model is required" });
    }
    let record = await PhoneModel.findOne({ model });
    if (record) {
      return res.json(record);
    }
    record = await PhoneModel.create(req.body);
    res.json(record);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).send(err.errors);
    }
    res.status(500).send({ message: "Something went wrong" });
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

router.delete("/api/requests", ({ body }, res) => {
  Imei.findByIdAndDelete(body.id)
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      res.json(err);
    });
});


router.get("/emailresearch", (req, res) => {
  res.render("emailresearch");
});


router.get("/result1/:imei", async (req, res) => {
  console.log("222");

  let imei = req.params.imei;
  console.log("calling the api for this imei");
  console.log(imei);

  try {
    const response = await fetch(
      "https://imeidb.xyz/api/imei/" +
        imei +
        "?token=" +
        process.env.IMEI_API_TOKEN +
        "&format=json"
    );
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to fetch IMEI" });
  }
});

module.exports = router;
