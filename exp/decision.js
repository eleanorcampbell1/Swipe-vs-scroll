// FUNCTIONS AND VARIABLES FOR DECISION TASK
let fridgesHeight = 450;
let fridgesWidth = 350;
let numDecisions = 4;
let fridgeImages = [
  "images/fridge1.png",
  "images/fridge2.png",
  "images/fridge3.png",
  "images/fridge4.png",
  "images/fridge5.png",
  "images/fridge6.png",
  "images/fridge7.png",
  "images/fridge8.png"
]
let features = [
  {type: "Ice", positive: "Ice dispenser", negative: "No ice dispenser"},
  {type: "Water dispenser", positive: "Water dispenser", negative: "No water dispenser"},
  {type: "Screen", positive: "Touchscreen / Bluetooth Connectivity", negative: "No touchscreen"},
  {type: "Freezer", positive: "Bottom freezer", negative: "Other freezers"},
  {type: "Cooling", positive: "Dual cooling system", negative: "Single cooling system"},
  {type: "Doors", positive: "French doors", negative: "Single door"},
  {type: "Energy", positive: "Energy efficient", negative: "Not energy efficient"},
  {type: "Noise", positive: "Quiet (<40 dB)", negative: "Loud (>40dB)"},
  {type: "Warranty", positive: "Warranty", negative: "No warranty (or less warranty)"},
  {type: "Water filter", positive: "Built in water filter", negative: "No built in water filter"}, 
  {type: "Shelves", positive: "Spill proof shelves", negative: "No spill proof shelves"},
  {type: "Alarm", positive: "Door alarm", negative: "No door alarm"}
]
let positiveFeatures = [
    "Ice dispenser",
    "Water dispenser",
    "Touchscreen / Bluetooth Connectivity",
    "Bottom freezer",
    "Dual cooling system",
    "French doors",
    "Energy efficient",
    "Quiet (<40 dB)",
    "Warranty",
    "Spill proof shelves",
    "Built in water filter"
]
let negativeFeatures = [
    "Single cooling system",
    "Other freezers",
    "No ice dispenser",
    "No touchscreen",
    "Single door",
    "Not energy efficient",
    "Loud (>40dB)",
    "No warranty (or less warranty)",
    "No spill proof shelves",
    "No built in water filter"
]
let dtFeatureProportionsPrice = shuffleNewObj([
  [9, 3, "2500"],   // 75% positive (best decision)
  [6, 6, "3000"],   // 50% positive
  [6, 6, "2700"],   // 50% positive
  [3, 9, "2400"]]); // 25% positive

  let proportionAndPrices = shuffleNewObj([
  [0.75, "$2500"],   // 75% positive (best decision)
  [0.50, "$3000"],   // 50% positive
  [0.50, "$2700"],   // 50% positive
  [0.25, "$2400"]]); // 25% positive

let allFeatures = shuffleNewObj([...positiveFeatures, ...negativeFeatures]);

let createTrialImages = function(n, imageArray){
    unshuffledArray = jsPsych.randomization.sampleWithoutReplacement(imageArray, n);
    return jsPsych.randomization.shuffle(unshuffledArray);
}
let decisionTrialImages = createTrialImages(numDecisions, fridgeImages);
//features used in the trial, for the debrief
let trialFeatures = [];

// creates single array of positive and negative features for one fridge
// called in createAllFeatureArrays
let createFeatureArray = function(posProportion){
  let positiveCount = Math.floor(features.length * posProportion);
  console.log("features.length: " + features.length);
  console.log("posProportion: " + posProportion + " positiveCount: " + positiveCount);

  let shuffled = shuffleNewObj(features);
  let posFeatures = shuffled.slice(0, positiveCount).map(attr => attr.positive);
  let negFeatures = shuffled.slice(positiveCount).map(attr => attr.negative);

  let finalFeatures = shuffleNewObj(posFeatures.concat(negFeatures));
  return finalFeatures;
}


// creates an array of feature arrays, each array corresponds to a fridge
let createAllFeatureArrays = function(){
  let finalArray = [];
  for(i = 0; i < proportionAndPrices.length; i++){
    //add features
    let temp = createFeatureArray(proportionAndPrices[i][0]);
    //add price
    temp.unshift(proportionAndPrices[i][1]);
    //add to array of arrays
    finalArray.push(temp);
  }
  console.log("features array: "+ finalArray);
  return finalArray;
}

// html passed into the debrief
let decisionFormHtml = `
<div style="margin-top: 70px"> Which fridge would you be most likely to purchase?</div>
<div style="display: flex; flex-direction: column; margin-bottom: 20px; font-weight: normal;">
  ${Array.from({ length: numDecisions }, (_, index) => `
    <label style="margin-bottom: 5px; font-weight: normal;">
      <input type="radio" name="most_likely_purchase" value="Fridge ${index + 1}"> Fridge ${index + 1}
    </label>
  `).join('')}
</div>
  <p>Which fridges were you shown? (select all that you can remember)</p>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px;">
    ${fridgeImages.map((imagePath, index) => `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #ddd; padding: 10px; border-radius: 8px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);">
        <img src="${imagePath}" alt="Fridge ${index + 1}" style="width: 200px; height: 200px; object-fit: contain; margin-bottom: 10px;">
        <label style="margin-top: 5px;">
          <input type="checkbox" name="fridges" value="${imagePath}"> Option ${index + 1}
        </label>
      </div>
    `).join('')}
  </div>
  <p>List all the fridge features you can remember</p>
  <div style="display: flex; flex-direction: column; margin-bottom: 20px; font-weight: normal;">
  ${Array.from({ length: allFeatures.length }, (_, index) => `
    <label style="margin-bottom: 5px; font-weight: normal; text-align: left; margin-left: 330px">
      <input type="checkbox" name="feature" value="${allFeatures[index]}"> ${allFeatures[index]}
    </label>
  `).join('')}
</div>
`;

const decisionDebrief = {
    type: "ec-decision-debrief",
    fridgeImages: fridgeImages,
    allFeatures: allFeatures,
    trial_fridge_images: decisionTrialImages,
    trial_features: trialFeatures,
    data: {
      subj_id: subj_name,
      test_part: 'decision-debrief',
      key_condition: swipe ? "swipe" : "scroll"
    }, 
    on_start: function(){
      if(swipe){
        let data = jsPsych.data.get().filter({test_part: 'swipe-decision'}).values()[0];
        this.trial_features = data.features_price;
      }else{
        let data = jsPsych.data.get().filter({test_part: 'scroll-decision'}).values()[0];
        this.trial_features = data.features_price;
      }
    }
  };

  
let scrollDecision = {
    type: 'ec-decision-scroll-image-response',
    images: decisionTrialImages,
    imageWidth: fridgesWidth,
    imageHeight: fridgesHeight,
    trial_duration: threeMinMS,
    features: createAllFeatureArrays(),
    data: {
        subj_id: subj_name,
        test_part: 'scroll-decision',
        feature_proportions: dtFeatureProportionsPrice,
        key_condition: swipe ? "swipe" : "scroll"
    },
    on_finish: function (data) {
      trialFeatures = data.features_price;
      console.log("trialFeatures" + trialFeatures);
      saveData(subj_name, jsPsych.data.get().csv());
    }
}
let swipeDecision = {
    type: 'ec-swipe-image-response',
    stimulus: decisionTrialImages,
    choices:[],
    stimulus_height: fridgesHeight,
    stimulus_width: fridgesWidth,
    trial_duration: threeMinMS,
    features: createAllFeatureArrays(),
    data: {
      subj_id: subj_name,
      test_part: 'swipe-decision',
      feature_proportions: dtFeatureProportionsPrice,
      key_condition: swipe ? "swipe" : "scroll"
    },
    on_finish: function (data) {
      trialFeatures = data.features_price;
      console.log("trialFeatures" + trialFeatures);
      saveData(subj_name, jsPsych.data.get().csv());
    }
  }