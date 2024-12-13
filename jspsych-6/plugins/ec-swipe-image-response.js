jsPsych.plugins['ec-swipe-image-response'] = (function() {

  let plugin = {};

  plugin.info = {
    name: 'ec-swipe-image-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'Array of image paths to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: 'Choices',
        default: undefined,
        description: 'Labels for the buttons below each image'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: 500,
        description: 'Set the image height in pixels.'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: 1000,
        description: 'Set the image width in pixels.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content to be displayed below the image.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: false,
        description: 'If true, trial will end when user makes a button response.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      features: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: "Features",
        default: undefined,
        description: "Array of arrays of price and features for each fridge."
      }
    }
  };

  plugin.trial = function(display_element, trial) {
  
    let currentIndex = 0;
    let decisionCurrentIndex = 0;
    let numDecisions = 4;
    let aestheticImagesLiked = [];
      
    //function to render images at each swipe
    function renderImage() {
      if(aesthetic){
        let html = `
        <div class="image-container" style="display: flex; flex-direction: row; align-items: center; justify-content: center; height: 100vh; width: 100vh">
        <img src="${trial.stimulus[currentIndex]}" style="width: ${trial.stimulus_width}px; height: ${trial.stimulus_height}px; object-fit: cover;" /> 
          <div style="margin-left: 20px;">
            <button class="jspsych-btn" data-choice="like"
            style="background-color:${aestheticImagesLiked.includes(trial.stimulus[currentIndex]) ? 'lightgreen' : 'initial'};">Like</button>
          </div>
        </div>`;
        display_element.innerHTML = html;
    
        let buttons = display_element.querySelectorAll('.jspsych-btn');
        //add event listener for each button
        buttons.forEach(button => {
          button.addEventListener('click', function(e) {
            let choice = e.target.getAttribute('data-choice');
            // record image liked
            if(choice === 'like'){
              if(!aestheticImagesLiked.includes(trial.stimulus[currentIndex])){
                aestheticImagesLiked.push(trial.stimulus[currentIndex]);
                this.style.backgroundColor = "lightgreen";
              }else{
                aestheticImagesLiked = aestheticImagesLiked.filter(function(e) {return e !== trial.stimulus[currentIndex]});
                this.style.backgroundColor = "initial";
              } 
            }
            console.log(`Image ${currentIndex + 1}: ${choice}`);
            
            if (trial.response_ends_trial) {
              end_trial();
            }
          });
        });

      }else{
        //build image to display
        let html = `
        <div class="image-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vh">
        <img src="${trial.stimulus[currentIndex]}" style="width: ${trial.stimulus_width}px; height: ${trial.stimulus_height}px; object-fit: contain;" /> 
        <div style="text-align: center; width: 1000px;">
        <p style="font-size: 24px;"><b>Fridge ${currentIndex + 1}</b> - ${trial.features[decisionCurrentIndex][0]}</p>
        ${featuresHtml(trial.features[decisionCurrentIndex])}
        </div>
      </div>`;
      display_element.innerHTML = html;
      }
    }

    function featuresHtml(arr){
      html = 
      `
      <ul style="list-style-type: none; font-size: 18px; padding: 0; margin: auto; inline-block; text-align: left; margin-left: 380px">`;
      
      for (j = 1; j < arr.length; j++){
          html += `<li>- ${arr[j]}</li>\n`
      }
      html+= `</ul>`;
      return html;
    }

    var end_trial = function() {
      jsPsych.pluginAPI.clearAllTimeouts();

      // clear wheel eventListener
      display_element.removeEventListener('wheel', wheelFunc);

      // collect liked/unliked images for aesthetic task
      let trial_data = {};
      if(aesthetic){
        let unliked = diff(trial.stimulus, aestheticImagesLiked);
        trial_data = {
          "liked_images": aestheticImagesLiked,
          "num_liked": aestheticImagesLiked.length,
          "unliked_images": unliked,
          "num_unliked": unliked.length
        }
      // collect fridge images and array of features (correspond by indexes)
      }else if(!aesthetic){
        let bestIdx = 0;
        for(let i = 0; i < numDecisions; i++){
          if (trial.features[i][0] == "$2500"){
            bestIdx = i;
            console.log("best fridge: " + trial.stimulus[i])
          }
        }
        trial_data = {
          "fridges": trial.stimulus,
          "features_price": trial.features,
          "best_decision": "Fridge " + (bestIdx + 1)
        }
      }
      
      display_element.innerHTML = '';

      //move on to the next trial
      console.log("data from plugin:", trial_data);
      jsPsych.finishTrial(trial_data);
    };

      //end trial if time limit is set
      if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    };

    //initial render
    renderImage();
    
    display_element.addEventListener('wheel', wheelFunc);
    
    let canSwipe = true;
    function wheelFunc(e){
      console.log(e.deltaY);
      console.log('Can swipe:' + canSwipe);
      console.log(`Current Index: ${currentIndex}, Decision Index: ${decisionCurrentIndex}`);
      if (canSwipe){
        //swipe up
        if(!aesthetic){
          if(e.deltaY > 20 && (decisionCurrentIndex < numDecisions - 1)){
            canSwipe = false;
            currentIndex++;
            decisionCurrentIndex++;
            renderImage();
            setTimeout(() => {
              canSwipe = true;
            }, 700)
          }
          if(e.deltaY < -20 && currentIndex > 0 && decisionCurrentIndex > 0){
            canSwipe = false;
            currentIndex--;
            decisionCurrentIndex--;
            renderImage();
            setTimeout(() => {
              canSwipe = true;
            }, 700)
          }
        }else if(aesthetic){
          if(e.deltaY > 20 && currentIndex < trial.stimulus.length - 1){
            canSwipe = false;
            currentIndex++;
            decisionCurrentIndex++;
            renderImage();
            setTimeout(() => {
              canSwipe = true;
            }, 700)
          }
          if(e.deltaY < -20 && currentIndex > 0){
            canSwipe = false;
            currentIndex--;
            decisionCurrentIndex--;
            renderImage();
            setTimeout(() => {
              canSwipe = true;
            }, 700)
          }
        }
      }
    }
  };
  

  return plugin;
})();
