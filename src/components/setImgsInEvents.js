export async function setImgsInEvents(eventId)
{
	var url = document.URL;
	
	console.log(eventId);
	
	var images=[];
	
	for(var i=0;i<eventId.length;i++)
	{
		console.log(eventId[i]);
		
		const res = await fetch("http://localhost:5000/api/event/"+eventId[i]+"/images");
		
		const resJson = await res.json();
		console.log(resJson.images[0]);
		images.push(resJson.images[0]);
	}
		
	//const res = await fetch("http://localhost:5000/api/"+type+"/"+id+"/images");
	//const resJson = await res.json();
	console.log(images);

	return images;
}

export default setImgsInEvents