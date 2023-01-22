import React, { useEffect, useState } from "react";
import "./Journeys.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import getCookie from "./getCookie"
import axios from "axios";
import setCSS from "./setCSS"
import setImgs from "./setImgs"
import GoogleMaps from "./GoogleMaps"
import Popup from 'reactjs-popup';
import Map from "./GoogleMapsWithCoords";
import Checkbox from '@mui/material/Checkbox';

var img;
var isMapEnabled = false;


function reloadPage()
{
	window.location.reload();
}

function changeImgs(imgs)
{
	var list = document.getElementsByClassName("journey");
	console.log(imgs);
	
	for(var i=0;i<imgs.images.length;i++)
	{
		list[i].childNodes[1].src=imgs.images[i].filename;
		list[i].childNodes[1].setAttribute('id',imgs.imgsIds[i]);
	}
	
}

function setCoords(lat, lng)
{
	document.getElementById("lat").value=lat;
	document.getElementById("lng").value=lng;
}

function handleUploadImage(res)
{
    const IDCookie = document
          .cookie
          .split('; ')
          .find((row) => row.startsWith('user_id='))?.split('=')[1];
  
    let data = new FormData();
    data.append('file', img);
    data.append('id', res.id);
	data.append('type','Journey');

    axios.post('http://localhost:5000/api/upload/image', data).then(response => {
        console.log(response);
    }).catch(error => {
        console.log(error);
    });
	
	//reloadPage();
}

const AddJourney = (props) => {
  const [name, setName] = useState("");
  const [dateInit, setDateInit] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState("")

  const { fileRejections, getRootProps, getInputProps, open } = useDropzone({
    onDropAccepted: setFiles,
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop: (filesUpload) => {
      const formData = new FormData();
      const token = process.env.CMS_TOKEN;

      const file = filesUpload[0];
	  img=file;

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        const url = 'data:image/png;base64,'+base64
        setFileUrl(url)
      };

      reader.readAsDataURL(file);
    },
  });

  const createJourney = async () => {
    console.log("Name", name);
    console.log("Init", dateInit);
    console.log("End", dateEnd);
    console.log("Description", description);

    if (fileUrl != "" && name != "" && dateInit != "" && dateEnd != "" && description != "") {
      const newJourneys = JSON.parse(JSON.stringify(props.journeys));

		

      const journey = {
        name: name,
        description: description,
        initial_date: dateInit,
        end_date: dateEnd,
        picturePath: 'cos',
		userId: getCookie(),
        stages: [],
		public: false,
      };

	const arr=Array.from(newJourneys);
	arr.push(journey);

      await fetch("http://localhost:5000/api/journey/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journey)//,
	}).then((response) => response.json()).then((resp)=> 
	{
		arr[arr.length-1].id=resp.id;
		handleUploadImage(resp)
	});//.then(()=>reloadPage());
	  	  
	  props.setJourneys(arr);
	  setImgs("journey").then(text=>{
			changeImgs(text);
		});
      props.setCreateJourney(0);
	  
	  //setTimeout(reloadPage(),2000);
	  

    }
  };
  
  
  return (<div className="box-create-journey">
    <div class="card-create-journey">
        <div class="card-body" style={{backgroundColor: "white"}}>
        <form>
          
          <div class="form-group">
          {files.length == 0 ?
            <IconButton onClick={open}>
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 60 }} />
            </IconButton>
            :
            <img src={fileUrl} />
          }
          </div>
          <div class="form-group">
            <input
              type="text"
              class="form-control-name"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div class="form-group">
            <input
              type="date"
              class="form-control-date"
              id="initial_date"
              value={dateInit}
              onChange={(e) => setDateInit(e.target.value)}
            />
          </div>
          <div class="form-group">
            <input
              type="date"
              class="form-control-date"
              id="end_date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>
          <div class="form-group">
            <textarea
              class="form-control-description"
              id="description"
              rows="3"
              value={description}
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </form>
        <button className="button-create" onClick={createJourney}>CREATE JOURNEY</button>
      </div>
    </div>
    </div>
  );
};


function toggleMap(){
  if(isMapEnabled == false){
    isMapEnabled = true;
    showMap();
  }
  else{
    isMapEnabled = false;
  }
}

 function showMap() {
  return (
    <div>
      <button className="button-add" onClick={() => toggleMap()}>HIDE MAP</button>
      <GoogleMaps>
      </GoogleMaps>
    </div>
  );
}

const EditJourney = (props) => {
	
	console.log(props);
	
  const [name, setName] = useState(props.journey.name);
  const [dateInit, setDateInit] = useState(props.journey.initial_date);
  const [dateEnd, setDateEnd] = useState(props.journey.end_date);
  const [description, setDescription] = useState(props.journey.description);
  const [isPublic, setPublic] = useState(props.journey.public);
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState(props.journey.image_path)

  const { fileRejections, getRootProps, getInputProps, open } = useDropzone({
    onDropAccepted: setFiles,
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop: (filesUpload) => {
      const formData = new FormData();
      const token = process.env.CMS_TOKEN;

      const file = filesUpload[0];

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        const url = 'data:image/png;base64,'+base64
        setFileUrl(url)
      };

      reader.readAsDataURL(file);
    },
  });

  const editJourney = async () => {
	      
    // console.log("NAME ", name)
    // console.log("END ", dateEnd)
    // console.log("INIT", dateInit)
    // console.log("URL", fileUrl)
    // console.log("DESCRIPTION", description)

    if (fileUrl != "" && name != "" && dateInit != "" && dateEnd != "" && description != "") {
      let newJourneys = JSON.parse(JSON.stringify(props.journeys));

      const index = newJourneys.findIndex((j) => j.id == props.journey.id);  
	  
	  console.log(newJourneys);
      const journey = {
        name: name,
        description: description,
        initial_date: dateInit,
        end_date: dateEnd,
        picturePath: fileUrl,
		userId:props.journey.author_id,
		id: props.journey.id,
        public: isPublic
      };
	  	  
	  /*const localJourney = {
        name: props.journey.name,
        description: props.journey.description,
        initial_date: props.journey.initial_date,
        end_date: props.journey.end_date,
        picturePath: props.journey.image_path,
		userId: props.journey.author_id,
        stages: [],
      };*/
	  

      //console.log("NEW ", journey)
      //console.log("INDEX ", index)
	  
	  console.log(journey)
    
      newJourneys[index] = journey
	  console.log(newJourneys);
	  
	  await fetch("http://localhost:3000/api/journey/edit",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journey)
      }).then(()=>props.setJourneys(newJourneys)).then(()=>props.setEdit(false)).then(()=>reloadPage());

      /*await fetch("http://localhost:3001/journeys/"+props.journey.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journey)
      });*/
      //props.setJourneys(newJourneys);
      //props.setEdit(false)
      /*props.setJourneys(arr);*/
    }
  };

console.log(typeof isPublic);
  return (
    <div className="box-edit-journey">
    <div class="card-edit-journey">
      <div class="card-header">
      </div>
      <div class="card-body">
        <div className="edit-card-header">
            <h3>Edit Journey</h3>
        </div>
        <form>
          <div class="form-edit-group-journey">
          {fileUrl == "" ?
            <IconButton onClick={open}>
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 60 }} />
            </IconButton>
            :
            <>
            <img src={fileUrl} />
            </>
          }
          </div>

          <div class="form-edit-group-journey">
            <input
              type="text"
              class="form-control-name"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div class="form-edit-group-journey">
            <input
              type="date"
              class="form-control-date"
              id="initial_date"
              value={dateInit}
              onChange={(e) => setDateInit(e.target.value)}
            />
          </div>
          <div class="form-edit-group-journey">
            <input
              type="date"
              class="form-control-date"
              id="end_date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>
          <div class="form-edit-group-journey">
            <textarea
              class="form-control-description"
              id="description"
              rows="3"
              value={description}
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
            <div class="form-edit-group-checkbox">
            <Checkbox id="public" checked={Boolean(isPublic)}
                   onChange={(e) => setPublic(e.target.checked)}
            />

            <label htmlFor="Public">Public</label>
          </div>
        </form>
        <button className="button-edit" onClick={editJourney}>Edit Journey</button>
        <button className="button-edit" onClick={() => {
		  reloadPage();
          setName("")
          setDateInit("")
          setDateEnd("")
          setFileUrl("")
          setFiles([])
          setDescription("")
          setPublic("")
          props.setEdit(false)
        }}>Back</button>
      </div>
    </div>
    </div>
  );
};

const Journey = (props) => {
  const [showStages, setShowStages] = useState(false);
	const [edit, setEdit] = useState(false);

  return (
	<>
	{edit == false ? 
    <div className="journey">
      <h1 className="title-journey">{props.journey.name}</h1>
      <img src={props.journey.image_path} />
  
      <h4 className="date-journey">{props.journey.initial_date} to {props.journey.end_date}</h4>
      <div className="box-description">
      <span className="text-description">{props.journey.description}</span>
      </div>
	   <div>
      <Link to={`/Stages/${props.journey.id}`}>
        <button className="button-open">OPEN</button>
      </Link>
	  
		<button className="button-open" onClick={() => 
		{
			var localJourneys=props.journeys;
		    console.log(localJourneys);
		    console.log(props.journey.id);
			localJourneys.find((element) => element.name == props.journey.name).image_path=document.getElementById(props.journey.id).src;

			props.setJourneys(localJourneys);

			setEdit(true)
		}}>EDIT</button>
	  
		<button className="button-open" onClick={()=>
				{	
					var information = {
						id: props.journey.id
					}
					
					fetch("http://localhost:5000/api/journey/delete", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(information)//,
					}).then(setTimeout(reloadPage,500));
					
				}
			}>DELETE</button>
	  </div>
   </div>
    :
    <EditJourney 
      setJourneys={props.setJourneys}
      journey={props.journey}
      setEdit={setEdit}
      journeys={props.journeys}
      />
    }
    </>

  );
};

function parseJSON(props) {
  JSON.stringify(props.journeys.name)
  JSON.stringify(props.journeys.description)
  JSON.stringify(props.journeys.initialDate)
  JSON.stringify(props.journeys.endDate)
}

function Journeys() {
  const [createJourney, setCreateJourney] = useState(0);
  const [enableMap, setEnableMap] = useState(0);
  const [journeys, setJourneys] = useState([]);
  const [id,setId] = useState(0);

  useEffect(() => {
		(async () => {
		const res = await fetch("http://localhost:5000/api/Journeys/"+getCookie());

		const resJson = await res.json();
		const resJourneys=resJson.journeys;
		
		setJourneys(resJourneys);

		 var imagePaths= setImgs('journey').then(text=>{
			changeImgs(text);
		});
		
		

    })();
  }, []);
  
  return (
    <>
	{setCSS()}
      {createJourney == 0 ? (
        <>
          
          <button className="button-add" onClick={() => setCreateJourney(1)}>ADD JOURNEYS</button>



          <Popup trigger={<button className="button-add">SHOW ON MAP</button>}
                 position="right center"
                 modal
                 nested
          >
            {close => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="header"> Map of Journeys
                    </div>
	  <div id="box-create-map">
      <GoogleMaps/>
      </div>
                </div>
            )}
          </Popup>
         
          <div className="box-journeys">
          <div className="journeys">
           <Swiper spaceBetween={50} slidesPerView={journeys.length == 1 ? 1: journeys.length == 2 ? 2: 3 }>
             {
				  Array.from(journeys).map((journey) => (
                <SwiperSlide>
				
                   <Journey  journeys={journeys} setJourneys={setJourneys} journey={journey} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          </div>
		  
        </>
      ) : ( 
      <div className="center">
        <AddJourney
          setJourneys={setJourneys}
          journeys={journeys}
          setCreateJourney={setCreateJourney} 
        />
        </div>
        )
      }
    </>
  );
}

export default Journeys;
