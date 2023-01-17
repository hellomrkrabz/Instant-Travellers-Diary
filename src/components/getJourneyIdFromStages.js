function getJourneyId() {
	
	var url = document.URL;
	
	url=url.replace("http://localhost:3000/journey/", "");	
	return url;
}
	
export default getJourneyId