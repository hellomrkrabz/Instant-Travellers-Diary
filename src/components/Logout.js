function Logout() {
	document.cookie = "user_id=''; expires=-1, 18 Dec 2013 12:00:00 UTC; path=/";
	window.location.href = "/"
}
export default Logout