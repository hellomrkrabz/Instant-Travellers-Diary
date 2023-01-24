import { useState, useEffect } from "react";
import "./Sites.css";
import { useKeenSlider } from "keen-slider/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import getJourneyCookie from "./getJourneyCookie"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import setImgs from "./setImgsInSites"
import { Link } from "react-router-dom";
import getJourneyId from "./getJourneyIdFromSites"
import getJourneyIdOld from "./getJourneyIdv2"
import Map from "./GoogleMapsWithCoords"

import { useParams } from "react-router-dom";
import axios from "axios";
import setCSS from "./setCSS";
import GetJourneyCookie from "./getJourneyCookie";
import GoogleMapsWith1Pin from "./GoogleMaps1Pin";
import Popup from 'reactjs-popup';


import "swiper/swiper.min.css";
import SwiperCore, { EffectCoverflow, Pagination } from "swiper/core";
SwiperCore.use([EffectCoverflow, Pagination]);

var globalSites=[0];
var img;


function changeImgs(imgs)
{
	var list = document.getElementsByClassName("site");
	
	for(var i=0;i<imgs.images.length;i++)
	{
		list[i].childNodes[0].childNodes[0].src=imgs.images[i];
		list[i].childNodes[0].childNodes[0].setAttribute('id',imgs.imgsIds[i]);
	}
	
}

const SiteComponent = (props) => {
	const [edit, setEdit] = useState(false)

	return (
	<>
	
    <div className="site">
		<div>
		<img id="" src={(globalSites.find(element => element.name==props.site.name)).image_path} />	
		<span className="text-description">{props.site.description}</span>
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
	  

	var [sites,setSites]=useState([]);

  const [createSite, setCreateSite] = useState(false)

	var {resJ} = [];
  
useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/Sites/"+id); //retrive
      const resJson = await res.json();

	  setSites(resJson.sites);
		globalSites=resJson.sites;
	  resJ=resJson.sites;
	  
	  var tmp={
        name: "",
        description: "",
        initialDate: "",
        endDate: "",
        picturePath: "",
		userId: "",
        events: resJ
      };
	  
	  var siteId=[];

	  siteId.push(getJourneyId());
	
	  
	  var imagePaths=setImgs(siteId).then(text=>{
			changeImgs(text);
		});
      setEvent(tmp);
    })();
  }, []);
  
  return (
    <>
    {setCSS()}
      <>

		  <Link to={`/Journeys`}>
			<button className="button-add">GO BACK</button>
		  </Link>
		  
		  <div className="box-events">
			  <div className="events">
				  <br/>
				  <Swiper  effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 5,
          depth: 100,
          modifier: 3,
          slideShadows: true,
        }}>
					{Array.from(globalSites).map((site) => (
					  <SwiperSlide>
						<SiteComponent site={site} globalSites={globalSites}/>
					  </SwiperSlide>
					))}
				  </Swiper>
				  
				</div>
			</div>
      </>
    </>
  );
};

export default Site;
