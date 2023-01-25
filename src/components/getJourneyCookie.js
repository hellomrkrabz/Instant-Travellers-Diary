function getJourneyCookie() {
	var name='journey_id',journeyId;
	var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)===' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            journeyId= c.substring(nameEQ.length,c.length);
        }
    }
	return journeyId;
}

export default getJourneyCookie