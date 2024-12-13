jsPsych.plugins["ec-image-button-response"] = (function() {

  let plugin = {};

  jsPsych.pluginAPI.registerPreload('ec-image-button-response', 'stimulus', 'image');

  plugin.info = {
      name: 'ec-image-button-response',
      description: '',
      parameters: {
          stimulus: {
              type: jsPsych.plugins.parameterType.IMAGE,
              pretty_name: 'Stimulus',
              default: undefined,
              description: 'The image to be displayed'
          },
          stimulus_height: {
              type: jsPsych.plugins.parameterType.INT,
              pretty_name: 'Image height',
              default: null,
              description: 'Set the image height in pixels'
          },
          stimulus_width: {
              type: jsPsych.plugins.parameterType.INT,
              pretty_name: 'Image width',
              default: null,
              description: 'Set the image width in pixels'
          },
          maintain_aspect_ratio: {
              type: jsPsych.plugins.parameterType.BOOL,
              pretty_name: 'Maintain aspect ratio',
              default: true,
              description: 'Maintain the aspect ratio after setting width or height'
          },
          choices: {
              type: jsPsych.plugins.parameterType.STRING,
              pretty_name: 'Button labels',
              default: undefined,
              array: true,
              description: 'The labels for the buttons.'
          },
          prompt: {
              type: jsPsych.plugins.parameterType.STRING,
              pretty_name: 'Prompt',
              default: null,
              description: 'Any content here will be displayed below the stimulus.'
          },
          stimulus_duration: {
              type: jsPsych.plugins.parameterType.INT,
              pretty_name: 'Stimulus duration',
              default: null,
              description: 'How long to hide the stimulus.'
          },
          trial_duration: {
              type: jsPsych.plugins.parameterType.INT,
              pretty_name: 'Trial duration',
              default: null,
              description: 'How long to show the trial before it ends.'
          },
          response_ends_trial: {
              type: jsPsych.plugins.parameterType.BOOL,
              pretty_name: 'Response ends trial',
              default: true,
              description: 'If true, trial will end when the subject makes a response.'
          },
      }
  }

  plugin.trial = function(display_element, trial) {

      // display stimulus
      let html = '<img src="' + trial.stimulus + '" id="jspsych-image-button-response-stimulus" style="';
      if (trial.stimulus_height !== null) {
          html += 'height:' + trial.stimulus_height + 'px; ';
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
              html += 'width: auto; ';
          }
      }
      if (trial.stimulus_width !== null) {
          html += 'width:' + trial.stimulus_width + 'px; ';
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
              html += 'height: auto; ';
          }
      }
      html += '"></img>';

      // add buttons
      let buttons = [];
      for (let i = 0; i < trial.choices.length; i++) {
          buttons.push('<button class="jspsych-btn" data-choice="' + i + '">' + trial.choices[i] + '</button>');
      }
      html += '<div id="jspsych-image-button-response-btngroup">' + buttons.join('') + '</div>';

      // add prompt
      if (trial.prompt !== null) {
          html += trial.prompt;
      }

      // render
      display_element.innerHTML = html;

      // store response
      let response = {
          rt: null,
          button: null
      };

      // function to handle button click
      let after_response = function(choice) {

          // measure response time
          let end_time = performance.now();
          let rt = end_time - start_time;
          response.button = choice;
          response.rt = rt;

          // disable all buttons after a response
          let btns = document.querySelectorAll('.jspsych-btn');
          for (let i = 0; i < btns.length; i++) {
              btns[i].setAttribute('disabled', 'disabled');
          }

          if (trial.response_ends_trial) {
              end_trial();
          }
      };

      // start timing
      let start_time = performance.now();

      // add event listeners to buttons
      for (let i = 0; i < trial.choices.length; i++) {
          display_element.querySelector('.jspsych-btn[data-choice="' + i + '"]').addEventListener('click', function(e) {
              let choice = e.currentTarget.getAttribute('data-choice');
              after_response(choice);
          });
      }

      // function to end trial
      let end_trial = function() {

          // kill any remaining setTimeout handlers
          jsPsych.pluginAPI.clearAllTimeouts();

          // gather the data to store for the trial
          let trial_data = {
              "rt": response.rt,
              "stimulus": trial.stimulus,
              "button_pressed": response.button
          };

          // clear the display
          display_element.innerHTML = '';

          // move on to the next trial
          jsPsych.finishTrial(trial_data);
      };

      // hide stimulus if stimulus_duration is set
      if (trial.stimulus_duration !== null) {
          jsPsych.pluginAPI.setTimeout(function() {
              display_element.querySelector('#jspsych-image-button-response-stimulus').style.visibility = 'hidden';
          }, trial.stimulus_duration);
      }

      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
          jsPsych.pluginAPI.setTimeout(function() {
              end_trial();
          }, trial.trial_duration);
      }

  };

  return plugin;
})();
