export async function setImgs(type)
{

	var url =document.URL;
	var images=[];
	var imgIds=[];
	
	var tmpUrl1=url.substr(0,29);
	
	
	if(url==="http://localhost:3000/Journeys")
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

			
		for(var i=0;i<ids.length;i++)
		{
			var res = await fetch("http://localhost:5000/api/"+type+"/"+ids[i]+"/images"
			).then((response) => response.json()).then((resp)=> {
				images=images.concat(resp.images[0])
				imgIds.push(ids[i]);
			});
		}
		
		
	}else if(tmpUrl1==="http://localhost:3000/Stages/")
	{
		
		url=url.replace("http://localhost:3000/Stages/", "");
		
		var res = await fetch("http://localhost:5000/api/Stages/"+url
		).then((response) => response.json()).then(async (r)=> {
		
			for(var i=0;i<r.stages.length;i++)
			{
				//console.log(r.stages[i].id);
				imgIds.push(r.stages[i].id);
				var res = await fetch("http://localhost:5000/api/stage/"+r.stages[i].id+"/images"
				).then((response) => response.json()).then((resp)=> 
				{
					for(var i=0;i<resp.images.length;i++)
					{
						images=images.concat(resp.images[0].filename)
					}
				});
			}
		});
	}
		
	var tmp={
		images:images,
		imgsIds:imgIds,
	}
	console.log(tmp);
		
	return tmp;
}

export default setImgs