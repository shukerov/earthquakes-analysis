const endpoint = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
features = [];

// fetch JSON data
fetch(endpoint)
   .then(blob => blob.json())
   .then(data => features.push(...data.features));

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
              Magnitude: ${feature.properties.mag}`;}).join('\n');
   textArea.innerHTML = outputString;
}

// downloads the generated output
function downLoadOutput() {
   var outputText = document.getElementById('output').innerText;
   var textToSaveAsBlob = new Blob([outputText], {type:"text/plain"});
   var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
   downloadBtn.download = "output.txt"
   downloadBtn.href = textToSaveAsURL;
}

// select elements
const outputBtn = document.querySelector('#generate-output');
const downloadBtn = document.querySelector('#download-output');
const textArea = document.querySelector('#output');

// add events
outputBtn.addEventListener('click', generateOutput);
downloadBtn.addEventListener('click', downLoadOutput);
