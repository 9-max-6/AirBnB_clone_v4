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
