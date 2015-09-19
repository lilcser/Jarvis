var express = require('express');
var request = require('request');
var router = express.Router();

/**
 * API to return a list of filtered paints
 * Must pass a config in JSON
 * config{
 * 		color_preference: @string
 * 		room_colors: @string
 * 		room_type: @string
 * 		light: @string
 * 		people_number: @string
 * }
 * Returns JSON object with colors and manufacture information
 */
router.all('/paints', function(req, res, next) {
	var config = req.body.config;

	if (config) {
	    var paint_params = {};
	    // Defaults
	    //paint_params. ...

	    var finish_params = {};
	    // Defaults
	    //finish_params.type = 'flat/matte';

	    if (config.color_preference) {
	    	paint_params.type = config.color_preference;
	    	switch (config.color_preference) {
				case 'blue':
					paint_params.type = {$in: ['blue', 'orange', 'red']};
					break;
	    		case 'red':
					paint_params.type = {$in: ['red', 'blue', 'green']};
					break;
				case 'orange':
					paint_params.type = {$in: ['orange', 'blue', 'purple']};
					break;
				case 'yellow':
					paint_params.type = {$in: ['yellow', 'red', 'purple']};
					break;
				case 'green':
					paint_params.type = {$in: ['green', 'red', 'neutrals']};
					break;
				case 'purple':
					paint_params.type = {$in: ['purple', 'green', 'orange']};
					break;
				case 'brown':
					paint_params.type = {$in: ['brown', 'blue', 'green']};
					break;
				case 'black':
					paint_params.type = {$in: ['black', 'blue', 'purple']};
					break;
				case 'grey':
					paint_params.type = {$in: ['grey', 'green', 'red']};
					break;
	    		default:
	    			paint_params.type = {$in: ['neutrals', 'blue', 'orange']};	    			
	    	};	    	
	    }

	    if (config.room_colors) {
	    	switch (config.room_colors) {
	    		case 'dark':
	    			paint_params.light = {$in: ['medium-dark', 'medium-light', 'light', 'intense-light']};
	    			break;
	    		case 'light':
	    			paint_params.light = {$in: ['intense-dark', 'dark', 'medium-dark', 'medium-light']};
	    			break;
	    		default:
	    			paint_params.light = {$in: ['medium-dark', 'medium-light']};	    			
	    	};	    	
	    }

	    if (config.room_type) {
	    	switch (config.room_type) {
	    		case 'bedroom':
	    			paint_params.intensity = 'cool';
	    			break;
	    		case 'washroom':
	    			paint_params.intensity = 'cool';
	    			break;
	    		case 'kitchen':
	    			paint_params.intensity = 'warm';
	    			break;
	    		case 'living room':
	    			paint_params.intensity = 'warm';
	    			break;
	    		case 'garage':
	    			paint_params.intensity = 'cool';
	    			break;
	    		case 'dining':
	    			paint_params.intensity = 'warm';
	    			break;
	    		default:
	    			paint_params.intensity = 'warm';
	    	}	    	
	    }

	    if (config.room_feel) {
	    	if (!paint_params.light) {
	    		paint_params.light = {$in: ['intense-dark', 'dark', 'medium-dark', 'medium-light', 'light', 'intense-light']};
	    	}

	    	switch (config.room_feel) {
	    		case 'cluttered':
	    			paint_params.light['$in'].remove('intense-dark');
	    			paint_params.light['$in'].remove('dark');
	    			break;
	    		case 'empty':
	    			paint_params.light['$in'].remove('light');
	    			paint_params.light['$in'].remove('intense-light');	    			
	    			break;
	    		default:
	    			paint_params.light['$in'].remove('intense-dark');
	    			paint_params.light['$in'].remove('dark');
	    			paint_params.light['$in'].remove('light');
	    			paint_params.light['$in'].remove('intense-light');
	    	}	    	
	    }

	    if (config.people_number) {
	    	switch (config.people_number) {
	    		case 'low':
	    			finish_params.type = 'flat/matte';
	    			break;
	    		case 'high':
	    			finish_params.type = 'eggshell';
	    			break;
	    		default:
	    			finish_params.type = 'satin/semi-gloss';
	    	}	
	    }

	    var paints = App.db.collection('paints');	
		paints.find(paint_params).toArray(function(err, docs) {
			if (err) {
				res.json({
			        success: false,
			        message: err
			    });
			}
			else {
				var paints_list = docs;

				// This code selects manufacturers that are present in paints list only
				// For now, we want to list all the manufacturers
				/*
				var manufacturers = [];
				for (var i = 0; i < paints_list.length; i++) {
					if (manufacturers.indexOf(paints_list[i].manufacturer_name) == -1)
						manufacturers.push(paints_list[i].manufacturer_name);
				}

				finish_params.manufacturer_name = {$in: manufacturers};
				*/

				var finishes = App.db.collection('finishes');	
				finishes.find(finish_params).toArray(function(err, docs) {
					if (err) {
						res.json({
					        success: false,
					        message: err
					    });
					}
					else {
						res.json({
					        success: true,
					        paints: paints_list,
					        finishes: docs
					    });
					}
				});
			}
		});
	}
	else {
		res.json({
	        success: false,
	        message: 'Please, pass config'
	    });
	}	
});


/**
 * API to return nearest Canadian Tire Store
 * Must pass location_data
 * location_data = {
 * 		latitude: @float
 * 		longitude: @float
 * }
 */
router.all('/stores', function(req, res, next) {
	if (req.body.location_data) {		
		var latitude = String(req.body.location_data.latitude);
		var longitude = String(req.body.location_data.longitude);

		// Get all Canadian Tire stores nearby
		request
		  	.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=20000&name=%22Canadian%20Tire%22&key=AIzaSyBEiPwVdHfHv6WeffxOsBfaiMTng0dZDG8", function(error, response, body){
			  	body = JSON.parse(body);			  	
			  	var found = false;
			  	var results_index;
			  	for(var i = 0; i < body.results.length; i++){
			  		if(body.results[i].name == "Canadian Tire"){
			  			found = true;
			  			results_index = i;
			  			break;
			  		}
			  	}

				if(!found) {	  		
			  		res.json({
			  			success: false,
			  			message: 'No Canadian Tire stores nearby'
			  		});
			  	}
			  	else {
			  		// Get specific store information
				  	request
				  		.get("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + body.results[results_index].place_id + "&key=AIzaSyBEiPwVdHfHv6WeffxOsBfaiMTng0dZDG8", function(error, response, store_details){
				  			if (!error) {
					  			store_details = JSON.parse(store_details)

					  			var temp_array = store_details.result.formatted_address.split(',');
					  			var temp_array2 = temp_array[2].split(' ');
					  			var address = temp_array[0];
					  			var city = temp_array[1].split(' ')[1];
					  			var province = temp_array2[1];
					  			var postal = temp_array2[2] + " " + temp_array2[3];
					  			var country = temp_array[3].split(' ')[1];
					  			
					  			var server_response = {};
					  			server_response.address_html = store_details.result.adr_address;
					  			server_response.address_formatted = store_details.result.formatted_address;
					  			server_response.address = {
					  				street: address,
					  				city: city,
					  				province: province,
					  				postal: postal,
					  				country: country
					  			};
					  			server_response.phone_number = store_details.result.formatted_phone_number;
					  			server_response.hours_of_operation = store_details.result.opening_hours;
					  			server_response.location_coordinates = {
					  				latitude: store_details.result.geometry.location.lat,
					  				longitude: store_details.result.geometry.location.lng
					  			};
					  			
					  			res.json({
									success: true,
					  				store: server_response
					  			});
					  		}
				  		});
				}
			});
	}
	else {
		res.json({
	        success: false,
	        message: 'Please, pass location data'
	    });
	}
});

/**
 * Remove all entries of the specified element in the array
 */
Array.prototype.remove = function(what) {
    while ((pos = this.indexOf(what)) !== -1) {
        this.splice(pos, 1);
    }
    return this;
};
module.exports = router;
