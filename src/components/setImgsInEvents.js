export async function setImgsInEvents(eventId)
{
	var url = document.URL;
		
	var images=[];
	
	for(var i=0;i<eventId.length;i++)
	{		
		const res = await fetch("http://localhost:5000/api/event/"+eventId[i]+"/images");
		
		const resJson = await res.json();
		for(var j=0;j<resJson.images.length;j++)
		{
			images.push(resJson.images[j]);
		}
	}
	return images;
}

export default setImgsInEvents