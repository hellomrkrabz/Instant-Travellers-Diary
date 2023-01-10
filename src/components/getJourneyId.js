function getJourneyId() {
	
	var url = document.URL;
	
	url=url.replace("http://localhost:3000/Journey/", "");	
	return url;
}
	
export default getJourneyId