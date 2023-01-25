export async function setImgsInEvents(eventId) {
	var url = document.URL;

	url = url.replace("http://localhost:3000/Events/", "");

	var images = [];
	var ids = [];

	var res = await fetch("http://localhost:5000/api/Events/" + url).then((response) => response.json()).then((resp) => {
		for(var i = 0; i < resp.events.length; i++) {
			ids.push(resp.events[i].id);
		}
		return ids;
	}).then(async (r) => {
		for(var j = 0; j < r.length; j++) {
			const res = await fetch("http://localhost:5000/api/event/" + r[j] + "/images");
			const resJson = await res.json();
			images.push(resJson.images[0].filename);
		}
	});

	var tmp = {
		images: images,
		imgsIds: ids,
	}
	console.log(tmp);

	return tmp;
}

export default setImgsInEvents