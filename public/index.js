const imeiNameInput = document.querySelector("#imei-name");
var currentImei = "";
const completeButton = document.querySelector("button.complete");
const viewButton = document.querySelector("button.view");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const formImei = document.querySelector("#form-imei");
const updateBtn = document.querySelector("#update-model-btn");
const updateForm = document.querySelector("#update-model-form");
import { processImeiActual } from "/funk-enhanced.js";
import { API } from "/api.js";

var username = "dummy string";
var lastImei;

let workoutType = null;
let shouldNavigateAway = false;

function processImei(response) {
  let response1 = JSON.parse(response);
  console.log("process Imei triggered");

  processImeiActual(response1);
}

async function initialFillDatabase() {

  console.log("this function is disabled");







}

async function initRequest(imeiDataSave) {
  let imei;

  if (location.search.split("=")[1] === undefined) {
    console.log("1 going to : http://localhost:3000/?id=" + currentImei);
    imei = await API.createImei(imeiDataSave);
    clearInputs();
    toast.classList.add("success");
  }
  if (imei) {
    console.log("id=" + imei._id);
    // location.search = "?id=" + imei._id;
    await API.addRequest(imeiDataSave, imei._id);
  }

  console.log("2 going to : http://localhost:3000/?id=" + currentImei);
}

function validateInputs() {
  let isValid = true;

  if (isValid) {
    completeButton.removeAttribute("disabled");
  } else {
    completeButton.setAttribute("disabled", true);
  }
}

async function saveImei(data) {
  let imeiData = data;
  let imeiDataSave = {};
  imeiDataSave.type = "imei";
  imeiDataSave.value = imeiData.query;
  imeiDataSave.country = "USA";
  imeiDataSave.username = username.trim();
  imeiDataSave.response = JSON.stringify(data);

  initRequest(imeiDataSave);
}



function clearInputs() {
  imeiNameInput.value = "";
}


if (completeButton) {
  completeButton.addEventListener("click", function (event) {
    event.preventDefault();

    let imei = imeiNameInput.value.trim();
    username = "anonymous";
    currentImei = imei;
    console.log(imei + " imei 1");

    // Hide IMEI instructions once user has submitted
    const imeiInstructions = document.getElementById('imei-instructions');
    if (imeiInstructions) {
      imeiInstructions.style.display = 'none';
    }

    API.oneImeiDb(imei, function (result1){
      console.log(result1);
      console.log("result from DB ");

      if (result1 != "error") {
        let type = "api_result1";
        processImeiActual(result1, type);
      }

      else{
        API.getImei(imei, (result) => {
          let result2 = JSON.parse(result);
          console.log("result from API : ");
          console.log(result2);
    
             let type = "api_result";
          processImeiActual(result2, type);
          
          clearInputs();
    
          saveImei(result2);
        });




      }
    });

 

  });
}

document
  .querySelectorAll("input")
  .forEach((element) => element.addEventListener("input", validateInputs));

async function initImei() {
  if (location.search.split("=")[1] === undefined) {
    lastImei = await API.getLastImei();
    console.log(lastImei);
  }

  if (lastImei) {
    document
      .querySelector(".complete")
      .setAttribute("href", `/result?id=${lastImei._id}`);

    const imeiSummary = {
      date: formatDate(lastImei.day),
      response: lastImei.response,
      numRequests: lastImei.requests.length,
    };
    parseLastImei(lastImei), console.log("imeiSummary.numRequests");

    renderImeiSummary(imeiSummary);
  } else {
    lastImei = await API.getLastImei();

    let currentImei = location.search.split("=")[1].trim();
    if (lastImei._id === undefined) {
    } else if (lastImei._id === currentImei) {
      location.search = "/";
    } else if (lastImei._id != currentImei) {
    }
  }

  if (shouldNavigateAway === true) {
    location.href = "/test ";
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
  if (lastImei.requests[0].type === "imei") {
    let response = JSON.parse(lastImei.requests[0].response);
    let sampleResponse = JSON.parse(response);

    processImeiActual(sampleResponse);
  } else if (lastImei.requests[0].type != "imei") {
    console.log("type is NOT imei");
  }
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
    totalDistance: "Total Distance Covered",
  };

  Object.keys(summary).forEach((key) => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = workoutKeyMap[key];
    processImeiActual;
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
  strong.textContent = "You have not checked any imei  yet!";

  p.appendChild(strong);
  container.appendChild(p);
}

if (updateBtn) {
  updateBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const wcdmaBands = document
      .querySelector("#update-wcdma-bands")
      .value.split(",")
      .map((b) => b.trim())
      .filter((b) => b);
    const lteBands = document
      .querySelector("#update-lte-bands")
      .value.split(",")
      .map((b) => b.trim())
      .filter((b) => b);
    const payload = {
      model: document.querySelector("#update-model").value.trim(),
      modelName: document.querySelector("#update-model-name").value.trim(),
      netTech: document.querySelector("#update-net-tech").value.trim(),
      speed: document.querySelector("#update-speed").value.trim(),
      bands: {
        wcdma: wcdmaBands,
        lte: lteBands,
      },
      scores: {
        att4g: Number(document.querySelector("#update-att4g").value) || 0,
        tmobile4g: Number(document.querySelector("#update-tmobile4g").value) || 0,
        verizon4g: Number(document.querySelector("#update-verizon4g").value) || 0,
      },
      note: document.querySelector("#update-note").value.trim(),
    };
    if (!payload.model) return;
    const res = await API.updatePhoneModel(payload.model, payload);
    if (res) {
      alert("Model updated");
      updateForm.reset();
    } else {
      alert("Failed to update model");
    }
  });
}

