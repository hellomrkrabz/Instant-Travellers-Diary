function setAvatar(arg) {
	console.log(arg);
	if(arg && arg != null) {
		return arg;
	}
	else {
		return '/static/media/default.7c0a94e83e1d6f79d05e.png'
	}
}

export default setAvatar