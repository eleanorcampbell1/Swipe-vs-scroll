// AESTHETIC TASK VARIABLES & FUNCTIONS
let numHalfAestheticImages = 27;
let uglyImages = [
  "images/ugly1.jpg",
  "images/ugly2.jpg",
  "images/ugly3.jpg",
  "images/ugly4.jpg",
  "images/ugly5.jpg",
  "images/ugly6.jpg",
  "images/ugly7.jpg",
  "images/ugly8.jpg",
  "images/ugly9.jpg",
  "images/ugly10.jpg",
  "images/ugly11.jpg",
  "images/ugly12.jpg",
  "images/ugly13.jpg",
  "images/ugly14.jpg",
  "images/ugly15.jpg",
  "images/ugly16.jpg",
  "images/ugly17.jpg",
  "images/ugly18.jpg",
  "images/ugly19.jpg",
  "images/ugly20.jpg",
  "images/ugly21.jpg",
  "images/ugly22.jpg",
  "images/ugly23.jpg",
  "images/ugly24.jpg",
  "images/ugly25.jpg",
  "images/ugly26.jpg",
  "images/ugly27.jpg",
  "images/ugly28.jpg",
  "images/ugly29.jpg",
  "images/ugly30.jpg",
  "images/ugly31.jpg",
  "images/ugly32.jpg",
  "images/ugly33.jpg",
  "images/ugly34.jpg",
  "images/ugly35.jpg",
  "images/ugly36.jpg",
  "images/ugly37.jpg",
  "images/ugly38.jpg",
  "images/ugly39.jpg",
  "images/ugly40.jpg",
  "images/ugly41.jpg",
  "images/ugly42.jpg",
  "images/ugly43.jpg",
  "images/ugly44.jpg",
  "images/ugly45.jpg",
  "images/ugly46.jpg",
  "images/ugly47.jpg",
  "images/ugly48.jpg",
  "images/ugly49.jpg",
  "images/ugly50.jpg",
  "images/ugly51.jpg",
  "images/ugly52.jpg",
  "images/ugly53.jpg",
  "images/ugly54.jpg",
  "images/ugly55.jpg",
  "images/ugly56.jpg"
];
let prettyImages = [
  "images/pretty1.jpg",
  "images/pretty2.jpg",
  "images/pretty3.jpg",
  "images/pretty4.jpg",
  "images/pretty5.jpg",
  "images/pretty6.jpg",
  "images/pretty7.jpg",
  "images/pretty8.jpg",
  "images/pretty9.jpg",
  "images/pretty10.jpg",
  "images/pretty11.jpg",
  "images/pretty12.jpg",
  "images/pretty13.jpg",
  "images/pretty14.jpg",
  "images/pretty15.jpg",
  "images/pretty16.jpg",
  "images/pretty17.jpg",
  "images/pretty18.jpg",
  "images/pretty19.jpg",
  "images/pretty20.jpg",
  "images/pretty21.jpg",
  "images/pretty22.jpg",
  "images/pretty23.jpg",
  "images/pretty24.jpg",
  "images/pretty25.jpg",
  "images/pretty26.jpg",
  "images/pretty27.jpg",
  "images/pretty28.jpg",
  "images/pretty29.jpg",
  "images/pretty30.jpg",
  "images/pretty31.jpg",
  "images/pretty32.jpg",
  "images/pretty33.jpg",
  "images/pretty34.jpg",
  "images/pretty35.jpg",
  "images/pretty36.jpg",
  "images/pretty37.jpg",
  "images/pretty38.jpg",
  "images/pretty39.jpg",
  "images/pretty40.jpg",
  "images/pretty41.jpg",
  "images/pretty42.jpg",
  "images/pretty43.jpg",
  "images/pretty44.jpg",
  "images/pretty45.jpg",
  "images/pretty46.jpg",
  "images/pretty47.jpg",
  "images/pretty48.jpg",
  "images/pretty49.jpg",
  "images/pretty50.jpg",
  "images/pretty51.jpg",
  "images/pretty52.jpg",
  "images/pretty53.jpg",
  "images/pretty54.jpg",
  "images/pretty55.jpg",
  "images/pretty56.jpg"
];
let allAestheticImages = uglyImages.concat(prettyImages);

let aestheticHeight = 750;
let aestheticWidth = 850;

let swa_instructions = {
  type: 'jo-html-keyboard-response',
  wait_duration: 0,
  choices: ['space'],
  stimulus: `
    <div style='margin: auto 0; text-align: center;'>
      <p>For this study, we’d like you to go through the images presented to you as if you’re going through your social media feed for the next 3 minutes.</p>
      <p>Like on social media, you can choose to “like” images by clicking the "Like" button.</p>
      <p>To navigate between images, <b>swipe up</b> for the next image and <b>down</b> for the previous one.</p>
      <br>
      <p>Afterwards, we will ask you a few questions.</p>
    </div>
  `,
  prompt: "<p style='color: black;'>Press SPACE to continue.</p>",
  data: {
    subj_id: subj_name,
    test_part: 'aesthetic_instructions'
  }
};
let sca_instructions = {
  type: 'jo-html-keyboard-response',
  wait_duration: 0,
  choices: ['space'],
  stimulus: `
    <div style='margin: auto 0; text-align: center;'>
      <p>For this study, we’d like you to go through the images presented to you as if you’re going through your social media feed for the next 3 minutes.</p>
      <p>Like on social media, you can choose to “like” images by clicking the "Like" button.</p>
      <p>To navigate between images, <b>scroll up</b> for the next image and <b>down</b> for the previous one.</p>
      <br>
      <p>Afterwards, we will ask you a few questions.</p>
    </div>
  `,
  prompt: "<p style='color: black;'>Press SPACE to continue.</p>",
  data: {
    subj_id: subj_name,
    test_part: 'aesthetic_instructions'
  }
};

// Creates array of randomly selected image paths for aesthetic task (1/2 pretty & 1/2 ugly)
let createAestheticImages = function(){
    var unshuffledArray = [];
    var prettySample = jsPsych.randomization.sampleWithoutReplacement(prettyImages, numHalfAestheticImages);
    var uglySample = jsPsych.randomization.sampleWithoutReplacement(uglyImages, numHalfAestheticImages);
    unshuffledArray = [...prettySample, ...uglySample];

    return jsPsych.randomization.shuffle(unshuffledArray);
}
// Builds an array of images for debrief based on liked/unliked images from trial 
// returns array with 10 liked, 10 unliked and 20 unseen images
function aestheticDebriefImages(testPart){
    let aestheticData = jsPsych.data.get().filter({test_part: testPart}).values()[0]
    console.log(jsPsych.data.get().filter({test_part: testPart}).values()[0]);
    console.log(aestheticData);
    let liked = aestheticData?.liked_images || [];
    let unliked = aestheticData?.unliked_images || [];
    let debriefImages = [];
    //add images shown during trial

    if(liked.length < 10){
        //push all liked if < 10 liked
        debriefImages.push(...liked);
        //push 10 unliked images + (10- #liked) if less than 10 liked (total 20 from original set)
        let unlikedSample = weightedRandomSelection(unliked, (10+(10-liked.length)));
        debriefImages.push(...unlikedSample);

    }else{
        //push 10 random images from liked images
        if(unliked.length < 10){
          //push all unliked
          debriefImages.push(...unliked);
          //push 10 + (10 - num unliked) liked (20 total from original set)
          debriefImages.push(...weightedRandomSelection(liked, (10+(10-unliked.length))));
          
        }else{
          //push 10 liked
          debriefImages.push(...jsPsych.randomization.sampleWithoutReplacement(liked, 10));
          //push 10 unliked
          debriefImages.push(...weightedRandomSelection(unliked, 10));
        }
    }
    //add images not shown during trial
    let unshownImages = diff(allAestheticImages, liked);
    unshownImages = diff(unshownImages, unliked);
    let unshownSample = jsPsych.randomization.sampleWithoutReplacement(unshownImages, 20);
    debriefImages.push(...unshownSample);

    return shuffleNewObj(debriefImages);
}

//randomly selects count items from array with higher weight given to items earlier in the array
function weightedRandomSelection(arr, count) {
  const arrCopy = [...arr]; // Copy the original array
  const selectedItems = [];

  while (selectedItems.length < count && arrCopy.length > 0) {
    //calculate weights based on index
    const weights = arrCopy.map((_, index) => 1 / (index + 1));
    
    //calculate cumulative weights
    const cumulativeWeights = [];
    let totalWeight = 0;

    for (let weight of weights) {
      totalWeight += weight;
      cumulativeWeights.push(totalWeight);
    }
    //random number to find selected item
    const random = Math.random() * totalWeight;
    let selectedIndex = -1;

    for (let i = 0; i < cumulativeWeights.length; i++) {
      if (random < cumulativeWeights[i]) {
        selectedIndex = i;
        break;
      }
    }

    //add item to results and remove it from the copy array
    if (selectedIndex !== -1) {
      selectedItems.push(arrCopy[selectedIndex]);
      arrCopy.splice(selectedIndex, 1);
    }
  }
  return selectedItems;
}


//builds html for image options in debrief section
function generateImageOptions(testPart) {
    return aestheticDebriefImages(testPart).map((imagePath, index) => {
      return `<div style="text-align: center;">
                <img src="${imagePath}" 
                     alt="Image ${index + 1}" 
                     style="width: 250px; height: 250px; object-fit: cover; margin-bottom: 5px;">
                <br>Option ${index + 1}
              </div>`;
    });
}
//returns all image paths from debrief images html
function extractAllPaths(htmlArray){
    var allPaths = [];
    for(var i = 0; i < htmlArray.length; i++){
      allPaths.push(extractImagePath(htmlArray[i]));
    }
    return allPaths;
  }

let scrollAesthetic = {
type: 'ec-scroll-image-response',
images: createAestheticImages(),
aestheticWidth: aestheticHeight,
aestheticHeight: aestheticWidth,
button_label: 'Like',
trial_duration: threeMinMS,
data: {
    subj_id: subj_name,
    test_part: 'scroll-aesthetic',
    key_condition: 'scroll'
},
on_finish: function(data) {
  console.log("Swipe task data:", data);
  console.log(jsPsych.data.get().filter({test_part: 'scroll-aesthetic'}).values()[0]);
  
  saveData(subj_name, jsPsych.data.get().csv());
}
};
  
let swipeAesthetic = {
type: 'ec-swipe-image-response',
stimulus: createAestheticImages(),
choices:[],
stimulus_height: aestheticHeight,
stimulus_width: aestheticWidth,
trial_duration: threeMinMS, 
data: {
    subj_id: subj_name,
    test_part: 'swipe-aesthetic',
    key_condition: 'swipe'
},
on_finish: function(data) {
    console.log("Swipe task data:", data); // Log to check data
    //THIS IS THE DATA ARRAY
    console.log(jsPsych.data.get().filter({test_part: 'swipe-aesthetic'}).values()[0]);
    
    saveData(subj_name, jsPsych.data.get().csv());
}
}

let aestheticSwipeDebrief = {
    type: 'survey-multi-select',
    questions: [{
        prompt: 'In the initial part, you were shown different images. Now please select all that you remember seeing.',
        options: [],
        horizontal: true,
        required: true,
    }],
    button_label: 'Submit',
    data: {
      subj_id: subj_name,
      test_part: 'aesthetic-debrief',
      key_condition: 'swipe'
    },
    on_start: function(){
      this.questions[0].options = generateImageOptions('swipe-aesthetic');
    },
    on_finish: function(data) {
      console.log("THIS IS THE RESPONSES:" + data.responses);
      const responses = JSON.parse(data.responses);
      console.log(responses.Q0);
      console.log(extractAllPaths(responses.Q0));
      // log the data
      data.remembered_images = extractAllPaths(responses.Q0);
      data.num_images_remembered = responses.Q0.length; 
      data.num_false_alarms = getFalseAlarms('swipe-aesthetic', extractAllPaths(responses.Q0));
      console.log("false alarms: " + data.num_false_alarms);
      saveData(subj_name, jsPsych.data.get().csv());      
      
    }
};

// get number of false alarms in memory task
function getFalseAlarms(testPart, rememberedImages){
  let aestheticData = jsPsych.data.get().filter({test_part: testPart}).values()[0]
  let trialImages = [...aestheticData.liked_images, ...aestheticData.unliked_images];
  let falseAlarmsArray = diff(rememberedImages, trialImages); 
  console.log("false alarm array:" + falseAlarmsArray);
  console.log("length: " + falseAlarmsArray.length);
  return falseAlarmsArray.length; 
}

let aestheticScrollDebrief = {
    type: 'survey-multi-select',
    questions: [{
        prompt: 'In the initial part, you were shown different images. Now please select all that you remember seeing.',
        options: [],
        horizontal: true,
        required: true,
      }],
    button_label: 'Submit',
    data: {
      subj_id: subj_name,
      test_part: 'aesthetic-debrief',
      key_condition: 'scroll'
    },
    on_start: function(){
      this.questions[0].options = generateImageOptions('scroll-aesthetic');
    },
    on_finish: function(data) {
      console.log("THIS IS THE RESPONSES:" + data.responses);
      const responses = JSON.parse(data.responses);
      console.log(responses.Q0);
      console.log(extractAllPaths(responses.Q0));
      // log the data
      data.remembered_images = extractAllPaths(responses.Q0);
      data.num_images_remembered = responses.Q0.length; 
      data.num_false_alarms = getFalseAlarms('scroll-aesthetic', extractAllPaths(responses.Q0));
      saveData(subj_name, jsPsych.data.get().csv());  
    }
  };