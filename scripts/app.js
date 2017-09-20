const breakfastApp = {};

breakfastApp.locations = {
	"89": [43.64701, -79.39425],
	"3477": [43.244077, -79.856873],
	"3454": [42.986316, -81.238403],
	"294": [45.519579, -73.547974]
}

//pass location parameter thru the function in order to call them below
breakfastApp.renderMap = function(lat, long) {
	lat = Number(lat);
	long = Number(long);
	console.log(lat, long)

	breakfastApp.map = L.map('map',{
		center: [lat, long],
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

breakfastApp.setMap = (latLng) => {
	breakfastApp.map.setView(latLng)
}

breakfastApp.key = '283b1493b5a6430dab4f1d299afbc6ff';

//write a function for the map that grabs the restaurants and can be passed thru the init function
breakfastApp.getFood = function(id) {
	//make an ajax request
	$.ajax({
		url: `https://developers.zomato.com/api/v2.1/search?entity_id=${id}&entity_type=city&cuisines=182`,
		method: 'GET',
		dataType: 'json',
		data: {
			apikey: breakfastApp.key,
			format: 'json',
		}
		//get API response
	}).then(function(res){
		console.log("get food", res)
		const breakfastData = res.restaurants;
		console.log(res.restaurants);

		breakfastApp.displayBreakfast(breakfastData);
	});
}

//write a function to display restaurants
//breakfastData is data 'runner'
breakfastApp.displayBreakfast = function(breakfastData) {
	console.log(breakfastData)

	breakfastData.forEach((restaurant) => {
		// console.log(item.restaurant);
		const icon = L.icon({
			iconUrl: 'assets/kitchen-pack.png',

			iconSize: [45, 45], // size of the icon
			//link data to the marker	
		});

		console.log(icon);
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

	})
		
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
	// breakfastApp.renderMap();
	breakfastApp.breakfastSmoothScroll();
	breakfastApp.selectBreak();
	breakfastApp.renderMap(43.64701, -79.39425);
	breakfastApp.getFood(89)
}

breakfastApp.selectBreak = function() {
	$('select').on('change', function(){
		// console.log(typeof $(this).val());
		const idNumber = parseInt($(this).val());
		breakfastApp.getFood(idNumber)
		breakfastApp.setMap(breakfastApp.locations[idNumber]);

	});	 
}
//have document ready run init
$(function(){
	breakfastApp.init();
});