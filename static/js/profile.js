
let hours = document.getElementById('hours');
let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');
let ampm = document.getElementById('ampm');


function updateClock(hours, minutes, seconds, ampm){
    let clock = new Date();
    var time_now = clock.toLocaleTimeString(); //get the time as a string
    var time_parts = time_now.split(':'); //seperate the parts out
    var ampm_split = time_parts[2].split(' '); //seperate seconds form ampm
    //assing the elements to the correct values
    hours.innerHTML = time_parts[0];
    minutes.innerHTML = time_parts[1];
    seconds.innerHTML = ampm_split[0];
    ampm.innerHTML = ampm_split[1];;
}
var intID = setInterval(function(){updateClock(hours, minutes, seconds, ampm)},1000);