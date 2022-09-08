const getLocation = () =>
	new Promise(resolve => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				function(position) {
					resolve([position.coords.latitude, position.coords.longitude]);
				},
				() => {
					resolve([]);
				},
				{ maximumAge: 60000, timeout: 15000, enableHighAccuracy: true }
			);
		} else {
			return resolve([]);
		}
	});

export default getLocation;
