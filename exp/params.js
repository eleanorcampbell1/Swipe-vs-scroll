let swipe = true;
let aesthetic = false;
let expt_name = "swipe-aesthetic";

let subj_id = prompt("Please enter your participant ID:", "");
let subj_name = expt_name + "_" + subj_id.toString();
let consent_duration = 10;
let consent_pay = "$" + (consent_duration * .12).toFixed(2).toString();
let completion_code = '87FFAA9F';

let shortVersion = false;
let show_boilerplate = false;
let forceFullscreen = false;
let limitToDesktop = true;
let limitToGoogle = false;