const router = require("express").Router();
const Imei = require("../models/imei.js");
const Imei1 = require("../models/imei1.js");
const PhoneModel = require("../models/phoneModel.js");
const ImeiCheck = require("../models/imeiCheck.js");
const fetch = global.fetch || ((...args) => import('node-fetch').then(({default: f}) => f(...args)));
require("dotenv").config();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate data completeness percentage for a phone model
 * @param {Object} modelData - The phone model data
 * @returns {Number} - Completeness percentage (0-100)
 */
function calculateDataCompleteness(modelData) {
  let totalFields = 0;
  let filledFields = 0;

  // Check essential fields
  const essentialFields = ['modelName', 'deviceImage', 'netTech', 'speed'];
  essentialFields.forEach(field => {
    totalFields++;
    if (modelData[field]) filledFields++;
  });

  // Check band arrays
  const bandFields = ['twoG', 'wcdma', 'lte'];
  bandFields.forEach(field => {
    totalFields++;
    if (modelData.bands && modelData.bands[field] && modelData.bands[field].length > 0) {
      filledFields++;
    }
  });

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Identify missing fields in a phone model
 * @param {Object} modelData - The phone model data
 * @returns {Array} - Array of missing field names
 */
function getMissingFields(modelData) {
  const missing = [];

  if (!modelData.modelName) missing.push('modelName');
  if (!modelData.deviceImage) missing.push('deviceImage');
  if (!modelData.netTech) missing.push('netTech');
  if (!modelData.speed) missing.push('speed');

  if (!modelData.bands || !modelData.bands.twoG || modelData.bands.twoG.length === 0) {
    missing.push('2G bands');
  }
  if (!modelData.bands || !modelData.bands.wcdma || modelData.bands.wcdma.length === 0) {
    missing.push('WCDMA bands');
  }
  if (!modelData.bands || !modelData.bands.lte || modelData.bands.lte.length === 0) {
    missing.push('LTE bands');
  }

  return missing;
}

/**
 * Calculate carrier compatibility scores
 * @param {Object} bands - Band data {twoG: [], wcdma: [], lte: []}
 * @returns {Object} - Scores {att4g, tmobile4g, verizon4g}
 */
function calculateScores(bands) {
  const providers = {
    att: ['2', '4', '14', '30', '17', '12', '66'],
    tmobile: ['2', '4', '5', '66', '12', '71'],
    verizon: ['2', '5', '4'],
  };

  const score = (name) => {
    const list = providers[name];
    const deviceBands = name === 'verizon' ? (bands.wcdma || []) : (bands.lte || []);
    const matches = list.filter((b) => deviceBands.includes(b)).length;
    return Math.round((matches / list.length) * 100);
  };

  return {
    att4g: score('att'),
    tmobile4g: score('tmobile'),
    verizon4g: score('verizon'),
  };
}

// ============================================================================
// NEW INTELLIGENT IMEI CHECKING ENDPOINT
// ============================================================================

/**
 * Main IMEI checking endpoint with intelligent caching and crowd-sourcing
 * GET /api/imei/:imei
 *
 * Logic:
 * 1. Check if IMEI was previously queried (ImeiCheck collection)
 * 2. If found, return cached PhoneModel data (fast)
 * 3. If not found, call external API
 * 4. Extract model, check if PhoneModel exists
 * 5. If PhoneModel exists with manual updates, prefer stored data
 * 6. Create/update PhoneModel and ImeiCheck records
 * 7. Return comprehensive data with completeness flags
 */
router.get("/api/imei/:imei", async (req, res) => {
  const imei = req.params.imei;
  const userId = req.query.userId || null;

  try {
    // Step 1: Check if this IMEI was previously queried
    let imeiCheck = await ImeiCheck.findOne({ imei });

    if (imeiCheck) {
      // IMEI found in cache! Increment check count
      imeiCheck.checkCount += 1;
      imeiCheck.lastCheckedAt = new Date();
      await imeiCheck.save();

      // Fetch the phone model data
      const phoneModel = await PhoneModel.findOne({ model: imeiCheck.phoneModel });

      if (phoneModel) {
        // Increment model check count
        phoneModel.checkCount += 1;
        await phoneModel.save();

        // Return cached data
        return res.json({
          imei: imeiCheck.imei,
          model: phoneModel.model,
          modelName: phoneModel.modelName,
          deviceImage: phoneModel.deviceImage,
          netTech: phoneModel.netTech,
          speed: phoneModel.speed,
          bands: phoneModel.bands,
          manuallyUpdated: phoneModel.manuallyUpdated,
          scores: phoneModel.scores,
          compatibleModels: phoneModel.compatibleModels,
          dataCompleteness: phoneModel.dataCompleteness,
          missingFields: getMissingFields(phoneModel),
          source: 'cache',
          checkCount: imeiCheck.checkCount,
        });
      }
    }

    // Step 2: IMEI not in cache, call external API
    const apiUrl = `https://imeidb.xyz/api/imei/${imei}?token=${process.env.IMEI_API_TOKEN}&format=json`;

    let apiResponse;
    try {
      apiResponse = await fetch(apiUrl);
      if (!apiResponse.ok) {
        console.error('API error:', await apiResponse.text());
        return res.status(500).json({ message: "Failed to fetch IMEI data from external API" });
      }
    } catch (fetchErr) {
      console.error('Fetch error:', fetchErr);
      return res.status(500).json({ message: "Failed to connect to external API" });
    }

    const apiData = await apiResponse.json();

    // Handle API error responses
    if (apiData.message) {
      return res.json({
        imei,
        message: apiData.message,
        source: 'api',
        dataCompleteness: 0,
      });
    }

    // Step 3: Extract model and parse API data
    const data = apiData.data || apiData;
    const deviceModel = data.models?.[0] || data.model;

    if (!deviceModel) {
      return res.status(400).json({ message: "Could not extract device model from API response" });
    }

    // Parse frequency bands from API
    const freq = data.frequency || [];
    const parsedBands = { lte: [], wcdma: [], twoG: [] };

    freq.forEach((f) => {
      const up = f.toUpperCase();
      if (up.includes('LTE FDD BAND')) parsedBands.lte.push(f.slice(13));
      else if (up.includes('WCDMA FDD BAND')) parsedBands.wcdma.push(f.slice(15));
      else if (up.includes('GSM')) parsedBands.twoG.push(f);
    });

    // Fallback to pre-parsed arrays if available
    if (freq.length === 0) {
      parsedBands.lte = data.frequencyArrayLte || [];
      parsedBands.wcdma = data.frequencyArrayWcdma || [];
      parsedBands.twoG = data.frequencyArray2g || [];
    }

    // Step 4: Check if PhoneModel exists
    let phoneModel = await PhoneModel.findOne({ model: deviceModel });

    if (phoneModel) {
      // Model exists! Check if we should update it
      // Prefer manually updated bands over API data
      const finalBands = {
        twoG: phoneModel.manuallyUpdated.twoG ? phoneModel.bands.twoG : (parsedBands.twoG.length > 0 ? parsedBands.twoG : phoneModel.bands.twoG),
        wcdma: phoneModel.manuallyUpdated.wcdma ? phoneModel.bands.wcdma : (parsedBands.wcdma.length > 0 ? parsedBands.wcdma : phoneModel.bands.wcdma),
        lte: phoneModel.manuallyUpdated.lte ? phoneModel.bands.lte : (parsedBands.lte.length > 0 ? parsedBands.lte : phoneModel.bands.lte),
      };

      // Update model with API data (but keep manually updated bands)
      phoneModel.modelName = data.name || data.deviceName || phoneModel.modelName;
      phoneModel.deviceImage = data.device_image || data.deviceImage || phoneModel.deviceImage;
      phoneModel.netTech = Array.isArray(data.device_spec?.nettech)
        ? data.device_spec.nettech.join(', ')
        : data.nettech || phoneModel.netTech;
      phoneModel.speed = Array.isArray(data.device_spec?.speed)
        ? data.device_spec.speed.join(', ')
        : data.speed || phoneModel.speed;
      phoneModel.bands = finalBands;
      phoneModel.scores = calculateScores(finalBands);
      phoneModel.compatibleModels = data.models || phoneModel.compatibleModels;
      phoneModel.dataCompleteness = calculateDataCompleteness(phoneModel);
      phoneModel.checkCount += 1;

      await phoneModel.save();
    } else {
      // Create new PhoneModel
      const modelData = {
        model: deviceModel,
        modelName: data.name || data.deviceName,
        deviceImage: data.device_image || data.deviceImage,
        netTech: Array.isArray(data.device_spec?.nettech)
          ? data.device_spec.nettech.join(', ')
          : data.nettech,
        speed: Array.isArray(data.device_spec?.speed)
          ? data.device_spec.speed.join(', ')
          : data.speed,
        bands: parsedBands,
        manuallyUpdated: {
          twoG: false,
          wcdma: false,
          lte: false,
        },
        scores: calculateScores(parsedBands),
        compatibleModels: data.models || [],
        checkCount: 1,
        lastUpdatedBy: 'system',
        lastUpdatedAt: new Date(),
      };

      modelData.dataCompleteness = calculateDataCompleteness(modelData);
      phoneModel = await PhoneModel.create(modelData);
    }

    // Step 5: Create ImeiCheck record
    await ImeiCheck.create({
      imei,
      phoneModel: deviceModel,
      userId,
      source: 'api',
      checkCount: 1,
    });

    // Step 6: Return comprehensive response
    res.json({
      imei,
      model: phoneModel.model,
      modelName: phoneModel.modelName,
      deviceImage: phoneModel.deviceImage,
      netTech: phoneModel.netTech,
      speed: phoneModel.speed,
      bands: phoneModel.bands,
      manuallyUpdated: phoneModel.manuallyUpdated,
      scores: phoneModel.scores,
      compatibleModels: phoneModel.compatibleModels,
      dataCompleteness: phoneModel.dataCompleteness,
      missingFields: getMissingFields(phoneModel),
      source: 'api',
      checkCount: 1,
    });

  } catch (err) {
    console.error('Error in /api/imei/:imei:', err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ============================================================================
// MANUAL BAND UPDATE ENDPOINT
// ============================================================================

/**
 * Update phone model bands manually (crowd-sourcing)
 * PUT /api/phone-model/:model/bands
 *
 * Request body: {
 *   twoG: ["GSM 850", "GSM 1900"],  // optional
 *   wcdma: ["2", "4", "5"],          // optional
 *   lte: ["2", "4", "5", "12"],      // optional
 *   userId: "user@example.com"       // optional
 * }
 */
router.put("/api/phone-model/:model/bands", async (req, res) => {
  try {
    const model = req.params.model;
    const { twoG, wcdma, lte, userId } = req.body;

    // Find the phone model
    const phoneModel = await PhoneModel.findOne({ model });

    if (!phoneModel) {
      return res.status(404).json({ message: "Phone model not found" });
    }

    // Update bands if provided
    let updated = false;

    if (twoG && Array.isArray(twoG)) {
      phoneModel.bands.twoG = twoG;
      phoneModel.manuallyUpdated.twoG = true;
      updated = true;
    }

    if (wcdma && Array.isArray(wcdma)) {
      phoneModel.bands.wcdma = wcdma;
      phoneModel.manuallyUpdated.wcdma = true;
      updated = true;
    }

    if (lte && Array.isArray(lte)) {
      phoneModel.bands.lte = lte;
      phoneModel.manuallyUpdated.lte = true;
      updated = true;
    }

    if (!updated) {
      return res.status(400).json({ message: "No valid band data provided" });
    }

    // Recalculate scores
    phoneModel.scores = calculateScores(phoneModel.bands);

    // Update metadata
    phoneModel.dataCompleteness = calculateDataCompleteness(phoneModel);
    phoneModel.lastUpdatedBy = userId || 'anonymous';
    phoneModel.lastUpdatedAt = new Date();

    await phoneModel.save();

    res.json({
      message: "Bands updated successfully",
      model: phoneModel.model,
      bands: phoneModel.bands,
      manuallyUpdated: phoneModel.manuallyUpdated,
      scores: phoneModel.scores,
      dataCompleteness: phoneModel.dataCompleteness,
      missingFields: getMissingFields(phoneModel),
    });

  } catch (err) {
    console.error('Error in PUT /api/phone-model/:model/bands:', err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ============================================================================
// ANALYTICS ENDPOINT
// ============================================================================

/**
 * Get system analytics
 * GET /api/stats
 */
router.get("/api/stats", async (req, res) => {
  try {
    const totalChecks = await ImeiCheck.countDocuments();
    const uniqueModels = await PhoneModel.countDocuments();
    const manuallyUpdatedModels = await PhoneModel.countDocuments({
      $or: [
        { 'manuallyUpdated.twoG': true },
        { 'manuallyUpdated.wcdma': true },
        { 'manuallyUpdated.lte': true },
      ]
    });
    const incompleteModels = await PhoneModel.countDocuments({ dataCompleteness: { $lt: 100 } });

    res.json({
      totalChecks,
      uniqueModels,
      manuallyUpdatedModels,
      modelsNeedingUpdates: incompleteModels,
    });
  } catch (err) {
    console.error('Error in /api/stats:', err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ============================================================================
// LEGACY ENDPOINTS (keeping for backward compatibility)
// ============================================================================

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
    : Array.isArray(data.nettech)
    ? data.nettech.join(', ')
    : data.device_spec?.nettech || data.nettech || null;
  const speed = Array.isArray(data.device_spec?.speed)
    ? data.device_spec.speed.join(', ')
    : Array.isArray(data.speed)
    ? data.speed.join(', ')
    : data.device_spec?.speed || data.speed || null;

  const freq = data.frequency || [];
  const categories = { lte: [], wcdma: [], twoG: [] };
  freq.forEach((f) => {
    const up = f.toUpperCase();
    if (up.includes('LTE FDD BAND')) categories.lte.push(f.slice(13));
    else if (up.includes('WCDMA FDD BAND')) categories.wcdma.push(f.slice(15));
    else if (up.includes('GSM')) categories.twoG.push(f);
  });

  if (freq.length === 0) {
    categories.lte = data.frequencyArrayLte || [];
    categories.wcdma = data.frequencyArrayWcdma || [];
    categories.twoG = data.frequencyArray2g || [];
  }

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

// Update existing phone model details
router.put("/api/phone-model/:model", async (req, res) => {
  try {
    const model = req.params.model;
    const update = req.body;
    const record = await PhoneModel.findOneAndUpdate({ model }, update, {
      new: true,
      runValidators: true,
    });
    if (!record) {
      return res.status(404).send({ message: "Model not found" });
    }
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
