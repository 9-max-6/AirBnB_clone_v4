$(() => {
	const checkedAmenities = {};
    const checkedLocations = {}
    let checkedAmenitiesIds = [];
    let checkedStatesIds = [];
    let checkedCitiesIds = [];

	$('.amenities .popover ul div input').change(function () {
		const dataId = $(this).data('id');
		const dataName = $(this).data('name');
		if ($(this).prop('checked')) {
			checkedAmenities[dataId] = dataName;
            checkedAmenitiesIds.push(dataId)
		} else {
			delete checkedAmenities[dataId];
            checkedAmenitiesIds.filter((id, index) => {
                if (id !== dataId) {
                  return id;
                } else {
                  checkedAmenitiesIds.splice(index, 1);
                  return undefined;
                }
              });
		}
		const amenitiesList = Object.values(checkedAmenities);
		const amenitiesString = amenitiesList.join(', ');
		$('.amenities h4').text(amenitiesString);
	});



    $('.locations .popover ul .city_box input').change(function () {
        console.log($(this));
		const dataId = $(this).data('id');
		const dataName = $(this).data('name');
        console.log(dataName);
		if ($(this).prop('checked')) {
			checkedLocations[dataId] = dataName;
            checkedCitiesIds.push(dataId)
		} else {
			delete checkedLocations[dataId];
            checkedCitiesIds.filter((id, index) => {
                if (id !== dataId) {
                  return id;
                } else {
                  checkedCitiesIds.splice(index, 1);
                  return undefined;
                }
              });
		}
        console.log(dataId);
		const locationsList = Object.values(checkedLocations);
		const locationsString = locationsList.join(', ');
		$('.locations h4').text(locationsString);
	});

    $('.locations .popover ul .state_box input').change(function () {
        console.log($(this));
		const dataId = $(this).data('id');
		const dataName = $(this).data('name');
        console.log(dataName);
		if ($(this).prop('checked')) {
			checkedLocations[dataId] = dataName;
            checkedStatesIds.push(dataId)
		} else {
			delete checkedLocations[dataId];
            checkedStatesIds.filter((id, index) => {
                if (id !== dataId) {
                  return id;
                } else {
                  checkedStatesIds.splice(index, 1);
                  return undefined;
                }
              });
		}
        console.log(dataId);
		const locationsList = Object.values(checkedLocations);
		const locationsString = locationsList.join(', ');
		$('.locations h4').text(locationsString);
	});


    $('button').click(function () {
        const searchParameters = {}
        searchParameters['amenities'] = checkedAmenitiesIds
        searchParameters['states'] = checkedStatesIds
        searchParameters['cities'] = checkedCitiesIds
        if (searchParameters['states'].length === 0 &&
            searchParameters['cities'].length === 0 &&
            searchParameters['amenities'].length === 0
        ) {
        fetchPlaces({});
        }
        else {
            fetchPlaces(searchParameters);
        }
    }
    )


    function checkStatus () {
        $.ajax({
            url: "http://0.0.0.0:5001/api/v1/status/",
            success: function(data) {
                $('header #api_status').addClass('available');
                fetchPlaces({});
            },
            error: function(error) {
                console.log("Error", error);
                $('header #api_status').removeClass('available');
            }
        })
    }

    function fetchPlaces (searchParameters) {
        
        $.ajax({
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(searchParameters),
            success: function(data) {
                displayPlaces(data)
            },
            error: function(error) {
                console.log("Error", error);

            }
        })
    }

    function attachEventListeners() {
        $('.places .reviews span').click(function () {
            console.log("I got clicked");
    
            const $span = $(this); // Store the reference to the clicked span
            const reviewList = $span.closest('.reviews').find('ul.review_list');
    
            if ($span.text() === 'Hide') {
                $span.text('Show');
                reviewList.empty();                
            } else {
                const dataId = $span.data('id');
                console.log(dataId);
                $.ajax({
                    url: `http://0.0.0.0:5001/api/v1/places/${dataId}/reviews`,
                }).then((data) => {
                    reviewList.empty(); // Clear the review list before appending new items
    
                    const reviewPromises = data.map((review) => {
                        const dateString = review.created_at;
                        const dateObject = new Date(Date.parse(dateString));
                        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
                        const reviewText = review.text;
    
                        return $.ajax({
                            url: `http://0.0.0.0:5001/api/v1/users/${review.user_id}`,
                        }).then((userData) => {
                            const userName = userData.first_name + ' ' + userData.last_name;
                            reviewList.append(
                                `<li>
                                    <h3>From ${userName} in ${monthNames[dateObject.getMonth()]}</h3>
                                    <p>${reviewText}</p>
                                </li>`
                            );
                        });
                    });
                    $.when.apply($, reviewPromises).then(() => {
                        reviewList.toggleClass('hidden');
                        $span.text('Hide');
                    });
                    
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
    }
    
    

    function displayPlaces (data) {
        const places_section = $('section.places');
        places_section.empty();
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
                    <div class="reviews">
                            <h2>Reviews</h2>
                            <span
                                data-id="${place.id }"
								data-name="${place.name}"
                            >
                            Show
                            </span>
                            <ul class="review_list hidden" >
                            </ul>
                           
                    </div>
                        
                </article>`
            )
        }
        attachEventListeners();
       
    }
    checkStatus();
    
    
})
