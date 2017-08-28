
//create a clock with built in js functions
function clock() {
	let time = new Date(),
		hours = time.getHours(),
		minutes = time.getMinutes();
		seconds = time.getSeconds();

		//make sure 2 digits will show on the clock even when the number is less than 10
		if(minutes < 10) {
			minutes = "0" + minutes
		}

		if(seconds < 10) {
			seconds = "0" + seconds
		}
	//create a template literal	
	$('#clock').html(`${hours}:${minutes}:${seconds}`);	
}

//setInterval() for displaying seconds
setInterval(clock,1000);

//change backgroung of the body to an evening shade once the time equals 5 or over
function isItFive() {
	const time = new Date();
	const hours = time.getHours();
	if(hours >= 17) {
		//do something
		$('body').removeClass('before-five').addClass('at-five');
	}
}

//call the function isItFive()
isItFive();