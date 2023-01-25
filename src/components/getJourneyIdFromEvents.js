function getJourneyId() {
	var url = document.URL;	
	url=url.replace("http://localhost:3000/Events/", "");	
	return url;
}
	
export default getJourneyId