function setAvatar(arg) {
	console.log(arg);
	if(arg && arg!=null)
	{
		console.log("gut");
		return arg;
	}else
	{
		console.log("not gut");
		return '/static/media/default.7c0a94e83e1d6f79d05e.png'
	}
}
	
export default setAvatar