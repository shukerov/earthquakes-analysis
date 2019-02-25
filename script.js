const endpoint = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

function getEarthquakes(callback) {
   const features = [];
   fetch(endpoint).then(response => {
         if (response.status === 200) {
            response.json().then(data => { 
               features.push(...data.features);
               callback(features);});
         } else {
            textArea.innerHTML = "Whoops something went wrong with the API endpoint";
            throw new Error("Could not fetch all_week.geojson");
         }
   });
   // return callback(features);
}

// finds all states in features and returns an object containing magnitudes of earthquakes
function findMags(features) {
   console.log(features);
   const stateReg = /, ([\w]+)/g;
   const magnitudes = features.reduce((res, item) => {
      const mag = Math.round(item.properties.mag);
      if (mag) {
         if (!res[mag]) {
            res[mag] = 0;
         } 
         res[mag]++;
      }
      return res;
   }, {});
   return magnitudes;
}

   // const states = features.reduce((obj, item) => {
   // // stringMatch = /, ([\w]+)/.exec(item.properties.place.match(stateReg));
   // stringMatch = item.properties.place.match(stateReg);
   // // console.log(stringMatch);
   // if (stringMatch) {
   //    console.log(stringMatch);
   //    //    if (!obj[state]) {
   //    //       obj[state] = 0;
   //    //    }
   //    //    obj[state]++;
   // }
   // }, {});
// finds matches in the place attribute of the JSON features
// returns features that match the wordToMatch string
function findMatches(regMatch, features) {
   // find matches
   const matches = features.filter(feature => {
      return feature.properties.place.match(regMatch);
   });

   // sort matches in ascending order
   return matches.sort((a, b) =>
      (a.properties.time > b.properties.time ? 1 : -1));
}

// calls findMatches, formats and fills the output div
function generateOutput() {
   const matchArray = findMatches(/, CA|, California/g, features);
   const outputString = matchArray.map(feature => {
      const time = new Date(feature.properties.time);
      return `${time.toISOString()} |\
              ${feature.properties.place} |\
              Magnitude: ${feature.properties.mag}`;
   }).join('\n');
   textArea.innerHTML = outputString + '\n';
}

// downloads the generated output
function downLoadOutput() {
   var outputText = document.getElementById('output').innerText;
   var textToSaveAsBlob = new Blob([outputText], {type:"text/plain"});
   var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
   downloadBtn.download = "js-output.txt"
   downloadBtn.href = textToSaveAsURL;
}

// select elements
const outputBtn = document.querySelector('#generate-output');
const downloadBtn = document.querySelector('#download-output');
const textArea = document.querySelector('#output');

// add events
outputBtn.addEventListener('click', generateOutput);
downloadBtn.addEventListener('click', downLoadOutput);

// chart experimentation
function graphMags(features) {
   var ctx = document.getElementById("myChart");
   var magnitudes = findMags(features);

   var myChart = new Chart(ctx, {
       type: 'bar',
       data: {
          labels: Object.keys(magnitudes),
             datasets: [{
                label: '# of earthquakes by magnitude',
                data: Object.values(magnitudes),
                backgroundColor: [
                   'rgba(255, 99, 132, 0.2)',
                   'rgba(54, 162, 235, 0.2)',
                   'rgba(255, 206, 86, 0.2)',
                   'rgba(75, 192, 192, 0.2)',
                   'rgba(153, 102, 255, 0.2)',
                   'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                   'rgba(255,99,132,1)',
                   'rgba(54, 162, 235, 1)',
                   'rgba(255, 206, 86, 1)',
                   'rgba(75, 192, 192, 1)',
                   'rgba(153, 102, 255, 1)',
                   'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
             }]
       },
       options: {
          scales: {
             yAxes: [{
                ticks: {
                   beginAtZero:true
                }
             }]
           }
       }
   });
}

getEarthquakes(graphMags);
