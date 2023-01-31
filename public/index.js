const countryInput = document.querySelector("#countries");
const imeiNameInput = document.querySelector("#imei-name");
const emailInput = document.querySelector("#email-name");
var currentImei = "";
const completeButton = document.querySelector("button.complete");
const viewButton = document.querySelector("button.view");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const formImei = document.querySelector("#form-imei");
import { processImeiActual } from "/funk.js";
import { API } from "/api.js";

var username = "dummy string";
var scoreDump;
var sampleDump;
var lastImei;

let workoutType = null; // to be reviewed by 5-19-22
let shouldNavigateAway = false;

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

async function initRequest(imeiDataSave) {
  // work on the location search
  let imei;
  // console.log("imei.....");
  // console.log(imeiDataSave.value);
  // console.log("imeidatasave.....");
  // console.log(imeiDataSave);

  if (location.search.split("=")[1] === undefined) {
    console.log("1 going to : http://localhost:3000/?id=" + currentImei);
    imei = await API.createImei(imeiDataSave);
    clearInputs();
    toast.classList.add("success");
  }
  if (imei) {
    console.log("id=" + imei._id);
    location.search = "?id=" + imei._id;
    // console.log(imeiDataSave);
    // console.log("eimei data save above");
    await API.addRequest(imeiDataSave, imei._id);
    // initImei();
  }
  // console.log("imeiDataSave.response");
  // let response2 = JSON.parse(imeiDataSave.response);
  // processImeiActual(JSON.parse(response2));
  // initImei();
  // formImei.classList.add("d-none");
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
  let imeiData = JSON.parse(data);
  let imeiDataSave = {};
  // console.log("imeiData");
  // console.log(imeiData);
  imeiDataSave.type = "imei";
  imeiDataSave.value = imeiData.query;
  imeiDataSave.country = countryInput.value.trim();
  imeiDataSave.username = username.trim();
  imeiDataSave.response = JSON.stringify(data);
  // console.log(imeiDataSave.value); // works fine
  // console.log("imeiDataSave.value"); // works fine

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

if (completeButton) {
  completeButton.addEventListener("click", function (event) {
    event.preventDefault();
    // shouldNavigateAway = true;
    let imei = imeiNameInput.value.trim();

    username = emailInput.value.trim() || "safety-net";
    currentImei = imei;
    // console.log("imei -line 519");
    console.log(imei);
    // console.log(username);
    // location.reload();
    API.getImei(imei, (result) => {
      // console.log(result);
      saveImei(result);
      // clearInputs();
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

    // parseLastImei(lastImei),
    // console.log("parsing last imei");
  }
  // console.log("Last imei:", JSON.stringify(lastImei));
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
    // console.log(imeiSummary.numRequests);
    // console.log("first option on the init Imei function triggered ");
    renderImeiSummary(imeiSummary);
  } else {
    lastImei = await API.getLastImei();

    // console.log(lastImei._id);
    let currentImei = location.search.split("=")[1].trim();
    if (lastImei._id === undefined) {
      // console.log(lastImei);
      // parseLastImei(lastImei),
      // console.log("parsing last imei");
    } else if (lastImei._id === currentImei) {
      // console.log("lastImei === currentImei");
      //"parseLastImei(lastImei)"
      location.search = "/";
    } else if (lastImei._id != currentImei) {
      // console.log(lastImei);
      // console.log(currentImei);
      // console.log("lastImei != currentImei");

      // location.reload();
    }
    // renderNoImeiText();
  }
  //location.search = "?id=" + lastImei._id;
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
  // const tallied = results.reduce((acc, curr) => {
  // console.log("lastImei.requests[0]");
  // console.log(lastImei.requests[0]);

  if (lastImei.requests[0].type === "imei") {
    // console.log("type is imei");
    // console.log(lastImei.requests[0]);
    let response = JSON.parse(lastImei.requests[0].response);
    let sampleResponse = JSON.parse(response);
    // location.href = "?id=" + lastImei._id;
    // console.log(sampleResponse);
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

initImei();
