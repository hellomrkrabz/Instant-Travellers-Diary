import { useState, useEffect } from "react";
import "./SlideShow.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import getJourneyId from "./getJourneyIdFromSites"
import { useParams } from "react-router-dom";
import setCSS from "./setCSS";
import "swiper/swiper.min.css";
import SwiperCore, { EffectCoverflow, Pagination } from "swiper/core";

SwiperCore.use([EffectCoverflow, Pagination]);

var globalSites = [0];

function changeImgs(imgs) {
	var list = document.getElementsByClassName("slide");

	for(var i = 0; i < imgs.images.length; i++) {
		list[i].childNodes[0].childNodes[0].src = imgs.images[i];
		list[i].childNodes[0].childNodes[0].setAttribute('id', imgs.ids[i]);
	}

}

const SiteComponent = (props) => {
	const [edit, setEdit] = useState(false)

	return (
		<>
		<div className = "slide">
		<div>
		<img id = ""
		src = {
			(globalSites.find(element => element.name == props.site.name)).image_path }/>
		<span className = "box-description-slide" > { props.site.description } </span>
		</div>
		</div>
		</>
	);
}

const Site = (props) => {
	let { id } = useParams();

	var [event, setEvent] = useState({
		name: "",
		description: "",
		timestamp: "",
		picturePath: "",
		userId: "",
		sites: [],
	});

	var [sites, setSites] = useState([]);

	const [createSite, setCreateSite] = useState(false)

	var { resJ } = [];

	useEffect(() => {
		(async () => {
			var imgs = [];
			var ids = [];

			const res = await fetch("http://localhost:3000/api/journey/" + id + "/sites");
			const resJson = await res.json().then((r) => {
				for(var i = 0; i < r.sites.length; i++) {
					imgs.push(r.sites[i].image);
					ids.push(r.sites[i].id);
				}
				return r;
			});

			setSites(resJson.sites);
			globalSites = resJson.sites;
			resJ = resJson.sites;

			var tmp = {
				name: "",
				description: "",
				initialDate: "",
				endDate: "",
				picturePath: "",
				userId: "",
				events: resJ
			};

			var siteId = [];

			siteId.push(getJourneyId());

			var temporary = {
				images: imgs,
				ids: ids,
			}

			setTimeout(changeImgs, 200, temporary);

			setEvent(tmp);
		})();
	}, []);

	return (
		<>
		{ setCSS() }
		<>

		<Link to = { `/Journeys` }>
		<button className = "button-add"> GO BACK
		</button>
		</Link>

		<div className = "box-events">
		<div className = "events">
		<br/>
		<Swiper effect = { "coverflow" } grabCursor = { true } centeredSlides = { true } slidesPerView = { "auto" } coverflowEffect = {
			{
				rotate: 0,
				stretch: 5,
				depth: 100,
				modifier: 3,
				slideShadows: true,
			}
		}>
			{
			Array.from(globalSites).map((site) => ( <
				SwiperSlide >
				<
				SiteComponent site = { site } globalSites = { globalSites }
				/> <
				/SwiperSlide>
			))
		}
		</Swiper>

		</div>
		</div>
		</>
		</>
	);
};

export default Site;