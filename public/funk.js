const countryInput = document.querySelector("#countries");
const imeiNameInput = document.querySelector("#imei-name");
const completeButton = document.querySelector("button.complete");
const viewButton = document.querySelector("button.view");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const formImei = document.querySelector("#form-imei");
import { API } from "/api.js";

var username = "tester1: ";
var scoreDump;
var sampleDump;
var lastImei;
var deviceModel = "";

let workoutType = null; // to be reviewed by 5-19-22
let shouldNavigateAway = false;

// development test variables for  country USA

export function processImeiActual(response1, type) {
  //===============
  var sampleResponse = response1;
  console.log(sampleResponse.message + "dodu!");
  console.log(sampleResponse);

  if (sampleResponse.message != undefined) {
    console.log(sampleResponse.message);

    let scoreDump_nill = `
          <h1 class="text-center red1" ;"> ${sampleResponse.message}</h1>
      <h1 class="text-center red1" ;">NO INFO FOR THE DEVICE BANDS IN DATABASE</h1>        
     `;

    // <tr>
    // <th class="${score3Class}">Overall Score</th>
    // <td id="score3" class="${score3Class}">${overallScore} % - ${remarks3}</td>
    // </tr>

    let sampleDump_nill = `
      <h1 class="text-center red1" ;">NO INFO FOR THE DEVICE BANDS IN DATABASE</h1>`;
    $("#score-dump").html("");
    $("#main-dump").html("");
    $("#score-dump").append(scoreDump_nill);
    $("#main-dump").append(sampleDump_nill);

    console.log("sampleResponse.data : ");
    console.log(sampleResponse.data);
  } else if (sampleResponse.data.models != undefined) {
    deviceModel = sampleResponse.data.models[0];
  } else if (
    sampleResponse.data.model != undefined &&
    sampleResponse.data.model != null
  ) {
    deviceModel = sampleResponse.data.model;
  }
  // var deviceModel = sampleResponse.data.model;
  // var bluetooth  = sampleResponse.data.device_spec.blootooth;
  var frequencyArray2g = [];
  var frequencyArrayLte = [];
  var frequencyArrayTdd = [];
  var frequencyArrayWcdma = [];
  let i = 0;
  let u = 0;
  let y = 0;
  let z = 0;
  var attLteArray = ["2", "4", "12", "17"];
  var tmobileLteArray = ["2", "4", "12", "71"];
  var verizonLteArray = ["2", "4", "13", "66"];

  var ukLteArray = ["1", "3", "7", "20", "40"];
  var europeLteArray = ["1", "3", "7", "20"];
  var chinaLteArray = ["40", "41"];
  var indiaLteArray = ["1", "3", "5", "8", "40", "41"];

  var attScoreNumber = 0;
  var tmobileScoreNumber = 0;
  var verizonScoreNumber = 0;
  var frequencyArrayRaw = sampleResponse.data.frequency;

  var models = sampleResponse.data.models;
  var frequency = sampleResponse.data.frequency;
  var device_id = sampleResponse.data.device_id;
  var device_spec = sampleResponse.data.device_spec;
  var brand = sampleResponse.data.brand;
  var deviceName = sampleResponse.data.name || sampleResponse.data.deviceName;
  var deviceImage =
    sampleResponse.data.device_image ||
    sampleResponse.data.deviceImage ||
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6s-plus.jpg";

  if (deviceImage == null || deviceImage == "" || deviceImage == undefined) {
    deviceImage =
      "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6s-plus.jpg";
  }

  var blacklist = sampleResponse.data.blacklist;
  var controlNumber = sampleResponse.data.device_spec.controlNumber;
  var simSlots = sampleResponse.data.device_spec.sim_slots;
  var deviceUsb = sampleResponse.data.device_spec.usb;
  var deviceWlan = sampleResponse.data.device_spec.wlan;
  var deviceSerial = sampleResponse.data.serial;
  var deviceTac = sampleResponse.data.tac;
  var deviceImei = sampleResponse.query || sampleResponse.data.deviceImei;
  var deviceBluetooth1 = sampleResponse.data.device_spec.bluetooth;
  var deviceBluetooth;
  var deviceNettech1 = sampleResponse.data.device_spec.nettech;
  var deviceNettech;
  var deviceSpeed;
  var deviceSpeed1 = sampleResponse.data.device_spec.speed;

  if (frequencyArrayRaw != "" && frequencyArrayRaw != null) {
    for (i = 0; i < frequencyArrayRaw.length; i++) {
      if (frequencyArrayRaw[i].toUpperCase().includes("LTE FDD BAND")) {
        let band = frequencyArrayRaw[i].slice(13);
        frequencyArrayLte.push(band);
      } else if (
        frequencyArrayRaw[i].toUpperCase().includes("WCDMA FDD BAND")
      ) {
        let band1 = frequencyArrayRaw[i].slice(15);
        frequencyArrayWcdma.push(band1);
      } else if (frequencyArrayRaw[i].toUpperCase().includes("LTE TDD BAND")) {
        let band3 = frequencyArrayRaw[i].slice(13);
        frequencyArrayTdd.push(band3);
      } else if (frequencyArrayRaw[i].includes("GSM")) {
        let band2 = frequencyArrayRaw[i];
        frequencyArray2g.push(band2);
      } else {
        console.log("frequency error : read : " + frequencyArrayRaw[i]);
      }
    }

    for (u = 0; u < attLteArray.length; u++) {
      if (frequencyArrayLte.includes(attLteArray[u])) {
        attScoreNumber++;
      }
    }
    for (y = 0; y < tmobileLteArray.length; y++) {
      if (frequencyArrayLte.includes(tmobileLteArray[y])) {
        tmobileScoreNumber++;
      }
    }
    for (z = 0; z < verizonLteArray.length; z++) {
      if (frequencyArrayWcdma.includes(verizonLteArray[z])) {
        verizonScoreNumber++;
      }
    }

    var attScore = (attScoreNumber / attLteArray.length) * 100;
    var tmobileScore = (tmobileScoreNumber / tmobileLteArray.length) * 100;
    var verizonScore = (verizonScoreNumber / verizonLteArray.length) * 100;
    var overallScore = (attScore + tmobileScore + verizonScore) / 3;

    if (deviceBluetooth1 !== null) {
      deviceBluetooth =
        sampleResponse.data.device_spec.bluetooth[0] +
        ", " +
        sampleResponse.data.device_spec.bluetooth[1] +
        ", " +
        sampleResponse.data.device_spec.bluetooth[2];
    } else {
      deviceBluetooth = null;
    }
    if (deviceNettech1 !== null) {
      deviceNettech =
        sampleResponse.data.device_spec.nettech[0] +
        ", " +
        sampleResponse.data.device_spec.nettech[1] +
        ", " +
        sampleResponse.data.device_spec.nettech[2] +
        ", " +
        sampleResponse.data.device_spec.nettech[3] +
        ", " +
        sampleResponse.data.device_spec.nettech[4];
    } else {
      deviceNettech = null;
    }
    if (deviceSpeed1 !== null) {
      deviceSpeed =
        sampleResponse.data.device_spec.speed[0] +
        ", " +
        sampleResponse.data.device_spec.speed[1] +
        ", " +
        sampleResponse.data.device_spec.speed[2];
    } else {
      deviceSpeed = null;
    }

    overallScore = (attScore + tmobileScore) / 2;

    let passObject = {
      deviceSpeed: deviceSpeed,
      deviceBluetooth: deviceBluetooth,
      deviceNettech: deviceNettech,
      tmobileScore: tmobileScore,
      verizonScore: verizonScore,
      attScore: attScore,
      frequencyArray2g: frequencyArray2g,
      frequencyArrayLte: frequencyArrayLte,
      frequencyArrayTdd: frequencyArrayTdd,
      frequencyArrayWcdma: frequencyArrayWcdma,
      overallScore: overallScore,
      deviceImei: deviceImei,
      deviceName: deviceName,
      deviceImage: deviceImage,
      deviceTac: deviceTac,
      deviceSerial: deviceSerial,
      blacklist: blacklist,
      brand: brand,
      device_id: device_id,
      controlNumber: controlNumber,
      device_spec: device_spec,
      frequency: frequency,
      models: models,
    };

    if (type === "api_result") {
      saveTodatabase(passObject);
      renderResults(passObject);
    }
    if (type === "api_result1") {
      renderResults(passObject);
      // saveTodatabase(passObject);
    }
  } else {
    console.log("no info");

    let scoreDump_nill = `


    <h1 class="text-center" style="color: #000;">NO INFO FOR THE DEVICE BANDS IN DATABASE: ${deviceImei}</h1>
    <h1 class="text-center" style="color: #000;">Need to check manually : model : ${deviceModel}</h1>
    <h1 class="text-center" style="color: #000;"> chaeck manually<a  href="https://www.gsmarena.com/search-json.php3?sSearch=" target="_blank" /> ${deviceModel}</h1>
   
   
   `;
   
     // <tr>
     // <th class="${score3Class}">Overall Score</th>
     // <td id="score3" class="${score3Class}">${overallScore} % - ${remarks3}</td>
     // </tr>
   
     let sampleDump_nill = `
    <h1 class="text-center" style="color: #aaa;">NO INFO FOR THE DEVICE BANDS IN DATABASE</h1>
    <div class=" device">
    <div class="text-center"  >  
    <img src= ${deviceImage} alt=""> 
    </div>
    <h1 class="text-center" style="color: #aaa;">${deviceName}</h1>
    </div>
    <table id="w1" class="table table-striped table-bordered detail-view">
    <tbody>  <tr>
    
    
    <tr>
    <th>Net tech</th>
    <td>${deviceNettech}</td>
    </tr>
    
    <tr>
    <th>Connection Speed</th>
    <td>${deviceSpeed}</td>
    </tr>
    </table>`;
     $("#score-dump").html("");
     $("#main-dump").html("");
     $("#score-dump").append(scoreDump_nill);
     $("#main-dump").append(sampleDump_nill);

    // displayNoInfo();
  }
}

function renderResults(passObject) {
  var remarks1 = "sample remarks....";
  var remarks2 = "sample remarks....";
  var remarks3 = "sample remarks....";
  var remarks4 = "sample remarks....";
  var score1Class = "dudu";
  var score2Class = "dudu";
  var score3Class = "dudu";
  var score4Class = "dudu";
  let deviceSpeed = passObject.deviceSpeed;
  // let deviceBluetooth = passObject.deviceBluetooth;
  let deviceNettech = passObject.deviceNettech;
  let tmobileScore = passObject.tmobileScore;
  let verizonScore = passObject.verizonScore;
  let brand = passObject.brand;
  let attScore = passObject.attScore;
  let frequencyArray2g = passObject.frequencyArray2g;
  let frequencyArrayLte = passObject.frequencyArrayLte;
  // let frequencyArrayTdd = passObject.frequencyArrayTdd;
  let frequencyArrayWcdma = passObject.frequencyArrayWcdma;
  let overallScore = passObject.overallScore;
  let deviceImei = passObject.deviceImei;
  let deviceName = passObject.deviceName;
  let deviceImage =
    passObject.deviceImage ||
    "https://amicusshippingllc.com/assets/images/ps4.jpg";
  if (deviceImage === null || deviceImage === "" || deviceImage == undefined) {
    deviceImage = "https://amicusshippingllc.com/assets/images/ps4.jpg";
  }

  if (attScore > 74) {
    score1Class = "green-score";
    remarks1 =
      " expecting your phone to have workable signal in most areas where there is cell phone reception of this carrier";
    // console.log("fired1");
  } else if (attScore < 75 && attScore > 45) {
    score1Class = "yellow-score";
    remarks1 =
      " expecting your phone to have intermittent connection in most areas where there is cell phone reception of this carrier";
  } else if (attScore < 45 && attScore > 0) {
    score1Class = "orange-score";
    remarks1 =
      " expecting your phone to have difficulties keeping the connection in most areas where there is cell phone reception of this carrier";
  } else if (attScore == 0) {
    score1Class = "red-score";
    remarks1 =
      " unless some unforseen change to the network, expecting your phone to not have connection with this carrier's network";
  }

  if (tmobileScore > 74) {
    score2Class = "green-score";
    remarks2 =
      " expecting your phone to have workable signal in most areas where there is cell phone reception of this carrier";
  } else if (tmobileScore < 75 && tmobileScore > 45) {
    score2Class = "yellow-score";
    remarks2 =
      " expecting your phone to have intermittent connection in most areas where there is cell phone reception of this carrier";
  } else if (tmobileScore < 45 && tmobileScore > 0) {
    score2Class = "orange-score";
    remarks2 =
      " expecting your phone to have difficulties keeping the connection in most areas where there is cell phone reception of this carrier";
  } else if (tmobileScore == 0) {
    score2Class = "red-score";
    remarks2 =
      " unless some unforseen change to the network, expecting your phone to not have connection with this carrier's network";
  }
  if (verizonScore > 74) {
    score4Class = "green-score";
    remarks4 =
      " expecting your phone to have workable signal in most areas where there is cell phone reception of this carrier";
  } else if (verizonScore < 75 && verizonScore > 45) {
    score4Class = "yellow-score";
    remarks4 =
      " expecting your phone to have intermittent connection in most areas where there is cell phone reception of this carrier";
  } else if (verizonScore < 45 && verizonScore > 0) {
    score4Class = "orange-score";
    remarks4 =
      " expecting your phone to have difficulties keeping the connection in most areas where there is cell phone reception of this carrier";
  } else if (verizonScore == 0) {
    score4Class = "red-score";
    remarks4 =
      " unless some unforseen change to the network, expecting your phone to not have connection with this carrier's network";
  }

  if (overallScore > 74) {
    score3Class = "green-score";
    remarks3 =
      " expecting your phone to have workable signal in most areas where there is cell phone reception of this carrier";
  } else if (overallScore < 75 && overallScore > 45) {
    score3Class = "yellow-score";
    remarks3 =
      " expecting your phone to have intermittent connection in most areas of USA";
  } else if (overallScore < 45 && overallScore > 0) {
    score3Class = "orange-score";
    remarks3 =
      " expecting your phone to have difficulties keeping the connection in most areas of USA";
  } else if (overallScore == 0) {
    score3Class = "red-score";
    remarks3 =
      " unless some unforseen change to the network, expecting your phone to not have connection with this carrier's network";
  }

  scoreDump = `
            <div class="text-center"  >  
            <h2>Results</h2>
            </div><table id="w1" class="table table-striped table-bordered detail-view">
            <tbody> 
            
            
            <tr>
            <th class="${score3Class}">Scores_for_IMEI</th>
            <td   class="${score3Class}">${deviceImei}  </td>
            </tr>
            
            <tr>
            <th class="${score1Class}">AT&T 4G</th>
            <td id="score1" class="${score1Class}">${attScore} % - ${remarks1}</td>
            </tr>
            
            <tr>
            <th class="${score2Class}">T-mobile 4G</th>
            <td id="score2" class="${score2Class}">${tmobileScore} %  - ${remarks2}</td>
            </tr>
            
            <tr>
            <th class="${score4Class}">Verizon Wireless 4G</th>
            <td id="score2" class="${score4Class}">${verizonScore} %  - ${remarks4}</td>
            </tr>
            
            
       
          
            
              </tbody>
            </table>`;

  // <tr>
  // <th class="${score3Class}">Overall Score</th>
  // <td id="score3" class="${score3Class}">${overallScore} % - ${remarks3}</td>
  // </tr>

  sampleDump =
    `<div class=" device">
             <div class="text-center"  >  
             <img src= ${deviceImage} alt="" 
             > 
             </div>
             <h1 class="text-center" style="color: #fff;">${brand}  ${deviceName}</h1>` +
    //  <h3 class="text-center" style="color: #fff;">For back to the previous page click <a href="/device">here</a></h3>

    `</div><table id="w1" class="table table-striped table-bordered detail-view"><tbody>  <tr>
             
             
             <tr>
             <th>Net tech</th>
             <td>${deviceNettech}</td>
             </tr>
             
             <tr>
             <th>Connection Speed</th>
             <td>${deviceSpeed}</td>
             </tr>
             
             
             <tr>
             <th>Net 2g</th>
             <td>${frequencyArray2g} </td>
             </tr>
             <tr>
             <th>Wcdma</th>
             <td>${frequencyArrayWcdma}</td>
             </tr>
             <tr>
             <th>Net 4g</th>
             <td>${frequencyArrayLte}</td>
             </tr>
             <tr>
                 <th>Model</th>
                 <td>${deviceModel}</td>
                 </tr>
              
                 </table>`;
  //=========================

  $("#score-dump").html("");
  $("#main-dump").html("");
  $("#score-dump").append(scoreDump);
  $("#main-dump").append(sampleDump);

  // formImei.classList.add("d-none");
}

function displayNoInfo() {
  let scoreDump_nill = `


 <h1 class="text-center" style="color: #000;">NO INFO FOR THE DEVICE BANDS IN DATABASE</h1>


`;

  // <tr>
  // <th class="${score3Class}">Overall Score</th>
  // <td id="score3" class="${score3Class}">${overallScore} % - ${remarks3}</td>
  // </tr>

  let sampleDump_nill = `
 <h1 class="text-center" style="color: #aaa;">NO INFO FOR THE DEVICE BANDS IN DATABASE</h1>
 <div class=" device">
 <div class="text-center"  >  
 <img src= ${deviceImage} alt=""> 
 </div>
 <h1 class="text-center" style="color: #aaa;">${deviceName}</h1>
 </div>
 <table id="w1" class="table table-striped table-bordered detail-view">
 <tbody>  <tr>
 
 
 <tr>
 <th>Net tech</th>
 <td>${deviceNettech}</td>
 </tr>
 
 <tr>
 <th>Connection Speed</th>
 <td>${deviceSpeed}</td>
 </tr>
 </table>`;
  $("#score-dump").html("");
  $("#main-dump").html("");
  $("#score-dump").append(scoreDump_nill);
  $("#main-dump").append(sampleDump_nill);
}

export function displayResult(result) {
  console.log(" displayresult activated");
}

async function saveTodatabase(passObject) {
  let modelDataSave = {
    requests: {
      deviceImei: passObject.deviceImei,
      blacklist: passObject.blacklist,

      brand: passObject.brand,
      controlNumber: passObject.controlNumber,
      device_id: passObject.device_id,
      deviceImage: passObject.deviceImage,
      device_spec: passObject.device_spec,
      deviceName: passObject.deviceName,
      deviceSerial: passObject.deviceSerial,
      type: "imei1",
      deviceSpeed: passObject.deviceSpeed,
      frequency: passObject.frequency,
      models: passObject.models,
      frequencyArray2g: passObject.frequencyArray2g,
      frequencyArrayLte: passObject.frequencyArrayLte,
      frequencyArrayTdd: passObject.frequencyArrayTdd,
      frequencyArrayWcdma: passObject.frequencyArrayWcdma,
      deviceTac: passObject.deviceTac,
      tmobileScore: passObject.tmobileScore,
      verizonScore: passObject.verizonScore,
      attScore: passObject.attScore,
      overallScore: passObject.overallScore,
    },
  };

  let model = await API.createModel2(modelDataSave);
  console.log(model);
  console.log(modelDataSave);

  //   let scoreDump_nill = `

  //  <h3 class="text-center" style="color: #000;">Saving   to the  Database</h3>

  //  ${modelDataSave.requests.deviceImei} <br>
  //  ${modelDataSave.requests.deviceName} <br>
  //  ${modelDataSave.requests.deviceSerial} <br>
  //  ${modelDataSave.requests.deviceSpeed} <br>

  // `;

  // <tr>
  // <th class="${score3Class}">Overall Score</th>
  // <td id="score3" class="${score3Class}">${overallScore} % - ${remarks3}</td>
  // </tr>

  //   let sampleDump_nill = `
  //  <h1 class="text-center" style="color: #aaa;">NO INFO FOR THE DEVICE BANDS IN DATABASE</h1>
  //  <div class=" device">
  //  <div class="text-center"  >
  //  <img src= ${deviceImage} alt="">
  //  </div>
  //  <h1 class="text-center" style="color: #aaa;">${deviceName}</h1>
  //  </div>
  //  <table id="w1" class="table table-striped table-bordered detail-view">
  //  <tbody>  <tr>

  //  <tr>
  //  <th>Net tech</th>
  //  <td>${deviceNettech}</td>
  //  </tr>

  //  <tr>
  //  <th>Connection Speed</th>
  //  <td>${deviceSpeed}</td>
  //  </tr>
  //  </table>`;
  // $("#score-dump").html("");
  // // $("#main-dump").html("");
  // $("#score-dump").append(scoreDump_nill);
  // $("#main-dump").append(sampleDump_nill);
  // }
}
