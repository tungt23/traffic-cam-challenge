// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
	var mapElem = document.getElementById('map');
	var center = {
		lat: 47.6,
		lng: -122.3
	}
	var map = new google.maps.Map(mapElem, {
		center: center,
		zoom: 12
	});

	var infoWindow = new google.maps.InfoWindow();


	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			var markers = [];
			data.forEach(function(camera) {
				var marker = new google.maps.Marker({
					position: {
						lat: Number(camera.location.latitude),
						lng: Number(camera.location.longitude)
					},
					map: map
				});
				markers.push(marker);
				google.maps.event.addListener(marker, 'click', function() {
					map.panTo(this.getPosition());
					var html = '<p>' + camera.cameralabel + '</p>';
					html += '<img src="' + camera.imageurl.url+ '"></img>'
					infoWindow.setContent(html);
					infoWindow.open(map, this);
				});
				$('#search').bind("search keyup", function() {
					var searchString = $('#search').val();
					if (camera.cameralabel.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
						marker.setMap(map);
					} else {
						marker.setMap(null);
					}
				});
			}); 
		})
		.fail(function(fail) {
			$('#alertModal').modal();
		})
		.always(function() {
			$('#ajax-loader').fadeOut();
		});
});	