jsPsych.plugins["ec-scroll-image-response"] = (function() {
  var plugin = {};

  plugin.info = {
    name: "ec-scroll-image-response",
    description: "",
    parameters: {
      images: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: "Images",
        default: undefined,
        description: "Array of image paths to display."
      },
      aestheticWidth: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image Width",
        default: 100,
        description: "Width of the images in pixels."
      },
      aestheticHeight: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image Height",
        default: 100,
        description: "Height of the images in pixels."
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button Label",
        default: "Like",
        description: "Label for the button."
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    //array to keep track of liked images
    let likedImages = [];

    //create html for images + buttons
    let html = '<div>';
    for (let i = 0; i < trial.images.length; i++) {
      html += `
        <div style="margin-bottom: 30px; margin-top: 30px; display: flex; flex-direction: row; align-items: center;">
          <img src="${trial.images[i]}" style="width: ${trial.aestheticWidth}px; height: ${trial.aestheticHeight}px; object-fit: cover; margin-right: 10px;" />
          <button class="jspsych-btn" data-image="${trial.images[i]}">${trial.button_label}</button>
        </div>`;
    }
    html += '</div>';


    display_element.innerHTML = html;

    //add event listeners to buttons
    const buttons = display_element.querySelectorAll('.jspsych-btn[data-image]');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const selectedImage = this.getAttribute('data-image');

        //add the image to the liked images array if not added yet
        if (!likedImages.includes(selectedImage)) {
          likedImages.push(selectedImage);
          this.style.backgroundColor = "lightgreen";

        //unlike image
        }else{
          likedImages = likedImages.filter(function(e) {return e !== selectedImage});
          this.style.backgroundColor = "initial";
        }
      });
    });


    var end_trial = function() {
      jsPsych.pluginAPI.clearAllTimeouts();

      //collect liked/unliked images for aesthetic task
      let unliked = diff(trial.images, likedImages);
      let trial_data = {
        liked_images: likedImages,
        num_liked: likedImages.length,
        unliked_images: unliked,
        num_unliked: unliked.length
      };

      display_element.innerHTML = '';

      //move on to the next trial
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
