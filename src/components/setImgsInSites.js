export async function setImgsInEvents(eventId)
{
	var url = document.URL;
		
	url=url.replace("http://localhost:3000/Sites/", "");
		
	var images=[];
	var ids=[];
	
	var res = await fetch("http://localhost:5000/api/Sites/"+url
		).then((response) => response.json()).then((resp)=> 
		{
			for(var i=0;i<resp.sites.length;i++)
			{
				ids.push(resp.sites[i].id);
			}
			return ids;
		}).then(async (r)=>
		{
			console.log(r);
			for(var j=0;j<r.length;j++)
			{
				const res = await fetch("http://localhost:5000/api/site/"+r[j]+"/images");
				const resJson = await res.json();
				console.log(resJson);
				images.push(resJson.images[0].filename);
			}
		});
		
	var tmp={
		images:images,
		imgsIds:ids,
	}
	console.log(tmp);
		
	return tmp;
}

export default setImgsInEvents