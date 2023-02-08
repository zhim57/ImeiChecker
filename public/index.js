const countryInput = document.querySelector("#countries");
const imeiNameInput = document.querySelector("#imei-name");
const emailInput = document.querySelector("#email-name");
var currentImei = "";
const completeButton = document.querySelector("button.complete");
const fillButton = document.querySelector("button.fillDatabase");
const viewButton = document.querySelector("button.view");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const formImei = document.querySelector("#form-imei");
import { processImeiActual, displayResult } from "/funk.js";
import { API } from "/api.js";

var username = "dummy string";
var lastImei;

let workoutType = null; // to be reviewed by 5-19-22
let shouldNavigateAway = false;

function processImei(response) {
  let response1 = JSON.parse(response);
  console.log("process Imei triggered");

  processImeiActual(response1);
}

async function initialFillDatabase() {
  let allImei = await API.getAllImei();
  console.log("allImei :");
  console.log(allImei[0].requests[0]);
  console.log("allImei[0].requests[0]");
  console.log(allImei[0].requests[0].value);
  console.log("allImei[0].requests[0]");

  let response1 = JSON.parse(allImei[0].requests[0].response);
  let response2 = JSON.parse(response1);
  console.log(allImei);
let allImei1 = allImei;
  console.log("response1.data");
  // console.log(response2.data);
  let type = "save_request";

 for ( let i=0; i<5; i++) {
let data1 = allImei1[i].requests[0].response;
console.log(data1);
let data2 = JSON.parse(data1);
let data =JSON.parse(data2)
console.log(JSON.parse(data2));
processImeiActual(data, type);
 }


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
    location.search = "?id=" + imei._id;
    await API.addRequest(imeiDataSave, imei._id);
    // initImei();
  }

  console.log("2 going to : http://localhost:3000/?id=" + currentImei);
}

// to work on this prior 5-17-22
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

fillButton.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("initial fill data base clicked");
  initialFillDatabase();
});

if (completeButton) {
  completeButton.addEventListener("click", function (event) {
    event.preventDefault();

    let imei = imeiNameInput.value.trim();

    username = emailInput.value.trim() || "safety-net";
    currentImei = imei;

    console.log(imei);

    API.getImei(imei, (result) => {
      let result1 = JSON.parse(result);
      console.log("result : ");
      console.log(result1);

      // new function - direct show 1-31-23

      // displayResult(result1);

      let type = "api_result";
      processImeiActual(result1, type);
      
      clearInputs();

      saveImei(result1); //- old path disabled
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
    // have to review this by 5-17-22
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

// old path disabled
// initImei();
