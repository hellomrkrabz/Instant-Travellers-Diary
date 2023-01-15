export async function setImgs(type)
{
	var url = document.URL;
	
	if(url=="http://localhost:3000/Journeys")
	{
		var id=1;
	}else
	{
		var id=url.replace("http://localhost:3000/journey/", "");
	}
	
	const res = await fetch("http://localhost:5000/api/"+type+"/"+id+"/images");
	const resJson = await res.json();

	return resJson.images;
}

export default setImgs