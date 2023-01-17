export async function setImgs(type)
{

	var ids=1;
	
	var name='user_id',userId;
	var i, c, ca, nameEQ = name + "=";
	ca = document.cookie.split(';');
	for(i=0;i < ca.length;i++) {
		c = ca[i];
		while (c.charAt(0)===' ') {
			c = c.substring(1,c.length);
		}
		if (c.indexOf(nameEQ) === 0) {
			userId= c.substring(nameEQ.length,c.length);
		}
	}
	
	
	var res = await fetch("http://localhost:5000/api/users/"+userId
	).then((response) => response.json()).then((resp)=> ids=resp.journeys);

		
	var images=[];
	
	for(var i=0;i<ids.length;i++)
	{

		var res = await fetch("http://localhost:5000/api/"+type+"/"+ids[i]+"/images"
		).then((response) => response.json()).then((resp)=> console.log(resp.images));//tutaj musi być for
	}//images=images.concat(resp.images[0])
	
	return images;
}

export default setImgs