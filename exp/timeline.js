let timeline = [];

let instructions1 = {
  type: 'jo-html-keyboard-response',
  wait_duration: 0,
  choices: ['space'],
  stimulus: "<div style='margin: auto 0'><p>In this first section, your task will just be to click on the discs in ascending order, from 1-8, as fast as you can.</b></div>",
  prompt: "Press SPACE to continue.",
  data: {
      subj_id: subj_name,
      test_part: 'instruct_prompt'
  }
};

let start_prompt = function(trial_num){
  var block = {
    type: 'html-button-response',
    stimulus: '',
    choices: ['Begin'],
    data: {
        subj_id: subj_name,
        test_part: 'start_prompt',
        trial_num: trial_num,
    },
    on_finish: function () {
        saveData(subj_name, jsPsych.data.get().csv());
    }
  }
  return block;
};

let interactive_interface = function(block_num, trial_num, bar_condition, disc_condition){
  var block = {
    type: 'jo-animate-bars',
    bar_condition: bar_condition,
    disc_condition: disc_condition,
    data: {
        subj_id: subj_name,
        test_part: 'key_trial',
        block_num: block_num,
        trial_num: trial_num,
    },
    on_finish: function () {
        saveData(subj_name, jsPsych.data.get().csv());
    }
  }
  return block;
};

let instructions2 = {
  type: 'jo-html-keyboard-response',
  wait_duration: 0,
  choices: ['space'],
  stimulus: "<div style='margin: auto 0'><p>In this second section, your task will be to press a key corresponding to the color indicated by the word -- regardless of the actual color of the text.<p>Press 1 - red<br>Press 2 - blue<br>Press 3 - green</div>",
  prompt: "Press SPACE to continue.",
  data: {
      subj_id: subj_name,
      test_part: 'instruct_prompt'
  }
};

let scroll_decision_instructions = {
  type: 'jo-html-keyboard-response',
  wait_duration: 0,
  choices: ['space'],
  stimulus: `
    <div style='margin: auto 0; text-align: center;'>
      <p>For this study, we’d like you to imagine that you are a new graduate looking for a fridge for your new apartment.</p>
      <p>You have a budget of $2400-$3000, but are hoping not to spend more than $2700.</p>
      <p>Your goal is to find a fridge with as many technological perks at as low of a cost as possible.</p>
      <br>
      <p>In the first part of this study, you will be shown four different fridges at different price points. For each fridge, you will see a list of its different features.</p>
      <p>In the next 3 minutes, just go through the different fridges, as if you were browsing online, and try to see which fridge would be the best for you.</p>
      <p>To navigate between images, scroll up for the next image and down for the previous one.</p>
      <p>We will later ask you to make a selection, and we will then ask a few questions about your decision.</p>
    </div>
  `,
  prompt: "<p style='color: black;'>Press SPACE to continue.</p>",
  data: {
    subj_id: subj_name,
    test_part: 'fridge_instructions'
  }
};

let swipe_decision_instructions = {
  type: 'jo-html-keyboard-response',
  wait_duration: 0,
  choices: ['space'],
  stimulus: `
    <div style='margin: auto 0; text-align: center;'>
      <p>For this study, we’d like you to imagine that you are a new graduate looking for a fridge for your new apartment.</p>
      <p>You have a budget of $2400-$3000, but are hoping not to spend more than $2700.</p>
      <p>Your goal is to find a fridge with as many technological perks at as low of a cost as possible.</p>
      <br>
      <p>In the first part of this study, you will be shown four different fridges at different price points. For each fridge, you will see a list of its different features.</p>
      <p>In the next 3 minutes, just go through the different fridges, as if you were browsing online, and try to see which fridge would be the best for you.</p>
      <p>To navigate between images, swipe up for the next image and down for the previous one.</p>
      <p>We will later ask you to make a selection, and we will then ask a few questions about your decision.</p>
    </div>
  `,
  prompt: "<p style='color: black;'>Press SPACE to continue.</p>",
  data: {
    subj_id: subj_name,
    test_part: 'fridge_instructions'
  }
};


// let allFeatures = shuffleNewObj([...positiveFeatures, ...negativeFeatures]);
// selects random features for a fridge
function getRandomFeatures(featuresArray, count){
  let shuffled = featuresArray.sort(() => 0.5 - Math.random()); // Shuffle the array
  return shuffled.slice(0, count);
}

//returns array of elements present in A and not in B, used for computing unliked images in aesthetic task
function diff(A, B) {
  let arr = A.filter(function (a) {
    // console.log(B.indexOf(a) == -1);
    const isNotInB = B.indexOf(a) == -1;
    // console.log(`Comparing: "${a}" against B array - Found in B: ${!isNotInB}`);
    // console.log(isNotInB);
    return isNotInB;
    // return B.indexOf(a) == -1;
  });
  // console.log("diff: " + arr);
  return arr;
}

