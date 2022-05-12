const router = require("express").Router();
const Imei = require("../models/imei.js");
const request = require("request");

router.post("/api/requests1", ({ body }, res) => {
  // create new imei record=====
  Imei.create(body)
    .then(dbImei => {
      res.json(dbImei);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});
router.put("/api/imeis/:id", ({ body, params }, res) => {
  // push the requests array into the last  imei record=====
  Imei.findByIdAndUpdate(
    params.id,
    { $push: { requests: body } },
    { new: true, runValidators: true }
  )
    .then(dbImei => {
      res.json(dbImei);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// router.get("/api/imeis/range", (req, res) => {
//   Imei.find({}).limit(7)
//     .then(dbImei => {
//       res.json(dbImei);
//       console.log(dbImei +"  ; dbimei")
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });

router.get("/api/imeis", (req, res) => {
  Imei.find()
    .sort({ date: -1 })
    .then(dbImei => {
      res.json(dbImei);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});
router.delete("/api/requests", ({ body }, res) => {
  Imei.findByIdAndDelete(body.id)
    .then(() => {
      res.json(true);
    })
    .catch(err => {
      res.json(err);
    });
});


router.get("/result1/:imei", (req, res) => {
  let imei = req.params.imei;
  console.log("imei");
  console.log(imei);
  // let imei= "353283075129556";
  request('https://imeidb.xyz/api/imei/' + imei + '?token='+process.env.IMEI_API_TOKEN +'&format=json', (error, response, body) => {

    if (error) {
      console.log(error);
    }
    res.send(response.body);

  });
});

module.exports = router;
