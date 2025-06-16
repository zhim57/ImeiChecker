// Refactored JavaScript Function for IMEI Processing
// Focus: Optimized readability, modularity, and HTML templating

//  Assume necessary DOM elements and imports are already defined
import { API } from "/api.js";
console.log("this is the optimized funk from th second batch ");
export function processImeiActual(response, type) {
const sampleResponse = response;
console.log(sampleResponse.message + "dodu!");

const defaultImage = "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6s-plus.jpg";

if (sampleResponse.message) {
const noInfoHtml =    `   <h1 class="text-center red1">${sampleResponse.message}</h1>
      <h1 class="text-center red1">NO INFO FOR THE DEVICE BANDS IN DATABASE</h1>`
   ;
$("#score-dump").html(noInfoHtml);
$("#main-dump").html(noInfoHtml);
return;
}

const data = sampleResponse.data;
const frequencyArrayRaw = data.frequency || [];
const deviceModel = data.models?.[0] || data.model || null;
const frequencyCategories = {
lte: [],
wcdma: [],
tdd: [],
g2: [],
g5: [],
};

const providers = {
att: ["2", "4", "14", "30", "17", "12", "66"],
tmobile: ["2", "4", "5", "66", "12", "71"],
verizon: ["2", "5", "4"],
};

frequencyArrayRaw.forEach(f => {
const entry = f.toUpperCase();
if (entry.includes("LTE FDD BAND")) frequencyCategories.lte.push(f.slice(13));
else if (entry.includes("WCDMA FDD BAND")) frequencyCategories.wcdma.push(f.slice(15));
else if (entry.includes("LTE TDD BAND")) frequencyCategories.tdd.push(f.slice(13));
else if (entry.includes("GSM")) frequencyCategories.g2.push(f);
else frequencyCategories.g5.push(f);
});

const score = name => providers[name].filter(b => frequencyCategories[name === "verizon" ? "wcdma" : "lte"].includes(b)).length / providers[name].length * 100;
const attScore = score("att").toFixed(0);
const tmobileScore = score("tmobile").toFixed(0);
const verizonScore = score("verizon").toFixed(0);
const overallScore = ((+attScore + +tmobileScore) / 2).toFixed(0);

const deviceInfo = {
deviceName: data.name || data.deviceName,
deviceImage: data.device_image || data.deviceImage || defaultImage,
deviceImei: sampleResponse.query || data.deviceImei,
brand: data.brand,
model: deviceModel,
serial: data.serial,
tac: data.tac,
blacklist: data.blacklist,
device_id: data.device_id,
controlNumber: data.device_spec?.controlNumber,
simSlots: data.device_spec?.sim_slots,
usb: data.device_spec?.usb,
wlan: data.device_spec?.wlan,
bluetooth: data.device_spec?.bluetooth?.join(", ") || null,
nettech: data.device_spec?.nettech?.join(", ") || null,
speed: data.device_spec?.speed?.join(", ") || null,
frequency: frequencyArrayRaw,
frequencyArray2g: frequencyCategories.g2,
frequencyArrayLte: frequencyCategories.lte,
frequencyArray5g: frequencyCategories.g5,
frequencyArrayTdd: frequencyCategories.tdd,
frequencyArrayWcdma: frequencyCategories.wcdma,
attScore,
tmobileScore,
verizonScore,
overallScore,
};

if (type === "api_result") {
saveTodatabase(deviceInfo);
}
renderResults(deviceInfo);
}

function renderResults(info) {
const display = val => (val === undefined || val === null || val === '' ? 'N/A' : val);
const getClassRemark = score => {
if (score > 74) return ["green-score", "expecting good signal."];
if (score > 45) return ["yellow-score", "intermittent connection expected."];
if (score > 0) return ["orange-score", "connection may be poor."];
return ["red-score", "no reliable connection expected."];
};

const [score1Class, remarks1] = getClassRemark(info.attScore);
const [score2Class, remarks2] = getClassRemark(info.tmobileScore);
const [score4Class, remarks4] = getClassRemark(info.verizonScore);
const [score3Class, remarks3] = getClassRemark(info.overallScore);

const scoreDump =
   ` <div class="text-center"><h2>Results</h2></div>
    <table class="table table-striped">
      <tr><th class="${score3Class}">Scores_for_IMEI</th><td>${display(info.deviceImei)}</td></tr>
      <tr><th class="${score1Class}">AT&T 4G</th><td>${display(info.attScore)}% - ${remarks1}</td></tr>
      <tr><th class="${score2Class}">T-Mobile 4G</th><td>${display(info.tmobileScore)}% - ${remarks2}</td></tr>
      <tr><th class="${score4Class}">Verizon 4G</th><td>${display(info.verizonScore)}% - ${remarks4}</td></tr>
    </table>`;

const sampleDump =
    `<div class="device text-center">
      <img src="${display(info.deviceImage)}" alt="Device Image"/>
      <h1 style="color:#fff;">${display(info.brand)} ${display(info.deviceName)}</h1>
    </div>
    <table class="table table-striped">
      <tr><th>Net Tech</th><td>${display(info.nettech)}</td></tr>
      <tr><th>Speed</th><td>${display(info.speed)}</td></tr>
      <tr><th>2G Bands</th><td>${display(info.frequencyArray2g)}</td></tr>
      <tr><th>WCDMA</th><td>${display(info.frequencyArrayWcdma)}</td></tr>
      <tr><th>LTE</th><td>${display(info.frequencyArrayLte)}</td></tr>
      <tr><th>Model</th><td>${display(info.model)}</td></tr>
    </table>`;

$("#score-dump").html(scoreDump);
$("#main-dump").html(sampleDump);
}

async function saveTodatabase(info) {
const modelData = { requests: { ...info, type: "imei1" } };
const result = await API.createModel2(modelData);
console.log("Saved model:", result);
};
export function displayResult(result) {
  console.log(" displayresult activated");
};