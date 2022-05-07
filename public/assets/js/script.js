// function to force js to wait till the whole document loads
$(document).ready(function () {
  // setting up some global variables
  var sampleResponse = {data:{
    blacklist: {status: false},
    brand: "Apple",
    controlNumber: 6,
    device_id: 7243,
    device_image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6s-plus.jpg",
    device_spec:{
    aliases:  ['A1699', 'A1690', 'A1687', 'A1634'],
    bluetooth: ['4.2', 'A2DP', 'LE'],
    nettech:  ['GSM', 'CDMA', 'HSPA', 'EVDO', 'LTE'],
    nfc: true,
    os: "iOS 9",
    os_family: "iOS",
    sim_slots: "1",
    speed: ['HSPA 42.2/5.76 Mbps', 'LTE-A (2CA) Cat6 300/50 Mbps', 'EV-DO Rev.A 3.1 Mbps'],
    usb: ['2.0', 'proprietary reversible connector'],
    wlan: ['Wi-Fi 802.11 a/b/g/n/ac', 'dual-band', 'hotspot']},
    
    frequency: [
     "CDMA2000",
"LTE FDD BAND 1",
  "LTE FDD BAND 2",
   , "LTE FDD BAND 3"
   ,"LTE FDD BAND 4"
    ,"LTE FDD BAND 5"
    ,"LTE FDD BAND 7"
    ,"LTE FDD BAND 8"
   , "LTE FDD BAND 12"
   , "LTE FDD BAND 13"
    , "LTE FDD BAND 17"
    , "LTE FDD BAND 18"
   , "LTE FDD BAND 19"
   , "LTE FDD BAND 20"
    , "LTE FDD BAND 25"
  , "LTE FDD BAND 26"
    , "LTE FDD BAND 27"
    , "LTE FDD BAND 28"
   , "LTE FDD BAND 29"
    ,"LTE TDD BAND 38"
    , "LTE TDD BAND 39"
    , "LTE TDD BAND 40"
   , "LTE TDD BAND 41"
   ,"GSM850 (GSM800)"
   , "GSM 900"
   , "GSM 1800"
    , "GSM 1900"
   ,"WCDMA FDD Band 1"
   , "WCDMA FDD Band 2"
    , "WCDMA FDD Band 4"
    , "WCDMA FDD Band 5"
    , "WCDMA FDD Band 8"
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
    success: true}};

    // development test variables

    var deviceImage = sampleResponse.data.device_image ;
    var deviceBluetooth =  sampleResponse.data.device_spec.bluetooth[0] + ", " +sampleResponse.data.device_spec.bluetooth[1]+", "+sampleResponse.data.device_spec.bluetooth[2];
   
    var deviceNettech =  sampleResponse.data.device_spec.nettech[0] + ", " +sampleResponse.data.device_spec.nettech[1]+", "+sampleResponse.data.device_spec.nettech[2] +", "+sampleResponse.data.device_spec.nettech[3] +", "+sampleResponse.data.device_spec.nettech[4];
    var deviceSpeed =  sampleResponse.data.device_spec.nettech[0] + ", " +sampleResponse.data.device_spec.nettech[1]+", "+sampleResponse.data.device_spec.nettech[2] +", "+sampleResponse.data.device_spec.nettech[3] +", "+sampleResponse.data.device_spec.nettech[4];

//----------------


  var imeis = [];
  var cities = [];
  var lat = "";
  var lon = "";
  var cityDiv;
  var cardsFull = true;
  var stop1 = "dudur1";
  var sampleDump = "charlie";

  //=========================
  sampleDump =`<div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 device">
<div class="text-center"  style="width: 200px; height: 250px; background: rgb(136, 210, 245); 
border-radius: 5px; margin: 0 auto; position: relative; top: -40px;">  
<img src= ${deviceImage} alt="" 
style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%);"> 
</div>
<h1 class="text-center" style="color: #fff;">Apple iPhone 6s Plus</h1>
 <h3 class="text-center" style="color: #fff;">For back to the previous page click <a href="/device">here</a></h3>

</div><table id="w1" class="table table-striped table-bordered detail-view"><tbody>  <tr>

  <tr>
    <th>Bluetooth</th>
    <td>${deviceBluetooth}</td>
  </tr>
 
  <tr>
    <th>Net tech</th>
    <td>${deviceNettech}</td>
  </tr>
 
  <tr>
    <th>Connection Speed</th>
    <td>${deviceSpeed}</td>
  </tr>
  <tr>
    <th>Chipset Hl</th>
    <td>Apple A9</td>
  </tr>
  <tr>
    <th>Colors</th>
    <td>Space Gray, Silver, Gold, Rose Gold</td>
  </tr>
  <tr>
    <th>Cpu</th>
    <td>Dual-core 1.84 GHz Twister</td>
  </tr>
  <tr>
    <th>Dimensions</th>
    <td>158.2 x 77.9 x 7.3 mm (6.23 x 3.07 x 0.29 in)</td>
  </tr>
  <tr>
    <th>Displayother</th>
    <td>3D Touch display</td>
  </tr>
  <tr>
    <th>Displayprotection</th>
    <td>Ion-strengthened glass, oleophobic coating</td>
  </tr>
  <tr>
    <th>Displayres Hl</th>
    <td>1080x1920 pixels</td>
  </tr>
  <tr>
    <th>Displayresolution</th>
    <td>1080 x 1920 pixels, 16:9 ratio (~401 ppi density)</td>
  </tr>
  <tr>
    <th>Displaysize</th>
    <td>5.5 inches, 83.4 cm2 (~67.7% screen-to-body ratio)</td>
  </tr>
  <tr>
    <th>Displaysize Hl</th>
    <td>5.5"</td>
  </tr>
  <tr>
    <th>Displaytype</th>
    <td>IPS LCD capacitive touchscreen, 16M colors</td>
  </tr>
  <tr>
    <th>Featuresother</th>
    <td>Siri natural language commands and dictation</td>
  </tr>
  <tr>
    <th>Gps</th>
    <td>Yes, with A-GPS, GLONASS, GALILEO, QZSS</td>
  </tr>
  <tr>
    <th>Gpu</th>
    <td>PowerVR GT7600 (six-core graphics)</td>
  </tr>
  <tr>
    <th>Internalmemory</th>
    <td>16GB 2GB RAM, 32GB 2GB RAM, 64GB 2GB RAM, 128GB 2GB RAM</td>
  </tr>
  <tr>
    <th>Memoryslot</th>
    <td>No</td>
  </tr>
  <tr>
    <th>Modelname</th>
    <td>Apple iPhone 6s Plus</td>
  </tr>
  <tr>
    <th>Net 2g</th>
    <td>GSM 850 / 900 / 1800 / 1900 </td>
  </tr>
  <tr>
    <th>Net 3g</th>
    <td>HSDPA 850 / 900 / 1700 / 1900 / 2100 </td>
  </tr>
  <tr>
    <th>Net 4g</th>
    <td>LTE band 1(2100), 2(1900), 3(1800), 4(1700/2100), 5(850), 7(2600), 8(900), 12(700), 13(700), 17(700),
      18(800), 19(800), 20(800), 25(1900), 26(850), 28(700), 29(700), 30(2300) - A1633</td>
  </tr>
  <tr>
    <th>Nettech</th>
    <td>GSM / CDMA / HSPA / EVDO / LTE</td>
  </tr>
  <tr>
    <th>Nfc</th>
    <td>Yes (Apple Pay only)</td>
  </tr>
  <tr>
    <th>Optionalother</th>
    <td>16-bit/44.1kHz audio
      Active noise cancellation with dedicated mic</td>
  </tr>
  <tr>
    <th>Os</th>
    <td>iOS 9, upgradable to iOS 13.3</td>
  </tr>
  <tr>
    <th>Os Hl</th>
    <td>iOS 9, up to iOS 13.3</td>
  </tr>
  <tr>
    <th>Price</th>
    <td>€ 249.99 / $ 170.00 / £ 209.00 / ₹ 39,975</td>
  </tr>
  <tr>
    <th>Radio</th>
    <td>No</td>
  </tr>
  <tr>
    <th>Ramsize Hl</th>
    <td>2</td>
  </tr>
  <tr>
    <th>Released Hl</th>
    <td>Released 2015, September</td>
  </tr>
  <tr>
    <th>Sar Eu</th>
    <td>0.93 W/kg (head) &nbsp; &nbsp; 0.98 W/kg (body) &nbsp; &nbsp; </td>
  </tr>
  <tr>
    <th>Sar Us</th>
    <td>1.12 W/kg (head) &nbsp; &nbsp; 1.14 W/kg (body) &nbsp; &nbsp; </td>
  </tr>
  <tr>
    <th>Sensors</th>
    <td>Fingerprint (front-mounted), accelerometer, gyro, proximity, compass, barometer</td>
  </tr>
  <tr>
    <th>Sim</th>
    <td>Nano-SIM</td>
  </tr>
  <tr>
    <th>Speed</th>
    <td>HSPA 42.2/5.76 Mbps, LTE-A (2CA) Cat6 300/50 Mbps, EV-DO Rev.A 3.1 Mbps</td>
  </tr>
  <tr>
    <th>Status</th>
    <td>Available. Released 2015, September</td>
  </tr>
  <tr>
    <th>Storage Hl</th>
    <td>16GB/32GB/128GB storage, no card slot</td>
  </tr>
  <tr>
    <th>Tbench</th>
    <td>
      Basemark OS II 2.0: 2261</td>
  </tr>
  <tr>
    <th>Usb</th>
    <td>2.0, proprietary reversible connector</td>
  </tr>
  <tr>
    <th>Videopixels Hl</th>
    <td>2160p</td>
  </tr>
  <tr>
    <th>Weight</th>
    <td>192 g (6.77 oz)</td>
  </tr>
  <tr>
    <th>Wlan</th>
    <td>Wi-Fi 802.11 a/b/g/n/ac, dual-band, hotspot</td>
  </tr>
  <tr>
    <th>Year</th>
    <td>2015, September</td>
  </tr>
</tbody>
</table>`;
  //=========================


  function imeiSearch(stop2, imei1) {
    //https://imeidb.xyz/api/imei/353283075129556?token=hLXML4jCI-ekWSoSBq4F&format=json

    var imei = imei1;
    var APIKey = "hLXML4jCI-ekWSoSBq4F";
stop1=stop2;

    var queryURL =
      "https://imeidb.xyz/api/imei" +
      stop1 +
      imei +
      "?token=" +
      APIKey +
      "&format=json";
    // var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    // var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

    // Creating an AJAX call for the specific city button being clicked
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      stop1 = "expended";
      console.log(queryURL);
      // preparing the div that will hold the city and date displayed
      // cityDiv = $(".city");
      imeiDiv = $(".imei");
      imeiDiv.removeClass("no-show");
      imeiDiv.addClass("cities-view");

      console.log(response);

      var response1 = response;


    


      // var cityName = response.city.name;
      var modelName = response1.data.name;
      // lat = response.city.coord.lat;
      // lon = response.city.coord.lon;

      // var humidityD = response.list[3].main.humidity;
      // var windSpeedDm = response.list[3].wind.speed;
      // var windSpeedD = (windSpeedDm * 2.237).toFixed(1);

      // var presentDate = moment().format('MMM Do YYYY');
      // var presentDate = moment().format('MMM Do YYYY');
      // $(cityDiv).html(cityName + " (" + presentDate + ")");
      $(cityDiv).html(modelName);
      // $(".wind").text("Wind Speed: " + windSpeedD + " M/pH");
      // $(".humidity").text("Humidity: " + humidityD + " %");

      $("#cities-view").prepend(cityDiv);

      // var weatherIcon = response.list[2].weather[0].icon;
      // var imgURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      var imgURL = response1.data.device_image;
      var frequencies = response1.data.frequency;

      // // Creating an element to hold the image
      var imageD = $(".imgD");
      imageD.removeClass("no-show");
      imageD.attr("src", imgURL);
      imageD.attr("alt", "phone image");
      $(".card").removeClass("no-show");
      // calling the function for displaying and setting class to the UV -Index
      displayUv();



sampleDump =`<div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 device">
<div class="text-center"  style="width: 200px; height: 250px; background: rgb(136, 210, 245); border-radius: 5px; margin: 0 auto; position: relative; top: -40px;">  <img src="https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6s-plus.jpg" alt="" style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%);"> </div><h1 class="text-center" style="color: #fff;">Apple iPhone 6s Plus</h1><!-- <h3 class="text-center" style="color: #fff;">For back to the previous page click <a href="/device">here</a></h3></div><table id="w1" class="table table-striped table-bordered detail-view"><tbody>  <tr>
    <th>Batdescription 1</th>
    <td>Non-removable Li-Ion 2750 mAh battery (10.45 Wh)</td>
  </tr>
  <tr>
    <th>Batlife</th>
    <td>
      Endurance rating 85h
    </td>
  </tr>
  <tr>
    <th>Batmusicplayback 1</th>
    <td>Up to 80 h</td>
  </tr>
  <tr>
    <th>Batsize Hl</th>
    <td>2750</td>
  </tr>
  <tr>
    <th>Batstandby 1</th>
    <td>Up to 384 h (3G)</td>
  </tr>
  <tr>
    <th>Battalktime 1</th>
    <td>Up to 24 h (3G)</td>
  </tr>
  <tr>
    <th>Battype Hl</th>
    <td>Li-Ion</td>
  </tr>
  <tr>
    <th>Bluetooth</th>
    <td>4.2, A2DP, LE</td>
  </tr>
  <tr>
    <th>Body Hl</th>
    <td>192g, 7.3mm thickness</td>
  </tr>
  <tr>
    <th>Bodyother</th>
    <td>Apple Pay (Visa, MasterCard, AMEX certified)</td>
  </tr>
  <tr>
    <th>Build</th>
    <td>Front glass, aluminum body</td>
  </tr>
  <tr>
    <th>Cam 1features</th>
    <td>Dual-LED dual-tone flash, HDR</td>
  </tr>
  <tr>
    <th>Cam 1modules</th>
    <td>12 MP, f/2.2, 29mm (standard), 1/3", 1.22m, PDAF, OIS</td>
  </tr>
  <tr>
    <th>Cam 1video</th>
    <td>2160p@30fps, 1080p@60fps, 1080p@120fps, 720p@240fps</td>
  </tr>
  <tr>
    <th>Cam 2features</th>
    <td>Face detection, HDR, panorama</td>
  </tr>
  <tr>
    <th>Cam 2modules</th>
    <td>5 MP, f/2.2, 31mm (standard)</td>
  </tr>
  <tr>
    <th>Cam 2video</th>
    <td>1080p@30fps</td>
  </tr>
  <tr>
    <th>Camerapixels Hl</th>
    <td>12</td>
  </tr>
  <tr>
    <th>Chipset</th>
    <td>Apple A9 (14 nm)</td>
  </tr>
  <tr>
    <th>Chipset Hl</th>
    <td>Apple A9</td>
  </tr>
  <tr>
    <th>Colors</th>
    <td>Space Gray, Silver, Gold, Rose Gold</td>
  </tr>
  <tr>
    <th>Cpu</th>
    <td>Dual-core 1.84 GHz Twister</td>
  </tr>
  <tr>
    <th>Dimensions</th>
    <td>158.2 x 77.9 x 7.3 mm (6.23 x 3.07 x 0.29 in)</td>
  </tr>
  <tr>
    <th>Displayother</th>
    <td>3D Touch display</td>
  </tr>
  <tr>
    <th>Displayprotection</th>
    <td>Ion-strengthened glass, oleophobic coating</td>
  </tr>
  <tr>
    <th>Displayres Hl</th>
    <td>1080x1920 pixels</td>
  </tr>
  <tr>
    <th>Displayresolution</th>
    <td>1080 x 1920 pixels, 16:9 ratio (~401 ppi density)</td>
  </tr>
  <tr>
    <th>Displaysize</th>
    <td>5.5 inches, 83.4 cm2 (~67.7% screen-to-body ratio)</td>
  </tr>
  <tr>
    <th>Displaysize Hl</th>
    <td>5.5"</td>
  </tr>
  <tr>
    <th>Displaytype</th>
    <td>IPS LCD capacitive touchscreen, 16M colors</td>
  </tr>
  <tr>
    <th>Featuresother</th>
    <td>Siri natural language commands and dictation</td>
  </tr>
  <tr>
    <th>Gps</th>
    <td>Yes, with A-GPS, GLONASS, GALILEO, QZSS</td>
  </tr>
  <tr>
    <th>Gpu</th>
    <td>PowerVR GT7600 (six-core graphics)</td>
  </tr>
  <tr>
    <th>Internalmemory</th>
    <td>16GB 2GB RAM, 32GB 2GB RAM, 64GB 2GB RAM, 128GB 2GB RAM</td>
  </tr>
  <tr>
    <th>Memoryslot</th>
    <td>No</td>
  </tr>
  <tr>
    <th>Modelname</th>
    <td>Apple iPhone 6s Plus</td>
  </tr>
  <tr>
    <th>Net 2g</th>
    <td>GSM 850 / 900 / 1800 / 1900 </td>
  </tr>
  <tr>
    <th>Net 3g</th>
    <td>HSDPA 850 / 900 / 1700 / 1900 / 2100 </td>
  </tr>
  <tr>
    <th>Net 4g</th>
    <td>LTE band 1(2100), 2(1900), 3(1800), 4(1700/2100), 5(850), 7(2600), 8(900), 12(700), 13(700), 17(700),
      18(800), 19(800), 20(800), 25(1900), 26(850), 28(700), 29(700), 30(2300) - A1633</td>
  </tr>
  <tr>
    <th>Nettech</th>
    <td>GSM / CDMA / HSPA / EVDO / LTE</td>
  </tr>
  <tr>
    <th>Nfc</th>
    <td>Yes (Apple Pay only)</td>
  </tr>
  <tr>
    <th>Optionalother</th>
    <td>16-bit/44.1kHz audio
      Active noise cancellation with dedicated mic</td>
  </tr>
  <tr>
    <th>Os</th>
    <td>iOS 9, upgradable to iOS 13.3</td>
  </tr>
  <tr>
    <th>Os Hl</th>
    <td>iOS 9, up to iOS 13.3</td>
  </tr>
  <tr>
    <th>Price</th>
    <td>€ 249.99 / $ 170.00 / £ 209.00 / ₹ 39,975</td>
  </tr>
  <tr>
    <th>Radio</th>
    <td>No</td>
  </tr>
  <tr>
    <th>Ramsize Hl</th>
    <td>2</td>
  </tr>
  <tr>
    <th>Released Hl</th>
    <td>Released 2015, September</td>
  </tr>
  <tr>
    <th>Sar Eu</th>
    <td>0.93 W/kg (head) &nbsp; &nbsp; 0.98 W/kg (body) &nbsp; &nbsp; </td>
  </tr>
  <tr>
    <th>Sar Us</th>
    <td>1.12 W/kg (head) &nbsp; &nbsp; 1.14 W/kg (body) &nbsp; &nbsp; </td>
  </tr>
  <tr>
    <th>Sensors</th>
    <td>Fingerprint (front-mounted), accelerometer, gyro, proximity, compass, barometer</td>
  </tr>
  <tr>
    <th>Sim</th>
    <td>Nano-SIM</td>
  </tr>
  <tr>
    <th>Speed</th>
    <td>HSPA 42.2/5.76 Mbps, LTE-A (2CA) Cat6 300/50 Mbps, EV-DO Rev.A 3.1 Mbps</td>
  </tr>
  <tr>
    <th>Status</th>
    <td>Available. Released 2015, September</td>
  </tr>
  <tr>
    <th>Storage Hl</th>
    <td>16GB/32GB/128GB storage, no card slot</td>
  </tr>
  <tr>
    <th>Tbench</th>
    <td>
      Basemark OS II 2.0: 2261</td>
  </tr>
  <tr>
    <th>Usb</th>
    <td>2.0, proprietary reversible connector</td>
  </tr>
  <tr>
    <th>Videopixels Hl</th>
    <td>2160p</td>
  </tr>
  <tr>
    <th>Weight</th>
    <td>192 g (6.77 oz)</td>
  </tr>
  <tr>
    <th>Wlan</th>
    <td>Wi-Fi 802.11 a/b/g/n/ac, dual-band, hotspot</td>
  </tr>
  <tr>
    <th>Year</th>
    <td>2015, September</td>
  </tr>
</tbody>
</table>`;
  


$("#main-dump").append("<b>Appended text</b>");
$("#main-dump").append(sampleDump);

    });
  }
  function displayCityInfo() {
    var city = $(this).attr("data-name");
    var APIKey = "f2e73a675d880326530db1f8aee7437b";
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      APIKey;

    // Creating an AJAX call for the specific city button being clicked
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // preparing the div that will hold the city and date displayed
      cityDiv = $(".city");
      cityDiv.removeClass("no-show");
      cityDiv.addClass("cities-view");

      var cityName = response.city.name;
      lat = response.city.coord.lat;
      lon = response.city.coord.lon;

      var humidityD = response.list[3].main.humidity;
      var windSpeedDm = response.list[3].wind.speed;
      var windSpeedD = (windSpeedDm * 2.237).toFixed(1);

      var presentDate = moment().format("MMM Do YYYY");
      $(cityDiv).html(cityName + " (" + presentDate + ")");
      $(".wind").text("Wind Speed: " + windSpeedD + " M/pH");
      $(".humidity").text("Humidity: " + humidityD + " %");

      $("#cities-view").prepend(cityDiv);

      var weatherIcon = response.list[2].weather[0].icon;
      var imgURL =
        "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

      // // Creating an element to hold the image
      var imageD = $(".imgD");
      imageD.removeClass("no-show");
      imageD.attr("src", imgURL);
      imageD.attr("alt", "weather icon");
      $(".card").removeClass("no-show");
      // calling the function for displaying and setting class to the UV -Index
      displayUv();
    });
  }

  // funcrtion to create the buttons from the array or local storage
  function renderButtons() {
    $("#buttons-view").empty();
    // Looping through the array of cities
    for (var i = 0; i < 5; i++) {
      var a = $("<li>");
      a.addClass("city-btn");
      a.addClass(cities[cities.length - 1 - i]);

      // Adding a data-attribute
      a.attr("data-name", cities[cities.length - 1 - i]);
      // Providing the initial button text
      a.text(cities[cities.length - 1 - i]);
      // Adding the button to the buttons-view div
      $("#buttons-view").append(a);
    }
    // added a trigger to populate data on initial  input of the city
    //added the check Boolean change to guarantee the forecast cards are displayed once only

    cardsFull = true;
    $("li." + cities[cities.length - 1]).trigger("click");
  }

  // This function handles events where a city button is clicked
  $("#add-city").on("click", function (event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var city = $("#city-input").val().trim();
    // Adding the city from the textbox to the cities array
    cities.push(city);
    // recording the last 5 cities used inthe array to the local storrage

    for (var i = 0; i < 5; i++) {
      localStorage.setItem(i, cities[cities.length - i - 1]);
    }
    // Calling renderButtons which handles the processing of our cities array
    renderButtons();
  });
  function imeiSearch1() {
    

    var imei1 = $("#imei-input").val().trim()
    console.log("emai1 "+imei1);
    console.log("dudu1");
    console.log(stop1);
    stop1 = "/";
    console.log(stop1);
    imeiSearch(stop1, imei1);
  }
  // Adding a click event listener to all elements with a class of "city-btn"
  // $(document).on("click", ".city-btn", displayCityInfo);
  $(document).on("click", "#imei-btn", imeiSearch1);

  var datesArrey = ["day0", ".day1", ".day2", ".day3", ".day4", ".day5"];
  function displayUv() {
    var APIKey = "f2e73a675d880326530db1f8aee7437b";
    // puting together the queryURL for the second AJAX call
    var queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,hourly&appid=" +
      APIKey;

    // Creating an AJAX call for the specific city button being clicked by Lat and Lon
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // getting the uv value;
      var uvD = response.current.uvi;
      // getting the temp in K  value;
      var tempD = response.current.temp;
      // Convert the temp K  to fahrenheit
      var tempF = (tempD - 273.15) * 1.8 + 32;
      // Convert the temp K  to Celsius
      var tempC = tempD - 273.15;

      // clearing the previous and assigning current classes for the diferent values of UV Index
      if (uvD < 3) {
        $("#uv").removeClass();
        $("#uv").addClass("uvSafe");
      } else if (uvD > 2 && uvD < 6) {
        $("#uv").removeClass();
        $("#uv").addClass("uvModerate");
      } else if (uvD > 5 && uvD < 8) {
        $("#uv").removeClass();
        $("#uv").addClass("uvSevere");
      } else if (uvD > 7 && uvD < 11) {
        $("#uv").removeClass();
        $("#uv").addClass("uvSevere1");
      } else if (uvD > 11) {
        $("#uv").removeClass();
        $("#uv").addClass("uvInsane");
      } else {
      }

      // trimming the temp values to one digit after the decimal point and assigning to the appr div
      $(".tempF").text("Temperature (F) " + tempF.toFixed(1));
      //adding the C temp
      var pOne = $("<p>").text("Temperature (C): " + tempC.toFixed(1));
      $(".tempF").append(pOne);
      // displayng the UV value
      $("#uv").text(uvD);
      createForecast();

      function createForecast() {
        // clearing the display divs for the 5 day forecast cards
        if (cardsFull === true) {
          for (var i = 1; i < 6; i++) {
            $(datesArrey[i]).empty();
            // setting the check boolean to "false" after emtying the card divs
            cardsFull = false;
          }
        } else {
        }
        // module cards starts
        for (var i = 1; i < 6; i++) {
          var date1 = $("<p>");
          var dateDU1 = response.daily[i].dt;
          var dateD1 = new Date();
          dateD1.setTime(dateDU1 * 1000);

          var month = dateD1.getMonth();
          var day = dateD1.getDate();
          var year = dateD1.getFullYear();
          var dateDD = month + 1 + "/" + day + "/" + year;

          date1.text(dateDD);
          $(datesArrey[i]).append(date1);
          $(datesArrey[i]).removeClass("no-show");

          var weatherIcon = response.daily[i].weather[0].icon;

          var imgURL =
            "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

          // // Creating an element to hold the image
          var imageDp = $("<img>");

          imageDp.attr("src", imgURL);
          imageDp.attr("alt", "weather icon");
          // appending to the card
          $(datesArrey[i]).append(imageDp);

          // creating values for humidity and temp
          var humidityD = response.daily[i].humidity;
          var tempK = response.daily[i].temp.day;
          var tempF = (tempK - 273.15) * 1.8 + 32;
          var pTwo = $("<p>").text("Humidity: " + humidityD + " % ");
          var pThree = $("<p>").text("Temp: " + tempF.toFixed(1) + " F");
          // appending to the card
          $(datesArrey[i]).append(pTwo);
          $(datesArrey[i]).append(pThree);
          // setting the check var to true to avoid creating more than one set of weather cards for the prognosis
          // module for cards ends here
        }
        cardsFull = true;
      }
    });
  }


  $("#main-dump").append(sampleDump);

  // module for filling the cities array from local storage on startup
  function fillArreyOnStart() {
    for (var i = 0; i < 5; i++) {
      var cityS = localStorage.getItem(i);
      cities.push(cityS);
      renderButtons();
    }
    // creating a manual click event to display last shown city on start
    // cardsFull = true;
    // $("li." + cities[0]).trigger('click');
  }
  // creating a call for the fill up function above
  // fillArreyOnStart();
});
