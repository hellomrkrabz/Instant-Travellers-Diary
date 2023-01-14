export async function setImgs()
{
	
	//"http://localhost:3000/api/Journeys/"+getCookie()
	const res = await fetch("http://localhost:5000/api/journey/"+"1"+"/images");//tu nie mam id
	//console.log(res);
	const resJson = await res.json();
	console.log(resJson.images);
	//var imagesArray
	//url=resJson.images[0].filename;
	//console.log(url);

	return resJson.images;
}

export default setImgs