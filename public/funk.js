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
  var lastImei;
  
  let workoutType = null; // to be reviewed by 5-19-22
  let shouldNavigateAway = false;
  
  // development test variables for  country USA
  
  
  
  
  
  // workoutType = event.target.value;
  export function processImeiActual(response1) {
    console.log("process Imei Actual triggered");
    
    console.log(response1);
    
    //===============
    var sampleResponse = response1;
    var deviceModel = sampleResponse.data.model;
    // var bluetooth  = sampleResponse.data.device_spec.blootooth;
    var frequencyArray2g = "GSM Bands: ";
    var frequencyArrayLte = "LTE Bands: ";
    var frequencyArrayWcdma = "WCDMA Bands: ";
    let i=0;
    let u=0;
    let y=0;
    var attLteArray = ["12", "17"];
    var tmobileLteArray = ["2", "4", "12","71"];
  var attScoreNumber =0;
  var tmobileScoreNumber =0;
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
// for(u=0; u < frequencyArrayLte.length; u++){
//   if (attLteArray.includes(frequencyArrayLte[u])){
//     attScoreNumber++
//   }
//   if (tmobileLteArray.includes(frequencyArrayLte[u])){
//     tmobileScoreNumber++
//   }
// };
for(u=0; u <attLteArray.length; u++){
  if (frequencyArrayLte.includes(attLteArray[u])){
    attScoreNumber++
  }
 
};
for(y=0; y < tmobileLteArray.length; y++){
  if (frequencyArrayLte.includes(tmobileLteArray[y])){
    tmobileScoreNumber++
 
}
};
console.log(attScoreNumber);
console.log(tmobileScoreNumber);
var attScore = ((attScoreNumber /attLteArray.length)*100) ;
var tmobileScore =((tmobileScoreNumber /tmobileLteArray.length)*100);
var overallScore = (attScore + tmobileScore)/2;
console.log(attScore);
console.log(tmobileScore);
console.log(overallScore);

    var deviceName = sampleResponse.data.name;
    var deviceImage = sampleResponse.data.device_image;
    var simSlots = sampleResponse.data.device_spec.sim_slots;
    var deviceUsb = sampleResponse.data.device_spec.usb;
    var deviceWlan = sampleResponse.data.device_spec.wlan;
    var deviceSerial = sampleResponse.data.serial;
    var deviceTac = sampleResponse.data.tac;
    var deviceImei = sampleResponse.query;
    var deviceBluetooth1 = sampleResponse.data.device_spec.bluetooth;
    var deviceBluetooth;
    var deviceNettech1 = sampleResponse.data.device_spec.nettech;
    var deviceNettech;
    var deviceSpeed;
    var deviceSpeed1 = sampleResponse.data.device_spec.speed;
  
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
  
  
    var remarks1 = "sample remarks....";
    var remarks2 = "sample remarks....";
    var remarks3 = "sample remarks....";
    var score1Class = "dudu";
    var score2Class = "dudu";
    var score3Class = "dudu";
  
    //===============
    // console.log("fired");
    overallScore = (attScore + tmobileScore) / 2;
  
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

    $("#score-dump").html("");
    $("#main-dump").html("");
    $("#score-dump").append(scoreDump);
    $("#main-dump").append(sampleDump);
  
    // formImei.classList.add("d-none");
  }

