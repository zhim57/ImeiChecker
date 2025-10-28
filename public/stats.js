// Get all IMEI data from back-end

fetch("/api/imeis/range")
  .then(response => {
    return response.json();
  })
  .then(data => {
    populateChart(data);
  })
  .catch(err => {
    console.error("Error fetching IMEI data:", err);
  });

function generatePalette() {
  const arr = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600",
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600"
  ];

  return arr;
}

function populateChart(data) {
  // Extract data for charts
  let checkCounts = getCheckCounts(data);
  let dates = getDates(data);
  let imeiCount = data.length;

  const colors = generatePalette();

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "IMEI Checks Over Time",
          backgroundColor: "red",
          borderColor: "red",
          data: checkCounts,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "IMEI Check Activity"
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Date"
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Number of Checks"
            }
          }
        ]
      }
    }
  });

  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Requests per Day",
          data: checkCounts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 99, 132, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 132, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Daily IMEI Check Volume"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });

  let pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: ["Total IMEI Checks"],
      datasets: [
        {
          label: "IMEI Checks",
          backgroundColor: colors,
          data: [imeiCount]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Total IMEI Checks"
      }
    }
  });

  let donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Daily Distribution",
          backgroundColor: colors,
          data: checkCounts
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Check Distribution"
      }
    }
  });
}

function getCheckCounts(data) {
  let counts = [];

  data.forEach(imei => {
    // Count the number of requests in each IMEI record
    let count = imei.requests ? imei.requests.length : 1;
    counts.push(count);
  });

  return counts;
}

function getDates(data) {
  let dates = [];

  data.forEach(imei => {
    if (imei.day) {
      let date = new Date(imei.day);
      dates.push(date.toLocaleDateString());
    } else {
      dates.push("Unknown");
    }
  });

  return dates;
}
