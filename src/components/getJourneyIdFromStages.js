function getJourneyId() {
	
	var url = document.URL;
	
	url=url.replace("http://localhost:3000/journey/", "");	
	console.log(url);
	return url;
}
	
export default getJourneyId