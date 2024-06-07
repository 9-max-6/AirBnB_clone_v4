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
            },
            error: function(error) {
                console.log("Error", error);
                $('header #api_status').removeClass('available');


            }
        })
    }
    checkStatus()
})

