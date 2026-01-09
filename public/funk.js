// Refactored JavaScript Function for IMEI Processing
// Focus: Optimized readability, modularity, and HTML templating

//  Assume necessary DOM elements and imports are already defined
import { API } from "/api.js";
console.log("this is the optimized funk from th second batch ");
export async function processImeiActual(response, type) {
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

// Support both the raw API payload (with `data` property) and the
// simplified object we store locally which already contains the
// desired fields.  Fallback to the root object when `data` is absent.
const data = sampleResponse.data || sampleResponse;
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

// When no raw frequency list is present (e.g. for cached records),
// use the already parsed band arrays if available.
if (frequencyArrayRaw.length === 0) {
  frequencyCategories.lte = data.frequencyArrayLte || [];
  frequencyCategories.wcdma = data.frequencyArrayWcdma || [];
  frequencyCategories.tdd = data.frequencyArrayTdd || [];
  frequencyCategories.g2 = data.frequencyArray2g || [];
  frequencyCategories.g5 = data.frequencyArray5g || [];
}

const score = name => providers[name].filter(b => frequencyCategories[name === "verizon" ? "wcdma" : "lte"].includes(b)).length / providers[name].length * 100;
const attScore = score("att").toFixed(0);
const tmobileScore = score("tmobile").toFixed(0);
const verizonScore = score("verizon").toFixed(0);
const overallScore = ((+attScore + +tmobileScore) / 2).toFixed(0);

const deviceInfo = {
deviceName: data.name || data.deviceName,
deviceImage: data.device_image || data.deviceImage || defaultImage,
deviceImei: sampleResponse.query || data.deviceImei || sampleResponse.deviceImei,
brand: data.brand || sampleResponse.brand,
model: deviceModel,
serial: data.serial || sampleResponse.serial,
tac: data.tac || sampleResponse.tac,
blacklist: data.blacklist || sampleResponse.blacklist,
device_id: data.device_id || sampleResponse.device_id,
controlNumber: data.device_spec?.controlNumber || data.controlNumber,
simSlots: data.device_spec?.sim_slots || data.simSlots,
usb: data.device_spec?.usb || data.usb,
wlan: data.device_spec?.wlan || data.wlan,
bluetooth: Array.isArray(data.device_spec?.bluetooth)
  ? data.device_spec.bluetooth.join(", ")
  : data.bluetooth || data.device_spec?.bluetooth || null,
nettech: Array.isArray(data.device_spec?.nettech)
  ? data.device_spec.nettech.join(", ")
  : data.nettech || null,
speed: Array.isArray(data.device_spec?.speed)
  ? data.device_spec.speed.join(", ")
  : data.speed || null,
frequency:
  frequencyArrayRaw.length
    ? frequencyArrayRaw
    : [
        ...frequencyCategories.g2,
        ...frequencyCategories.wcdma,
        ...frequencyCategories.lte,
        ...frequencyCategories.tdd,
        ...frequencyCategories.g5,
      ],
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
await ensurePhoneModel(deviceInfo);
}
await renderResults(deviceInfo);
}

async function renderResults(info) {
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
      <h1 style="color:#1e293b;">${display(info.brand)} ${display(info.deviceName)}</h1>
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

  // Always render the model table so the labels remain visible
  const placeholderDump = `
    <table class="table table-striped">
      <tr><th colspan="2">Stored Model Info</th></tr>
      <tr><th>Model</th><td>${display(info.model)}</td></tr>
      <tr><th>Name</th><td>N/A</td></tr>
      <tr><th>Net Tech</th><td>N/A</td></tr>
      <tr><th>Speed</th><td>N/A</td></tr>
      <tr><th>2G Bands</th><td>N/A</td></tr>
      <tr><th>WCDMA Bands</th><td>N/A</td></tr>
      <tr><th>LTE Bands</th><td>N/A</td></tr>
      <tr><th>AT&T 4G</th><td>N/A</td></tr>
      <tr><th>T-Mobile 4G</th><td>N/A</td></tr>
      <tr><th>Verizon 4G</th><td>N/A</td></tr>
      <tr><th>Compatible Models</th><td>N/A</td></tr>
    </table>`;
  $("#model-dump").html(placeholderDump);

  if (info.model) {
    const modelInfo = await API.getPhoneModel(info.model);
    if (modelInfo) {
      const twoG = (modelInfo.bands?.twoG || []).join(', ');
      const wcdma = (modelInfo.bands?.wcdma || []).join(', ');
      const lte = (modelInfo.bands?.lte || []).join(', ');
      const compat = (modelInfo.compatibleModels || []).join(', ');
      const modelDump = `
        <table class="table table-striped">
          <tr><th colspan="2">Stored Model Info</th></tr>
          <tr><th>Model</th><td>${display(modelInfo.model)}</td></tr>
          <tr><th>Name</th><td>${display(modelInfo.modelName)}</td></tr>
          <tr><th>Net Tech</th><td>${display(modelInfo.netTech)}</td></tr>
          <tr><th>Speed</th><td>${display(modelInfo.speed)}</td></tr>
          <tr><th>2G Bands</th><td>${display(twoG)}</td></tr>
          <tr><th>WCDMA Bands</th><td>${display(wcdma)}</td></tr>
          <tr><th>LTE Bands</th><td>${display(lte)}</td></tr>
          <tr><th>AT&T 4G</th><td>${display(modelInfo.scores?.att4g)}</td></tr>
          <tr><th>T-Mobile 4G</th><td>${display(modelInfo.scores?.tmobile4g)}</td></tr>
          <tr><th>Verizon 4G</th><td>${display(modelInfo.scores?.verizon4g)}</td></tr>
          <tr><th>Compatible Models</th><td>${display(compat)}</td></tr>
        </table>`;
      $("#model-dump").html(modelDump);
    }
  }
}

async function saveTodatabase(info) {
const modelData = { requests: { ...info, type: "imei1" } };
const result = await API.createModel2(modelData);
console.log("Saved model:", result);
};

async function ensurePhoneModel(info) {
  if (!info.model) return;
  const existing = await API.getPhoneModel(info.model);
  if (existing) return;
  const record = {
    deviceName: info.deviceName,
    deviceImage: info.deviceImage,
    brand: info.brand,
    model: info.model,
    controlNumber: info.controlNumber,
    simSlots: info.simSlots,
    usb: info.usb,
    nettech: info.nettech,
    speed: info.speed,
    frequency: info.frequency,
    frequencyArray2g: info.frequencyArray2g,
    frequencyArrayLte: info.frequencyArrayLte,
    frequencyArray5g: info.frequencyArray5g,
    frequencyArrayTdd: info.frequencyArrayTdd,
    frequencyArrayWcdma: info.frequencyArrayWcdma,
    attScore: info.attScore,
    tmobileScore: info.tmobileScore,
    verizonScore: info.verizonScore,
    overallScore: info.overallScore,
  };
  await API.createPhoneModel(record);
}
export function displayResult(result) {
  console.log(" displayresult activated");
};
