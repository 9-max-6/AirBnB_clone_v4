$(() => {
	const checkedAmenities = {};
	
	$('.popover ul div input').change(function () {
		const dataId = $(this).data('id');
		const dataName = $(this).data('name');
		if ($(this).prop('checked')) {
			checkedAmenities[dataId] = dataName;
		} else {
			delete checkedAmenities[dataId];
		}
		const amenitiesList = Object.values(checkedAmenities);
		const amenitiesString = amenitiesList.join(', ');
		$('.amenities h4').text(amenitiesString);
	});

    function checkStatus () {
        $.ajax({
            url: "http://0.0.0.0:5001/api/v1/status/",
            success: function(data) {
                $('header #api_status').addClass('available');
                fetchPlaces();
            },
            error: function(error) {
                console.log("Error", error);
                $('header #api_status').removeClass('available');


            }
        })
    }

    function fetchPlaces () {
        $.ajax({
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: '{}',
            success: function(data) {
                displayPlaces(data)
            },
            error: function(error) {
                console.log("Error", error);

            }
        })
    }

    function displayPlaces (data) {
        const places_section = $('section.places');
        for (const key in data) {
            const place = data[key];
            let guest_prefix;
            let room_prefix;
            let bath_prefix;

            if (place.max_guest > 1) {
                guest_prefix = 'Guests'
            }
            else {
                guest_prefix = 'Guest'
            }
            if (place.number_rooms > 1) {
                room_prefix = 'Bedrooms'
            }
            else {
                room_prefix = 'Bedroom'
            }
            if (place.number_bathrooms > 1) {
                bath_prefix = 'Bathrooms'
            }
            else {
                bath_prefix = 'Bathroom'
            }
            places_section.append(
                `<article>
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">\$${place.price_by_night}</div>
					</div>
					<div class="information">
						<div class="max_guest">${place.max_guest} ${guest_prefix}</div>
						<div class="number_rooms">${place.number_rooms} ${room_prefix}</div
						>
						<div class="number_bathrooms"
							>${place.number_bathrooms} ${bath_prefix}</div
						>
					</div>
					<div class="description"> ${place.description}</div>
                    </div>
                </article>`
            )
        }
    }
    checkStatus();
    
})

