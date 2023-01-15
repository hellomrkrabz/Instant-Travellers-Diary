function setCSS() {
	var height = window.screen.availHeight;
	//console.log("łopanie");
	//height=height*0.65;
	//return height;
	document.body.style.height=height*5+'px';
	document.body.style.overflowY='hidden';
	document.body.style.overflowX='hidden';
}
	
export default setCSS