const router = require("express").Router();
const Imei = require("../models/imei.js");

router.post("/api/imeis",  ({ body}, res) => {
  Imei.create(body)
    .then(dbImei => {
      res.json(dbImei);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});
router.put("/api/imeis/:id", ({ body, params }, res) => {
  console.log(params.id);
  console.log(body);
  
  Imei.findByIdAndUpdate(
    params.id,
    {$push: {exercises: body}},
    {new: true, runValidators: true}
  )
    .then(dbImei => {
      res.json(dbImei);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/imeis/range", (req, res) => {
  Imei.find({}).limit(7)
    .then(dbImei => {
      res.json(dbImei);
      console.log(dbImei +"  ; dbimei")
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/workouts", (req, res) => {
  Imei.find()
    .sort({ date: -1 })
    .then(dbImei => {
      res.json(dbImei);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});
router.delete("/api/imeis", ({ body }, res) => {
  Imei.findByIdAndDelete(body.id)
    .then(() => {
      res.json(true);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
