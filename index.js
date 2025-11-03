(() => {
	const API_KEY = "a675a7d4c8336eefe7b441ba25bfac71";

	const form = document.querySelector("#weather-app form");
	const input = document.querySelector("#weather-app input[name=search]") || document.getElementById('weather-search');
	const weatherEl = document.getElementById("weather");

	const clearWeather = () => {
		weatherEl.innerHTML = "";
	};

	const displayNotFound = () => {
		clearWeather();
		const h2 = document.createElement("h2");
		h2.textContent = "Location not found";
		weatherEl.appendChild(h2);
	};

	const buildWeatherUI = (data) => {
		clearWeather();

		const { name, sys = {}, coord = {}, weather = [], main = {}, dt } = data;
		const country = sys.country || "";

		const h2 = document.createElement("h2");
		h2.textContent = `${name}${country ? `, ${country}` : ""}`;

		const a = document.createElement("a");
		a.textContent = "Click to view map";
		a.href = `https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}`;
		a.target = "__BLANK";

		const iconCode = weather[0] && weather[0].icon;
		const img = document.createElement("img");
		if (iconCode) img.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

		const desc = document.createElement("p");
		desc.style.textTransform = "capitalize";
		desc.textContent = (weather[0] && weather[0].description) || "";

		const cur = document.createElement("p");
		cur.textContent = `Current: ${main.temp}° F`;

		const feels = document.createElement("p");
		feels.textContent = `Feels like: ${main.feels_like}° F`;

		const updated = document.createElement("p");
		const date = new Date(dt * 1000);
		const timeString = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
		updated.textContent = `Last updated: ${timeString}`;

		[h2, a, img, desc, document.createElement('br'), cur, feels, document.createElement('br'), updated]
			.forEach((el) => weatherEl.appendChild(el));
	};

	const fetchWeather = async (query) => {
		const base = "https://api.openweathermap.org/data/2.5/weather";
		const url = `${base}?units=imperial&appid=${API_KEY}&q=${query}`;

		try {
			const res = await fetch(url);
			// Some test stubs set `ok` incorrectly; treat any non-200 status as a failure
			if (!res.ok || (res.status && res.status !== 200)) {
				displayNotFound();
				return;
			}
			const data = await res.json();
			buildWeatherUI(data);
		} catch (err) {
			displayNotFound();
		}
	};

	form.addEventListener("submit", (e) => {
		e.preventDefault();

		const query = (input.value || "").trim();

		clearWeather();
		input.value = "";

		if (!query) return;

		fetchWeather(query);
	});
})();