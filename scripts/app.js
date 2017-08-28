const breakfastApp = {};

//pass location parameter thru the function in order to call them below
breakfastApp.renderMap = function(lat, long) {
	breakfastApp.map = L.map('map',{
		center: [43.64701, -79.39425],
		zoom: 13,
		scrollWheelZoom:false
	});
	//include tile layer, zoom property and copyright
	let OpenMapSurfer_Grayscale = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
		maxZoom: 19,
		attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		//connect it to the app
		}).addTo(breakfastApp.map);
}

breakfastApp.key = '283b1493b5a6430dab4f1d299afbc6ff';

//write a function for the map that grabs the restaurants and can be passed thru the init function
breakfastApp.getFood = function() {
	//make an ajax request
	$.ajax({
		url: `https://developers.zomato.com/api/v2.1/search?entity_id=89&entity_type=city&cuisines=182`,
		method: 'GET',
		dataType: 'json',
		data: {
			apikey: breakfastApp.key,
			format: 'json',
		}
		//get API response
	}).then(function(res){
		const breakfastData = res.restaurants;
		console.log(res.restaurants);

		breakfastApp.displayBreakfast(breakfastData);
		breakfastApp.renderMap(breakfastData.lat, breakfastData.long)
	});
}

//write a function to display restaurants
//breakfastData is data 'runner'
breakfastApp.displayBreakfast = function(breakfastData) {
	
	//loop over the array
	breakfastData.forEach(function(restaurant){

		const icon = L.icon({
			iconUrl: 'assets/kitchen-pack.png',

			iconSize:     [45, 45], // size of the icon
			//link data to the marker	
		});

		//create data to be displayed dynamically
		const popupContent = `
			<h2 class="restaurant-name">${restaurant.restaurant.name}</h2>
			<p class="restaurant-cuisine">${restaurant.restaurant.cuisines}</p>
			<p class="restaurant-location">${restaurant.restaurant.location.address}</p>
			<p class="restaurant-rating">${restaurant.restaurant.user_rating.aggregate_rating}</p>
			<img src=${restaurant.restaurant.featured_image}>
		`
		//create a functioning location with lat & long, and icon
		let marker = L.marker(
			[restaurant.restaurant.location.latitude, restaurant.restaurant.location.longitude], {icon: icon}

			).addTo(breakfastApp.map);

		marker.bindPopup(popupContent)
	});
}

breakfastApp.breakfastSmoothScroll = function() {
	// create a function for smoothScroll once the frying pan has been clicked on
	let mapOffset = $('#to-map').height();
	$('a[href="#to-map"]').smoothScroll({
		offset: mapOffset,
		speed: 1000
	});
}

//initailize the code
breakfastApp.init = function() {
	breakfastApp.getFood();
	breakfastApp.renderMap();
	breakfastApp.breakfastSmoothScroll();
}

//have document ready run init
$(function(){
	breakfastApp.init();
});