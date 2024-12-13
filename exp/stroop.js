// STROOP TASK VARIABLES & FUNCTIONS

var num_trials = 40;
var color_list = ['red', 'blue', 'green', 'yellow'];

let stroop_instructions = {
  type: 'jo-html-keyboard-response',
  wait_duration: 0,
  choices: ['space'],
  stimulus: `<div style='margin: auto 0'><p>In this task, you will see color names (red, green, blue, yellow) in different &quot;print&quot; color. For example, if you see:</p><p style="color: red;">GREEN</p><p>You need to respond to the print color (red), and press the associated button ("r"). The other buttons used in this study are &quot;g&quot;, &quot;b&quot;, and &quot;y&quot;, for green, blue and yellow.</p><p>Please place your fingers on the relevant keys to prepare.</p></div>`,
  prompt: "<p style='color: white;'>Press SPACE to continue.</p>",
  data: {
      subj_id: subj_name,
      test_part: 'instruct_prompt'
  }
  , 
  on_start: function() {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    }
};
//fixation screen
let fixation_blk = {
  type: 'ec-html-keyboard-response',
  stimulus: `<p style="font-size: 60px; color: white;">+</p>`,
  trial_duration: 500,
  response_ends_trial: false,
  on_start: function() {
    //changes background to black on start
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    }
};
//blank screen between
let iti = {
  type: 'ec-html-keyboard-response',
  stimulus: '',
  trial_duration: 250,
  response_ends_trial: false,
  on_start: function(){
    document.body.style.backgroundColor = 'black';
  }
}

//return congruent condition object
let congruent = function() {
  //pick 1 color at random from color_list
  var color_pair = jsPsych.randomization.sampleWithReplacement(color_list,1);
  return {text: color_pair[0], color: color_pair[0], condition: 'congruent'};
}
//return incongruent condition object
let incongruent = function() {
  //pick 2 colors at random from color_list
  var color_pair = jsPsych.randomization.sampleWithReplacement(color_list,2);
  return {text: color_pair[0], color: color_pair[1], condition: 'incongruent'};
}

let correctResponses = 0;

//creates and pushes trials for stroop task
function pushStroopTask(){
  for(var i = 0; i < num_trials; i++){
      var values;
      if (Math.random() < 0.5) {
        values = congruent();
      } else {
        values = incongruent();
      }
      var trial = {
        type: 'ec-html-keyboard-response',
        stimulus: values.text,
        choices: ['r','g','b','y'],
        response_ends_trial: true,
        font_color: values.color,
        data: {
          subj_id: subj_name,
          test_part: 'stroop',
          key_condition: swipe ? "swipe" : "scroll"
        },
        on_start: function() {
          //change background to balck
          document.body.style.backgroundColor = 'black';
          document.body.style.color = 'white'; // Set text color for visibility
          },
        on_finish: function(data) {
          console.log("first letter of key press: "+ data.key_press);
          console.log("first letter of font color:" + data.font_color.slice(0,1));
          if(checkResponse(data.key_press, data.font_color.slice(0,1))){
            console.log("first letter of font" + data.font_color.slice(0,1));
            correctResponses++;
          }
          document.body.style.backgroundColor = 'white';
          document.body.style.color = 'black';
          saveData(subj_name, jsPsych.data.get().csv());
        }
        };
      timeline.push(iti);
      timeline.push(fixation_blk);
      timeline.push(trial);
    }
  
  }
  var saveDataTrial = {
    type: 'ec-html-keyboard-response',
    stimulus: '',
    trial_duration: 0,
    data: {
      subj_id: subj_name,
      test_part: 'stroop-correct-resp'
    },
    response_ends_trial: false,
    on_start: function() {
      console.log("Total Correct Responses Saved:", correctResponses);
    },
    on_finish: function(data){
      data.correct_responses = correctResponses;
      saveData(subj_name, jsPsych.data.get().csv());
      console.log(data);
    }
      
  };

function checkResponse(response, printColor){
  if (response.toLowerCase() === printColor.toLowerCase()){
    return true;
  }else{
    return false;
  }
}
