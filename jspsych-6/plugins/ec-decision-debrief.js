jsPsych.plugins["ec-decision-debrief"] = (function() {
    var plugin = {};
  
    plugin.info = {
      name: "ec-decision-debrief",
      parameters: {
        fridgeImages: {
          type: jsPsych.plugins.parameterType.STRING,
          array: true,
          pretty_name: "Fridge Images",
          default: undefined,
          description: "Array of fridge image paths."
        },
        allFeatures: {
          type: jsPsych.plugins.parameterType.STRING,
          array: true,
          pretty_name: "Fridge Features",
          default: undefined,
          description: "Array of fridge features."
        },
        trial_fridge_images:{
            type: jsPsych.plugins.parameterType.STRING,
            array: true,
            pretty_name: "Fridge images from trial",
                default: undefined,
                description: "Array of image paths displayed in the previous trial."
        },
        trial_features:{
          type: jsPsych.plugins.parameterType.STRING,
          array: true,
          pretty_name: "Features from trial",
              default: undefined,
              description: "Array of features displayed in the previous trial."
      }
      }
    };
  
    plugin.trial = function(display_element, trial) {
      //build html for survey
      let html = `
        <div style="margin-top: 70px"> Which fridge would you be most likely to purchase?</div>
        <div style="display: flex; flex-direction: column; margin-bottom: 20px; font-weight: normal;">
        ${trial.trial_fridge_images.map((imagePath, index) => `
            <label style="margin-bottom: 5px; font-weight: normal;">
              <input type="radio" name="most_likely_purchase" value="${imagePath}"> Fridge ${index + 1}
            </label>
          `).join('')}
        </div>
        <p>Which fridges were you shown? (select all that you can remember)</p>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px;">
          ${trial.fridgeImages.map((imagePath, index) => `
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
          ${Array.from({ length: trial.allFeatures.length }, (_, index) => `
            <label style="margin-bottom: 5px; font-weight: normal; text-align: left; margin-left: 330px">
              <input type="checkbox" name="feature" value="${trial.allFeatures[index]}"> ${trial.allFeatures[index]}
            </label>
          `).join('')}
        </div>
        <button id="submit-button" class="jspsych-btn">Submit</button>
      `;
  
      display_element.innerHTML = html;
  
      document.getElementById('submit-button').addEventListener('click', function() {
        //collect data
        const mostLikelyPurchase = document.querySelector('input[name="most_likely_purchase"]:checked');
        const fridgeSelections = Array.from(document.querySelectorAll('input[name="fridges"]:checked')).map(input => input.value);
        const featureSelections = Array.from(document.querySelectorAll('input[name="feature"]:checked')).map(input => input.value);
        
        //check for blanks
        let errors = [];
        if (!mostLikelyPurchase) {
          errors.push("Please select the fridge you are most likely to purchase.");
        }
        if (fridgeSelections.length === 0) {
          errors.push("Please select at least one fridge you remember seeing.");
        }
        if (featureSelections.length === 0) {
          errors.push("Please select at least one feature you remember.");
        }
  
        if (errors.length > 0) {
          alert(errors.join("\n"));
          return;
        }
        //store data
        let fridgeFAArray = diff(fridgeSelections, trial.trial_fridge_images);
        let featuresFAArray = [];
        let singleDFeatureArray = [];

        if(swipe){
          for(let i = 0; i < 4; i++){
            singleDFeatureArray.push(...trial.trial_features[i]);
          }
          featuresFAArray.push(...diff(featureSelections, singleDFeatureArray));
        }else{
          featuresFAArray.push(...diff(featureSelections, trial.trial_features.flat()));
        }
        
          let mostLikelyIdx = 0;
        for(let i = 0; i < trial.trial_fridge_images.length; i++){
          console.log(trial.trial_fridge_images[i]);
          if(trial.trial_fridge_images[i] === mostLikelyPurchase.value){
            mostLikelyIdx = i + 1;
          }
        }
        const trial_data = {
          most_likely_purchase: "Fridge " + mostLikelyIdx,
          remembered_fridges: fridgeSelections,
          remembered_features: featureSelections,
          num_fridges_remembered: fridgeSelections.length,
          num_features_remembered: featureSelections.length,
          fridges_false_alarms: fridgeFAArray.length,
          features_false_alarms: featuresFAArray.length
        };
        
        //clear display
        display_element.innerHTML = '';
  
        //move on to next trial
        console.log(trial_data);
        jsPsych.finishTrial(trial_data);
      });
    };
  
    return plugin;
  })();
  