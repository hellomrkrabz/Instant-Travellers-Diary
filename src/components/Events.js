import { useState, useEffect } from "react";
import "./Events.css";
import { useKeenSlider } from "keen-slider/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import getJourneyCookie from "./getJourneyCookie"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import setImgs from "./setImgsInEvents"
import { Link } from "react-router-dom";
import getJourneyId from "./getJourneyIdFromEvents"
import getJourneyIdOld from "./getJourneyIdv2"
import Map from "./GoogleMapsWithCoords"
import Popup from 'reactjs-popup';

import { useParams } from "react-router-dom";
import axios from "axios";
import setCSS from "./setCSS";
import GetJourneyCookie from "./getJourneyCookie";

var globalEvents=[0];
var img;

function reloadPage()
{
	window.location.reload();
}

function changeImgs(imgs)
{
	var list = document.getElementsByClassName("event");
	
	for(var i=0;i<imgs.images.length;i++)
	{
		list[i].childNodes[1].src=imgs.images[i];
		list[i].childNodes[1].setAttribute('id',imgs.imgsIds[i]);
	}
	
}

function setCoords(lat, lng)
{
	document.getElementById("lat").value=lat;
	document.getElementById("lng").value=lng;
}

function setCookie(stageID)
{
	var days =1;
	var name='stage_id';
	var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + stageID + expires + "; path=/";
}

function handleUploadImage(res)
{
    console.log(getJourneyId());
    const IDCookie = document
          .cookie
          .split('; ')
          .find((row) => row.startsWith('user_id='))?.split('=')[1];
  
  
  
    let data = new FormData();
    data.append('file', img);
    data.append('id', res.id);
	data.append('type','event');
	

    axios.post('http://localhost:5000/api/upload/image', data).then(response => {
        console.log(response);
    }).catch(error => {
        console.log(error);
    });
}

const AddEvent = (props) => {

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [fileUrl, setFileUrl] = useState("")
    const [lat, setLat] = useState(1);
    const [lng, setLng] = useState(1);

    const {fileRejections, getRootProps, getInputProps, open} = useDropzone({
        onDropAccepted: setFiles,
        noClick: true,
        noKeyboard: true,
        multiple: false,
        onDrop: (filesUpload) => {
            const formData = new FormData();
            const token = process.env.CMS_TOKEN;

            const file = filesUpload[0];
            img = file;

            const reader = new FileReader();

            reader.onloadend = () => {
                const base64 = reader.result.split(",")[1];
                const url = 'data:image/png;base64,' + base64
                setFileUrl(url)
            };

            reader.readAsDataURL(file);
        },
    });

    const createEvent = async () => {

    if (files.length > 0 && fileUrl != "" && name != "" && date != "" && description != "") {

            const events = JSON.parse(JSON.stringify(props.stage.events));

            const event = {
                name: name,
                description: description,
                timestamp: date,
                userId: getJourneyId(),
                journeyId: getJourneyIdOld(),
                lat: document.getElementById("lat").value,
                lng: document.getElementById("lng").value
            };

            events.push(event)
            globalEvents = events;

            await fetch(`http://localhost:3000/api/event/add`, {//dodawanie
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(event),
            }).then((response) => response.json()).then((resp) => handleUploadImage(resp)).then(setTimeout(reloadPage, 1000));
            props.addEvent();

        }
    };


    return (<div className="box-create-stage">
            <div class="card-create-stage">
                <div class="card-body" style={{backgroundColor: "white"}}>
                    <form>
                        <div class="form-group">
                            {files.length == 0 ?
                                <IconButton onClick={open}>
                                    <input {...getInputProps()} />
                                    <CloudUploadIcon sx={{fontSize: 60}}/>
                                </IconButton>
                                :
                                <>
								<img src={fileUrl} />
								</>
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
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
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
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="lat"
                                placeholder="Latitude"
                                onChange={(e) => setLat(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="lng"
                                placeholder="Longitude"
                                onChange={(e) => setLng(e.target.value)}
                            />
                        </div>

                    </form>
                    <button className="button-create" onClick={createEvent}>CREATE EVENT</button>
                </div>
            </div>
        </div>

    );
};



const EditEvent = (props) => {
	
	console.log(props);

  const [name, setName] = useState(props.event.name);
  const [date, setDate] = useState((globalEvents.find((element) => element.name == props.event.name).timestamp));
  const [description, setDescription] = useState(props.event.description);
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState((globalEvents.find((element) => element.name == props.event.name).image_path));
  const [lat, setLat] = useState((globalEvents.find((element) => element.name == props.event.name).lat));
  const [lng, setLng] = useState((globalEvents.find((element) => element.name == props.event.name).lng));

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

  const editEvent = async (id) => {
  
    if (fileUrl != "" && name != "" && date != "" && description != "") {
      
	  const event = globalEvents.find((element) => element.name == props.event.name)
	  
	  
	 const localEvent = 
	 {
        name: name,
        description: description,
        timestamp: event.timestamp,
		userId: getJourneyId(),
		journeyId: getJourneyIdOld(),
		id: event.id,
		lat: document.getElementById("lat").value,
        lng: document.getElementById("lng").value
      };
	  
		
	 await fetch("http://localhost:3000/api/event/edit",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localEvent)
      }).then(()=>props.setEdit(false)).then(()=>reloadPage());
    }
  };


  return (
    <div className="box-edit-event">
    <div class="card-edit-event">
      <div class="edit-card-body">
          <div className="edit-card-header">
              <h3>Edit Event</h3>
          </div>
        <div>
        <div class="form-edit-group">
          {fileUrl == "" ?
            <IconButton onClick={open}>
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 60 }} />
            </IconButton>
            :
            <>
              <img src={(globalEvents.find(element => element.name==props.event.name)).image_path} />
            </>
          }
          </div>
          <div class="form-edit-group">
            <input
              type="text"
              class="form-control-name"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div class="form-edit-group">
            <input value={(globalEvents.find(element => element.name==props.event.name)).timestamp} type="date" class="form-control-date" id="end_date" onChange={(e) => setDate(e.target.value)}/>
          </div>
          <div class="form-edit-group">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} class="form-control-description" id="description" placeholder="Description" rows="3"></textarea>
          </div>
          <div className="form-group">
          <input
            value={(globalEvents.find(element => element.name==props.event.name)).lat}
            type="text"
            className="form-control"
            id="lat"
            placeholder="Latitude"
            onChange={(e) => setLat(e.target.value)}
            />
          </div>

          <div className="form-group">
          <input
            value={(globalEvents.find(element => element.name==props.event.name)).lng}
            type="text"
            className="form-control"
            id="lng"
            placeholder="Longitude"
            onChange={(e) => setLng(e.target.value)}
          />
          </div>
          <div>
            <Popup trigger={<button className="button-edit">EDIT LOCATION</button>}
                 position="right center"
                 modal
                 nested
                >
            {close => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="header"> Pick new location
                    </div>
                    
                    <div className="box-create-map">
                        <Map setCoords={setCoords} />
                    </div>
      
                </div>
            )}
          </Popup>
          </div>
        </div>
        <button className="button-edit" onClick={editEvent}>EDIT EVENT</button>
        <button className="button-edit" onClick={() => {
		  reloadPage();
          props.setEdit(false)
        }}>BACK</button>
      </div>
    </div>
    </div>
	
  );
};

const EventComponent = (props) => {
	const [edit, setEdit] = useState(false)

	console.log(props.event.id);

	return (
	<>
    {edit == false?
	
    <div className="event">
      <h1>{props.event.name}</h1>
      <img id="" src={(globalEvents.find(element => element.name==props.event.name)).image_path} />
      <h4>{props.event.date}</h4>
	  <h4 className="date-event">{props.event.timestamp}</h4>
        <div className="box-description">
      <span className="text-description">{props.event.description}</span>
        </div>

		<Link to={`/Sites/${props.event.id}`}>
			<button className="button-open" onClick={setCookie(getJourneyId)}>OPEN</button>
		</Link>
	

	  
	  <button className="button-open" onClick={()=>
	  {
		  
			const localEvent = {
				name: props.event.name,
				timestamp: props.event.timestamp,
				description: props.event.description,
				userId: getJourneyId(),
				journeyId: getJourneyIdOld(),
				image_path: document.getElementById(props.event.id).src,
				id: props.event.id,
				lat: props.event.lat,
				lng: props.event.lng,
			  };

			for(var i=0;i<props.globalEvents.length;i++)
			{
				if(props.globalEvents[i].name==localEvent.name)
				{
					props.globalEvents[i]=localEvent;
				}
			}
						
			setEdit(true);
	  }}>EDIT</button>
	  
		<button className="button-open" onClick={()=>
				{	
					var information = {
						id: props.ev.id
					}					
								
					fetch("http://localhost:5000/api/event/delete", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(information)//,
					}).then(setTimeout(reloadPage,500));
					
				}
			}>DELETE</button>
			
	  
    </div>
    :
    <EditEvent event={props.event} stage={props.stage} setStage={props.setStage} setEdit={setEdit} />
    }
    </>
  );
}

const Event = (props) => {
  let { id } = useParams();

  var [stage, setStage] = useState({
        name: "",
        description: "",
        initialDate: "",
        endDate: "",
        picturePath: '',
		userId: "",
        events: []
      });
	  
	var [events,setEvents]=useState([]);

  const [createEvent, setCreateEvent] = useState(false)

	var {resJ} = [];

  const addEvent = () => {
    setCreateEvent(0);
  };
  
useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/Events/"+getJourneyIdOld());//+"/"+id)//retrive
	  	  	  
		var imgs;
			  
      const resJson = await res.json();
	  
	  console.log(resJson);
	  console.log(getJourneyIdOld());
	  console.log(id);
	  
	  setEvents(resJson.events);
		globalEvents=resJson.events;
	  resJ=resJson.events;
	  
	  const resJourney = resJson;
	  var tmp={
        name: "",
        description: "",
        initialDate: "",
        endDate: "",
        picturePath: "",
		userId: "",
        events: resJ
      };
	  
	  var eventId=[];

	  eventId.push(getJourneyId());
	
	  
	  var imagePaths=setImgs(eventId).then(text=>{
			changeImgs(text);
		});
	  
      setStage(tmp);
    })();
  }, []);
  
console.log(globalEvents);

  return (
    <>
    {setCSS()}
      {createEvent == false ? 
      <>
		  <button className="button-add" onClick={() => setCreateEvent(1)}>CREATE EVENT</button>
		  <Link to={`/Stages/`+GetJourneyCookie()}>
			<button className="button-add">GO BACK</button>
		  </Link>
		  <div className="box-events">
			  <div className="events">
				  <br/>
				  <Swiper spaceBetween={50} slidesPerView={events.length == 1 ? 1: events.length == 2 ? 2: 3 }>
					{Array.from(globalEvents).map((event) => (
					  <SwiperSlide>
						<EventComponent event={event} globalEvents={globalEvents}/>
					  </SwiperSlide>
					))}
				  </Swiper>
				  
				</div>
			</div>
      </>
      :
	  <>
		  <AddEvent setStage={setStage} stage={stage} addEvent={addEvent} />
		  <div className="box-create-map">
			<Map setCoords={setCoords} />
		  </div>
	  </>
    }

    </>
  );
};

export default Event;
