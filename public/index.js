// init();

// async function init() {
//   if (location.search.split("=")[1] === undefined) {
//     const imei = await API.getLastImei();
//     if (imei) {
//       location.search = "?id=" + imei._id;
//     } else {
//       document.querySelector("#continue-btn").classList.add("d-none");
//     }
//   }
// }

const countryInput = document.querySelector("#countries");
const imeiNameInput = document.querySelector("#imei-name");
const completeButton = document.querySelector("button.complete");
const viewButton = document.querySelector("button.view");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const formImei = document.querySelector("#form-imei");

var username = "tester1: ";
var scoreDump;
var sampleDump;

let workoutType = null; // to be reviewed by 5-19-22
let shouldNavigateAway = false;

var sampleResponse1 = {
  data: {
    blacklist: { status: false },
    brand: "Apple",
    controlNumber: 6,
    device_id: 7243,
    device_image:
      "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6s-plus.jpg",
    device_spec: {
      aliases: ["A1699", "A1690", "A1687", "A1634"],
      bluetooth: ["4.2", "A2DP", "LE"],
      nettech: ["GSM", "CDMA", "HSPA", "EVDO", "LTE"],
      nfc: true,
      os: "iOS 9",
      os_family: "iOS",
      sim_slots: "1",
      speed: [
        "HSPA 42.2/5.76 Mbps",
        "LTE-A (2CA) Cat6 300/50 Mbps",
        "EV-DO Rev.A 3.1 Mbps",
      ],
      usb: ["2.0", "proprietary reversible connector"],
      wlan: ["Wi-Fi 802.11 a/b/g/n/ac", "dual-band", "hotspot"],
    },

    frequency: [
      "CDMA2000",
      "LTE FDD BAND 1",
      "LTE FDD BAND 2",
      "LTE FDD BAND 3",
      "LTE FDD BAND 4",
      "LTE FDD BAND 5",
      "LTE FDD BAND 7",
      "LTE FDD BAND 8",
      "LTE FDD BAND 12",
      "LTE FDD BAND 13",
      "LTE FDD BAND 17",
      "LTE FDD BAND 18",
      "LTE FDD BAND 19",
      "LTE FDD BAND 20",
      "LTE FDD BAND 25",
      "LTE FDD BAND 26",
      "LTE FDD BAND 27",
      "LTE FDD BAND 28",
      "LTE FDD BAND 29",
      "LTE TDD BAND 38",
      "LTE TDD BAND 39",
      "LTE TDD BAND 40",
      "LTE TDD BAND 41",
      "GSM850 (GSM800)",
      "GSM 900",
      "GSM 1800",
      "GSM 1900",
      "WCDMA FDD Band 1",
      "WCDMA FDD Band 2",
      "WCDMA FDD Band 4",
      "WCDMA FDD Band 5",
      "WCDMA FDD Band 8",
    ],
    manufacturer: "Apple Inc",
    model: "A1687",
    models: ["A1687"],

    name: "iPhone 6S Plus",
    serial: 512955,
    tac: 35328307,
    type: "Smartphone",
    valid: true,

    query: 353283075129556,
    success: true,
  },
};

// development test variables
var attLteArray = [2, 4, 5, 17, 30];
var tmobileLteArray = [2, 4, 5, 12];
// var verizonLteArray =[2,4,5,13]
// var sprintLteArray =[25,30,41]

function processImei(response) {
  let response1 = JSON.parse(response);
  console.log("process Imei triggered");
  processImeiActual(response1);
  
}
// workoutType = event.target.value;
function processImeiActual(response1) {
  console.log("process Imei Actual triggered");
  console.log(response1);
 
  //===============
  var sampleResponse= response1;
  var deviceModel = sampleResponse.data.model;
  var frequencyArray2g = "GSM Bands: ";
  var frequencyArrayLte = "LTE Bands: ";
  var frequencyArrayWcdma = "WCDMA Bands: ";

  var frequencyArrayRaw = sampleResponse.data.frequency;
  for (i = 0; i < frequencyArrayRaw.length; i++) {
    if (frequencyArrayRaw[i].includes("LTE FDD BAND")) {
      let band = frequencyArrayRaw[i].slice(13);
      frequencyArrayLte = frequencyArrayLte + ", " + band;
    } else if (frequencyArrayRaw[i].includes("WCDMA FDD Band")) {
      let band1 = frequencyArrayRaw[i].slice(15);
      frequencyArrayWcdma = frequencyArrayWcdma + ", " + band1;
    } else if (frequencyArrayRaw[i].includes("GSM")) {
      let band2 = frequencyArrayRaw[i];
      frequencyArray2g = frequencyArray2g + ", " + band2;
    } else console.log("frequency error");
  }
  var deviceName = sampleResponse.data.name;
  var deviceImage = sampleResponse.data.device_image;
  var simSlots = sampleResponse.data.device_spec.sim_slots;
  var deviceUsb = sampleResponse.data.device_spec.usb;
  var deviceWlan = sampleResponse.data.device_spec.wlan;
  var deviceSerial = sampleResponse.data.serial;
  var deviceTac = sampleResponse.data.tac;
  var deviceImei = sampleResponse.query;
  var deviceBluetooth1 =sampleResponse.data.device_spec.bluetooth;
  var deviceBluetooth ;
  var deviceNettech1 =  sampleResponse.data.device_spec.nettech;
  var deviceNettech ;
  var deviceSpeed ;
  var deviceSpeed1 =  sampleResponse.data.device_spec.speed;
   
  
  if(deviceBluetooth1 !== null ){

    deviceBluetooth=
    sampleResponse.data.device_spec.bluetooth[0] +
    ", " +
    sampleResponse.data.device_spec.bluetooth[1] +
    ", " +
    sampleResponse.data.device_spec.bluetooth[2];
  }
  else{
    deviceBluetooth= null;

  }
  if(deviceNettech1 !== null ){
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
  }
  else{
    deviceNettech= null;

  }
  if(deviceSpeed1 !== null ){
    deviceSpeed =
    sampleResponse.data.device_spec.speed[0] +
    ", " +
    sampleResponse.data.device_spec.speed[1] +
    ", " +
    sampleResponse.data.device_spec.speed[2];
  }
  else{
    deviceSpeed= null;

  }
  

  
  var attScore= 90;
  var tmobileScore=25;
  var overallScore=97;
  var remarks1="sample remarks....";
  var remarks2="sample remarks....";
  var score1Class="dudu";
  var score2Class="dudu";
  var score3Class="dudu";

  //===============
// console.log("fired");
overallScore=(attScore+tmobileScore)/2;

    

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
        <td   class="${score3Class}">${deviceImei}</td>
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
        <th class="${score3Class}">Overall Score</th>
        <td id="score3" class="${score3Class}">${overallScore} % - ${remarks3}</td>
        </tr>
      
        
          </tbody>
        </table>`;

  sampleDump =
    `<div class=" device">
         <div class="text-center"  >  
         <img src= ${deviceImage} alt="" 
         > 
         </div>
         <h1 class="text-center" style="color: #fff;">${deviceName}</h1>` +
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

  $("#score-dump").append(scoreDump);
  $("#main-dump").append(sampleDump);
  // formImei.classList.add("d-none");

  //  console.log("writing0");
  //  console.log(imeiDa1);
}

async function initRequest(imeiDataSave) {

  // work on the location search
  let imei;

  if (location.search.split("=")[1] === undefined) {
    imei = await API.createImei(imeiDataSave);
    console.log(imei);
    clearInputs();
    toast.classList.add("success");
  }
  if (imei) {
    console.log("writin1");
    console.log(imei);
    location.search = "?id=" + imei._id;
    await API.addRequests(imeiDataSave, imei._id);
    // formImei.classList.add("d-none");
  }

}



// to work on this prior 5-17-22
function validateInputs() {
  let isValid = true;

  if (isValid) {
    completeButton.removeAttribute("disabled");
    // addButton.removeAttribute("disabled");
    // viewButton.setAttribute("disabled", true);
  } else {
    completeButton.setAttribute("disabled", true);
    // viewButton.removeAttribute("disabled");
    // addButton.setAttribute("disabled", true);
  }
}

async function saveImei(data) {
  let imeiData = JSON.parse(data);
  let imeiDataSave = {};
  imeiDataSave.type = "imei";
  imeiDataSave.value = imeiData.query;
  imeiDataSave.country = countryInput.value.trim();
  imeiDataSave.username = username.trim();
  imeiDataSave.response = JSON.stringify(data);

  console.log("success");
  ///======
  initRequest(imeiDataSave);
  // viewButton.removeAttribute("disabled");
  // addButton.removeAttribute("disabled");
  // processImei(imeiDataSave)
  ///======

  setTimeout(() => {
    console.log("initImei pressed");
    initImei();
    document.querySelector(".workout-type").setAttribute("class", `d-none`);
    console.log("saveImei pressed");
    // viewButton.removeAttribute("disabled");
  }, 1700);
}


// to play with this by 5-17-22

// function handleToastAnimationEnd() {
//   toast.removeAttribute("class");
//   if (shouldNavigateAway) {
//     location.href = "/result";
//   }
// }

function clearInputs() {
  imeiNameInput.value = "";
  countryInput.value = "";
}


if (completeButton) {
  completeButton.addEventListener("click", function (event) {
    event.preventDefault();
    // shouldNavigateAway = true;
    let imei = imeiNameInput.value.trim();
    console.log("imei -line 519");
    console.log(imei);
    API.getImei(imei, (result) => {
      console.log(result);
      saveImei(result);
    });
  });
}

document
  .querySelectorAll("input")
  .forEach((element) => element.addEventListener("input", validateInputs));


async function initImei() {
  const lastImei = await API.getLastImei();
  console.log(lastImei);
  // console.log("Last imei:", JSON.stringify(lastImei));
  if (lastImei) {

    // have to review this by 5-17-22
    document
      .querySelector(".complete")
      .setAttribute("href", `/result?id=${lastImei._id}`);

    const imeiSummary = {
      date: formatDate(lastImei.day),
      response: lastImei.response,
      numRequests: lastImei.requests.length

    };
    parseLastImei(lastImei),
    console.log("imeiSummary.numRequests");
    console.log(imeiSummary.numRequests);
    // renderImeiSummary(imeiSummary);
  } else {
    renderNoImeiText();
  }
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString(options);
}

function parseLastImei(lastImei) {
  // const tallied = results.reduce((acc, curr) => {
    console.log(lastImei);

  if (lastImei.requests[0].type === "imei") {
    console.log("type is imei");
    console.log(lastImei.requests[0]);
    let response = JSON.parse(lastImei.requests[0].response);
    let sampleResponse = JSON.parse(response);
  
    // console.log(sampleResponse);
    processImeiActual(sampleResponse);
    
  } else if (lastImei.requests[0].type != "imei") {
    console.log("type is NOT imei");
   ;
  }
 

  //===========================
  //===============
  // var deviceModel = sampleResponse.data.model;
  // var frequencyArray2g = "GSM Bands: ";
  // var frequencyArrayLte = "LTE Bands: ";
  // var frequencyArrayWcdma = "WCDMA Bands: ";

  // var frequencyArrayRaw = sampleResponse.data.frequency;
  // for (i = 0; i < frequencyArrayRaw.length; i++) {
  //   if (frequencyArrayRaw[i].includes("LTE FDD BAND")) {
  //     let band = frequencyArrayRaw[i].slice(13);
  //     frequencyArrayLte = frequencyArrayLte + ", " + band;
  //   } else if (frequencyArrayRaw[i].includes("WCDMA FDD Band")) {
  //     let band1 = frequencyArrayRaw[i].slice(15);
  //     frequencyArrayWcdma = frequencyArrayWcdma + ", " + band1;
  //   } else if (frequencyArrayRaw[i].includes("GSM")) {
  //     let band2 = frequencyArrayRaw[i];
  //     frequencyArray2g = frequencyArray2g + ", " + band2;
  //   } else console.log("frequency error");
  // }
  // var deviceName = sampleResponse.data.name;
  // var deviceImage = sampleResponse.data.device_image;
  // var simSlots = sampleResponse.data.device_spec.sim_slots;
  // var deviceUsb = sampleResponse.data.device_spec.usb;
  // var deviceWlan = sampleResponse.data.device_spec.wlan;
  // var deviceSerial = sampleResponse.data.serial;
  // var deviceTac = sampleResponse.data.tac;
  // var deviceImei = sampleResponse.data.query;
  // var deviceBluetooth =
  //   sampleResponse.data.device_spec.bluetooth[0] +
  //   ", " +
  //   sampleResponse.data.device_spec.bluetooth[1] +
  //   ", " +
  //   sampleResponse.data.device_spec.bluetooth[2];

  // var deviceNettech =
  //   sampleResponse.data.device_spec.nettech[0] +
  //   ", " +
  //   sampleResponse.data.device_spec.nettech[1] +
  //   ", " +
  //   sampleResponse.data.device_spec.nettech[2] +
  //   ", " +
  //   sampleResponse.data.device_spec.nettech[3] +
  //   ", " +
  //   sampleResponse.data.device_spec.nettech[4];
  // var deviceSpeed =
  //   sampleResponse.data.device_spec.speed[0] +
  //   ", " +
  //   sampleResponse.data.device_spec.speed[1] +
  //   ", " +
  //   sampleResponse.data.device_spec.speed[2];

  // var attScore = 90;
  // var tmobileScore = 25;
  // var overallScore = 97;
  // var remarks1 = "sample remarks....";
  // var remarks2 = "sample remarks....";
  // var score1Class = "dudu";
  // var score2Class = "dudu";
  // var score3Class = "dudu";

  // //===============
  // // console.log("fired");
  // overallScore = (attScore + tmobileScore) / 2;

  // if (attScore > 74) {
  //   score1Class = "green-score";
  //   remarks1 =
  //     " expecting your phone to have workable signal in most areas where there is cell phone reception of this carrier";
  //   // console.log("fired1");
  // } else if (attScore < 75 && attScore > 45) {
  //   score1Class = "yellow-score";
  //   remarks1 =
  //     " expecting your phone to have intermittent connection in most areas where there is cell phone reception of this carrier";
  // } else if (attScore < 45 && attScore > 0) {
  //   score1Class = "orange-score";
  //   remarks1 =
  //     " expecting your phone to have difficulties keeping the connection in most areas where there is cell phone reception of this carrier";
  // } else if (attScore == 0) {
  //   score1Class = "red-score";
  //   remarks1 =
  //     " unless some unforseen change to the network, expecting your phone to not have connection with this carrier's network";
  // }
  // if (tmobileScore > 74) {
  //   score2Class = "green-score";
  //   remarks2 =
  //     " expecting your phone to have workable signal in most areas where there is cell phone reception of this carrier";
  // } else if (tmobileScore < 75 && tmobileScore > 45) {
  //   score2Class = "yellow-score";
  //   remarks2 =
  //     " expecting your phone to have intermittent connection in most areas where there is cell phone reception of this carrier";
  // } else if (tmobileScore < 45 && tmobileScore > 0) {
  //   score2Class = "orange-score";
  //   remarks2 =
  //     " expecting your phone to have difficulties keeping the connection in most areas where there is cell phone reception of this carrier";
  // } else if (tmobileScore == 0) {
  //   score2Class = "red-score";
  //   remarks2 =
  //     " unless some unforseen change to the network, expecting your phone to not have connection with this carrier's network";
  // }
  // if (overallScore > 74) {
  //   score3Class = "green-score";
  //   remarks3 =
  //     " expecting your phone to have workable signal in most areas where there is cell phone reception of this carrier";
  // } else if (overallScore < 75 && overallScore > 45) {
  //   score3Class = "yellow-score";
  //   remarks3 =
  //     " expecting your phone to have intermittent connection in most areas of USA";
  // } else if (overallScore < 45 && overallScore > 0) {
  //   score3Class = "orange-score";
  //   remarks3 =
  //     " expecting your phone to have difficulties keeping the connection in most areas of USA";
  // } else if (overallScore == 0) {
  //   score3Class = "red-score";
  //   remarks3 =
  //     " unless some unforseen change to the network, expecting your phone to not have connection with this carrier's network";
  // }

  // scoreDump = `
  //         <div class="text-center"  >  
  //         <h2>Results</h2>
  //         </div><table id="w1" class="table table-striped table-bordered detail-view">
  //         <tbody> 
          
          
  //         <tr>
  //         <th class="${score3Class}">Scores_for_IMEI</th>
  //         <td   class="${score3Class}">${deviceImei}</td>
  //         </tr>
          
  //         <tr>
  //         <th class="${score1Class}">AT&T 4G</th>
  //         <td id="score1" class="${score1Class}">${attScore} % - ${remarks1}</td>
  //         </tr>
          
  //         <tr>
  //         <th class="${score2Class}">T-mobile 4G</th>
  //         <td id="score2" class="${score2Class}">${tmobileScore} %  - ${remarks2}</td>
  //         </tr>
          
          
  //         <tr>
  //         <th class="${score3Class}">Overall Score</th>
  //         <td id="score3" class="${score3Class}">${overallScore} % - ${remarks3}</td>
  //         </tr>
        
          
  //           </tbody>
  //         </table>`;

  // sampleDump =
  //   `<div class=" device">
  //          <div class="text-center"  >  
  //          <img src= ${deviceImage} alt="" 
  //          > 
  //          </div>
  //          <h1 class="text-center" style="color: #fff;">${deviceName}</h1>` +
  //   //  <h3 class="text-center" style="color: #fff;">For back to the previous page click <a href="/device">here</a></h3>

  //   `</div><table id="w1" class="table table-striped table-bordered detail-view"><tbody>  <tr>
           
           
  //          <tr>
  //          <th>Net tech</th>
  //          <td>${deviceNettech}</td>
  //          </tr>
           
  //          <tr>
  //          <th>Connection Speed</th>
  //          <td>${deviceSpeed}</td>
  //          </tr>
           
           
  //          <tr>
  //          <th>Net 2g</th>
  //          <td>${frequencyArray2g} </td>
  //          </tr>
  //          <tr>
  //          <th>Wcdma</th>
  //          <td>${frequencyArrayWcdma}</td>
  //          </tr>
  //          <tr>
  //          <th>Net 4g</th>
  //          <td>${frequencyArrayLte}</td>
  //          </tr>` +
  //   // `<tr>
  //   // <th>Sim Slots</th>
  //   // <td>${simSlots}</td>
  //   // </tr>
  //   // <tr>
  //   //   <th>Bluetooth</th>
  //   //   <td>${deviceBluetooth}</td>
  //   // </tr>

  //   // <tr>
  //   // <th>Usb</th>
  //   // <td>${deviceUsb}</td>
  //   // </tr>

  //   // <tr>
  //   // <th>Wlan</th>
  //   // <td>${deviceWlan}</td>
  //   // </tr>

  //   // <tr>
  //   //   <th>serial</th>
  //   //   <td>${deviceSerial}</td>
  //   // </tr>
  //   //  <tr>
  //   //  <th>Imei</th>
  //   //  <td>${deviceImei}</td>
  //   //  </tr>
  //   //  </tbody>
  //   // <tr>
  //   //   <th>Tac</th>
  //   //   <td>${deviceTac}</td>
  //   // </tr>`+
  //   `<tr>
  //              <th>Model</th>
  //              <td>${deviceModel}</td>
  //              </tr>
            
  //              </table>`;
  // //=========================

  // $("#score-dump").append(scoreDump);
  // $("#main-dump").append(sampleDump);

  //  console.log("writing0");
  //  console.log(imeiDa1);
}


function renderImeiSummary(summary) {
  const container = document.querySelector(".workout-stats");

  const workoutKeyMap = {
    date: "Date",
    totalDuration: "Total Workout Duration",
    numExercises: "Exercises Performed",
    totalWeight: "Total Weight Lifted",
    totalSets: "Total Sets Performed",
    totalReps: "Total Reps Performed",
    totalDistance: "Total Distance Covered"
  };

  Object.keys(summary).forEach(key => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = workoutKeyMap[key];
    const textNode = document.createTextNode(`: ${summary[key]}`);

    p.appendChild(strong);
    p.appendChild(textNode);

    container.appendChild(p);
  });
}


function renderNoImeiText() {
  const container = document.querySelector(".workout-stats");
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = "You have not checked any imei  yet!"

  p.appendChild(strong);
  container.appendChild(p);
}
// processImei()
// if (viewButton) {
//   viewButton.addEventListener("click", function (event) {
//     event.preventDefault();
//   });
// }



initImei();
