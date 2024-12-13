jsPsych.plugins["ec-decision-scroll-image-response"] = (function () {
    var plugin = {};
    
    plugin.info = {
        name: "ec-decision-scroll-image-response",
        description: "",
        parameters: {
            images: {
                type: jsPsych.plugins.parameterType.STRING,
                array: true,
                pretty_name: "Images",
                default: undefined,
                description: "Array of image paths to display."
            },
            imageWidth: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: "Image Width",
                default: 100,
                description: "Width of the images in pixels."
            },
            imageHeight: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: "Image Height",
                default: 100,
                description: "Height of the images in pixels."
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
    
    plugin.trial = function (display_element, trial) {
        let n = numDecisions;
        // build html for task
        let html = '<div style="height: 800px; overflow-y: scroll; display: flex; flex-direction: column;">';
        for(var i = 0; i < n; i++){
            console.log(trial.features);
            
            html += `
            <div style="margin-bottom: 30px; margin-top: 30px; display: flex; flex-direction: column; align-items: center;">
            <img src="${trial.images[i]}" style="width: ${trial.imageWidth}px; height: ${trial.imageHeight}px; object-fit: contain; margin-right: 10px;" />
            <p style="font-size: 24px;"><b>Fridge ${i + 1}</b> - ${trial.features[i][0]}</p>
            ${featuresHtml(trial.features[i])}
            </div>`
        }
        html += '</div>';
        
        display_element.innerHTML = html;
        
        function featuresHtml(arr){
            html = 
            `<div style="text-align: center; width: 1000px;">
            <ul style="list-style-type: none; font-size: 18px; padding: 0; margin: auto; inline-block; text-align: left; margin-left: 380px">`;
            
            for (j = 1; j < arr.length; j++){
                html += `<li>- ${arr[j]}</li>\n`
            }
            html+= `</ul></div>`;
            return html;
        }
        
        
        var end_trial = function () {
            jsPsych.pluginAPI.clearAllTimeouts();
            
            //collect fridge image paths and feature arrays
            let bestIdx = 0;
            for(let i = 0; i < n; i++){
                if(trial.features[i][0] == "$2500"){
                    bestIdx = i;
                    console.log("Best fridge = " + (bestIdx + 1))
                }
            }
            let trial_data = {
                "fridges": trial.images,
                "features_price": trial.features,
                "best_decision": "Fridge " + (bestIdx + 1)
            };
            
            display_element.innerHTML = '';
            
            //move on to next trial
            console.log("data from plugin:", trial_data);
            jsPsych.finishTrial(trial_data);
        };
        
        //end trial if time limit is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
        }
    };
    
    return plugin;
})();
