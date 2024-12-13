let swipe = false;
let aesthetic = false;
let expt_name = "scd";
let threeMinMS = 180000;

let subj_id = prompt("Please enter your participant ID:", "");
let subj_name = expt_name + "_" + subj_id.toString();
let consent_duration = 10;
let consent_pay = "$" + (consent_duration * .12).toFixed(2).toString();
let completion_code = 'C9NELSVN';

let shortVersion = false;
let show_boilerplate = true;
let forceFullscreen = false;
let limitToDesktop = true;
let limitToGoogle = false;

var std_images = [];

for(i=1; i<=8; i++){
    std_images.push('images/fridge' + i + '.jpg');
}

var images = [];
function preload(){
    for (let i = 0; i < std_images.length; i++){
        images[i] = new Image();
        images[i].src = std_images[i];
    }
}
