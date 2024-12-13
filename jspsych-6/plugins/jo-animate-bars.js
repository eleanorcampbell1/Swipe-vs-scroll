/*
 * Example plugin template
 */

jsPsych.plugins["jo-animate-bars"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "jo-animate-bars",
    parameters: {
      bar_condition: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'stopwatch' // countdown or stopwatch
      },
      disc_condition: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'cont' // continuous or discrete
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // Setup size of canvas
    var canvas_w = screen.width*.8;
    var canvas_h = screen.height*.8;

    // Draw canvas
    document.body.style.cursor = 'auto';
    display_element.innerHTML = "<div>"+"<canvas id='myCanvas' width='"+canvas_w+"' height='"+canvas_h+"'></canvas>"+"</div>";
    var canvas = display_element.querySelector('#myCanvas');
    var context = canvas.getContext('2d');
    var canvasOffset = $("#myCanvas").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;

    // Setup time variables
    var start_time = performance.now();
    var current_time = performance.now();
    var time_elapsed = 0;
    var percent_time = 0;

//////////////// EDITABLE PARAMETERS //////////////// 

    var trial_duration = 6;

    // Setup bar size and position
    var rect_width = canvas_w*.5;
    var rect_height = canvas_h*.07;
    var rect_starting_point_x = canvas_w/2 - rect_width/2;
    var rect_starting_point_y = canvas_h/2 - rect_height/2;
    var bar_position = 'top';

    if (bar_position == 'top'){
      rect_starting_point_y = canvas_h*.02;
    } else {
      rect_starting_point_y = canvas_h*.98;
    }

    // Setup size of ticks
    var tick_width = 22;
    var interval_width = 10;

    // Setup size of discs
    var disc_radius = parseInt(canvas_w*.03);

////////////////////////////////////////////////////////////

    // If discrete, setup the number and size of the 'ticks'
    var total_bin_width = tick_width + interval_width;
    var num_ticks = parseInt(rect_width/total_bin_width)+1;

    // Draw and animate bar
    function draw_bar(percent_time){
      // Fill in the bar
      if (trial.disc_condition=='cont'){
        if (trial.bar_condition=='stopwatch'){
          total_frames_so_far = parseInt(percent_time*rect_width);
        } else if (trial.bar_condition=='countdown'){
          total_frames_so_far = parseInt((1-percent_time)*rect_width);
        }
        context.beginPath();
        context.rect(rect_starting_point_x, rect_starting_point_y, total_frames_so_far, rect_height);
        context.fillStyle = '#39FF14';
        context.fill();
        context.closePath();
      } else if (trial.disc_condition=='disc'){
        if (trial.bar_condition=='stopwatch'){
          total_frames_so_far = parseInt(percent_time*num_ticks);
        } else if (trial.bar_condition=='countdown'){
          total_frames_so_far = parseInt((1-percent_time)*num_ticks);
        }
        curr_x = rect_starting_point_x;
        for (i=0; i<total_frames_so_far; i++){
          context.beginPath();
          context.rect(curr_x, rect_starting_point_y, tick_width, rect_height);
          context.fillStyle = '#39FF14';
          context.fill();
          context.closePath();
          curr_x += total_bin_width;
        }
      }

      // Draw empty bar
      context.beginPath();
      context.rect(rect_starting_point_x, rect_starting_point_y, rect_width, rect_height);
      context.fillStyle = 'rgba(225,225,225,0)';
      context.strokeStyle = 'black';
      context.stroke();
      context.lineWidth = 5;
      context.closePath();

    }

    var curr_digit = 0;
    var error_message = 0;
    var processed_key = 0;

    var discA = {};
    var discB = {};
    var discC = {};
    var discD = {};
    var discE = {};
    var discF = {};
    var discG = {};
    var discH = {};

    var disc_list = [discA, discB, discC, discD, discE, discF, discG, discH];
    var x_lines = [parseInt(canvas_w*.2), parseInt(canvas_w*.4), parseInt(canvas_w*.6), parseInt(canvas_w*.8)];
    var y_lines = [parseInt(canvas_h*.2), parseInt(canvas_h*.4), parseInt(canvas_h*.6), parseInt(canvas_h*.8)];
    var positions = range(1, 9);
    shuffle(positions);

    console.log(x_lines);

    for (i=0; i<disc_list.length; i++){
      disc_list[i].visible = 1;
      disc_list[i].digit = (i+1).toString();
      switch (positions[i]){
        case 1:
          disc_list[i].posX = get_random_value(range(x_lines[0]+disc_radius, x_lines[1]-disc_radius), 1);
          disc_list[i].posY = get_random_value(range(y_lines[0]+disc_radius, y_lines[1]-disc_radius), 1);
          break;
        case 2:
          disc_list[i].posX = get_random_value(range(x_lines[0]+disc_radius, x_lines[1]-disc_radius), 1);
          disc_list[i].posY = get_random_value(range(y_lines[1]+disc_radius, y_lines[2]-disc_radius), 1);
          break;
        case 3:
          disc_list[i].posX = get_random_value(range(x_lines[0]+disc_radius, x_lines[1]-disc_radius), 1);
          disc_list[i].posY = get_random_value(range(y_lines[2]+disc_radius, y_lines[3]-disc_radius), 1);
          break;
        case 4:
          disc_list[i].posX = get_random_value(range(x_lines[1]+disc_radius, x_lines[2]-disc_radius), 1);
          disc_list[i].posY = get_random_value(range(y_lines[0]+disc_radius, y_lines[1]-disc_radius), 1);
          break;
        case 5:
          disc_list[i].posX = get_random_value(range(x_lines[1]+disc_radius, x_lines[2]-disc_radius), 1);
          disc_list[i].posY = get_random_value(range(y_lines[1]+disc_radius, y_lines[2]-disc_radius), 1);
          break;
        case 6:
          disc_list[i].posX = get_random_value(range(x_lines[1]+disc_radius, x_lines[2]-disc_radius), 1);
          disc_list[i].posY = get_random_value(range(y_lines[2]+disc_radius, y_lines[3]-disc_radius), 1);
          break;
        case 7:
          disc_list[i].posX = get_random_value(range(x_lines[2]+disc_radius, x_lines[3]-disc_radius), 1);
          disc_list[i].posY = get_random_value(range(y_lines[0]+disc_radius, y_lines[1]-disc_radius), 1);
          break;
        case 8:
          disc_list[i].posX = get_random_value(range(x_lines[2]+disc_radius, x_lines[3]-disc_radius), 1);
          disc_list[i].posY = get_random_value(range(y_lines[1]+disc_radius, y_lines[2]-disc_radius), 1);
          break;
        case 9:
          disc_list[i].posX = get_random_value(range(x_lines[2]+disc_radius, x_lines[3]), 1);
          disc_list[i].posY = get_random_value(range(y_lines[2]+disc_radius, y_lines[3]), 1);
          break;
      }

    }

    var disc_order = [];
    var disc_timings = [];
    var mouseX_positions = [];
    var mouseY_positions = [];
    var mouse_timings = [];
    var total_clicks = 0;

    function draw_disc(x, y, visible, digit, color){
      if (visible){
        context.beginPath();
        context.lineWidth = 2;
        context.arc(x, y, disc_radius, 0, 2 * Math.PI);
        if (color == 'red'){
          context.fillStyle = color;
          context.fill();
        }
        context.strokeStyle = color;
        context.stroke();
        context.fillStyle = 'black';
        context.font = '14pt Calibri';
        context.textAlign = 'center';
        context.fillText(digit, x, y);
        context.closePath();
      }
    }

    function draw_discs(percent_time, color){
      context.clearRect(0, 0, canvas_w, canvas_h);
      draw_bar(percent_time);
      for (i=0; i<disc_list.length; i++){
        draw_disc(disc_list[i].posX, disc_list[i].posY, disc_list[i].visible, disc_list[i].digit, color)
      }
    }

    function intersects(x, y, cx, cy, r) {
      var dx = x-cx
      var dy = y-cy
      return dx*dx+dy*dy <= r*r
    }

    // Draw all the elements
    draw_bar(0);
    draw_discs();

    function animate_path(){
      current_time = performance.now();
      time_elapsed = parseFloat(current_time - start_time)/1000;
      percent_time = time_elapsed / parseFloat(trial_duration);

      // Refresh screen + redraw the elements
      processed_key = 0;
      context.clearRect(0, 0, canvas_w, canvas_h);
      draw_bar(percent_time);
      if (error_message == 0){
        draw_discs(percent_time, "grey");
      } else {
        draw_discs(percent_time, "red");
        error_message = 0;
      }

      $("#myCanvas").on("mousemove", function (e){
        e.preventDefault();
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);
        mouseX_positions.push(mouseX);
        mouseY_positions.push(mouseY);
        mouse_timings.push(performance.now() - start_time);
      });
      
      $("#myCanvas").on("click", function (e){
        e.preventDefault();
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        total_clicks += 1;

        for (i=0; i<disc_list.length; i++){
          if (intersects(mouseX, mouseY, disc_list[i].posX, disc_list[i].posY, disc_radius)){
            if (processed_key==0){
              if (parseInt(disc_list[i].digit) == curr_digit + 1){
                curr_digit = parseInt(disc_list[i].digit);
                if (disc_list[i].visible == 1){
                  disc_order.push(parseInt(disc_list[i].digit));
                  disc_timings.push(performance.now() - start_time);
                  disc_list[i].visible = 0;
                }
              } else {
                disc_order.push(parseInt(disc_list[i].digit));
                disc_timings.push(performance.now() - start_time);
                error_message = 1;
              }
              processed_key = 1;
            }

          }
        }
      });

      myReq = requestAnimationFrame(function(){animate_path()});

      if (percent_time >= 0.999){
        context.clearRect(0, 0, canvas_w, canvas_h);
        window.cancelAnimationFrame(myReq);
        setTimeout(end_trial, 250);
      };

      if (curr_digit == 8){
        context.clearRect(0, 0, canvas_w, canvas_h);
        window.cancelAnimationFrame(myReq);
        setTimeout(end_trial, 250);
      }
    }

    setTimeout(function(){
      start_time = performance.now();
      animate_path();
    }, 250)

    function end_trial(){

      console.log(mouseX_positions)

      // gather the data to store for the trial
      let trial_data = {
        "bar_condition": trial.bar_condition,
        "disc_condition": trial.disc_condition,
        "duration": trial_duration,
        "num_frames": rect_width,
        "disc_order": disc_order,
        "disc_timings": disc_timings,
        "num_clicks": disc_order.length,
        "total_time": performance.now() - start_time,
        "x_positions": mouseX_positions,
        "y_positions": mouseY_positions,
        "mouse_timings": mouse_timings
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    }

  };

  return plugin;
})();
