function reScale() {
	var height = window.screen.availHeight;
	height=height*0.65;
	//height=height*0.85;
	document.body.style.height=height*5+'px';
	document.body.style.overflowY='hidden';
	document.body.style.overflowX='hidden';
	return height;
}
	
export default reScale