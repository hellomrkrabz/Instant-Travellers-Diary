import { useState, useEffect } from "react";
import "./Stage.css";
import { useKeenSlider } from "keen-slider/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import getCookie from "./getCookie"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import setImgs from "./setImgsInEvents"
import { Link } from "react-router-dom";
import getJourneyId from "./getJourneyIdFromEvents"
import getJourneyIdOld from "./getJourneyIdv2"
import Map from "./GoogleMapsWithCoords"

import { useParams } from "react-router-dom";
import axios from "axios";
import setCSS from "./setCSS";

var globalEvents=[0];
var img;

function reloadPage()
{
	window.location.reload();
}

function changeImgs(imgs)
{
	var list = document.getElementsByClassName("event");
	
	for(var i=0;i<imgs.length;i++)
	{
		list[i].childNodes[1].src=imgs[i];
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

        if (fileUrl != "" && name != "" && date != "" && description != "") {

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
                                <img src={fileUrl}/>
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


const EventComponent = (props) => {//to byl stage
  return (
    <div className="event">
      <h1>{props.ev.name}</h1>
      <img src={props.ev.picture} />
      <h4>{props.ev.date}</h4>
	  <h4 className="date-event">{props.ev.timestamp}</h4>
        <div className="box-description">
      <span className="text-description">{props.ev.description}</span>
        </div>

	  
	  <Link to={`/Event/`}>
			<button className="button-open" onClick={()=>
				{
					console.log("edit");
				}
			}>EDIT</button>
		</Link>
	  
		<Link>
			<button className="button-open" onClick={()=>
				{	
					var information = {
						id: props.ev.id
					}
					
					console.log(props.ev.id);
					
								
					fetch("http://localhost:5000/api/event/delete", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(information)//,
					}).then(setTimeout(reloadPage,500));
					
				}
			}>DELETE</button>
		</Link>
	  
    </div>
  );
};

const Event = () => {
  let { id } = useParams();

  var [stage, setStage] = useState({
        name: "cos",
        description: "cos",
        initialDate: "cos",
        endDate: "cos",
        picturePath: 'coscos',
		userId: "cos",
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
		
      const res = await fetch("http://localhost:3000/api/Events/"+getJourneyIdOld()+"/"+id)//retrive
	  	  	  
      const resJson = await res.json();
	  
	  setEvents(resJson.events);
		globalEvents=resJson.events;
	  resJ=resJson.events;
	  
	  const resJourney = resJson;
	  var tmp={
        name: "cos",
        description: "cos",
        initialDate: "cos",
        endDate: "cos",
        picturePath: 'cos',
		userId: "cos",
        events: resJ
      };
	  

	  var events=resJourney.events;
	  var eventId=[];

	  eventId.push(getJourneyId());
	  
	  console.log(eventId);
	  
	  
	  var imagePaths=setImgs(eventId).then(text=>{
			changeImgs(text);
		});
	  
      setStage(tmp);
    })();
  }, []);
  

  return (
    <>
    {setCSS()}
      {createEvent == false ? 
      <>
      <button className="button-add" onClick={() => setCreateEvent(1)}>CREATE EVENT</button>
      <div className="box-events">
      <div className="events">
      <br/>
      <Swiper spaceBetween={50} slidesPerView={events.length == 1 ? 1: events.length == 2 ? 2: 3 }>
        {Array.from(globalEvents).map((event2) => (
          <SwiperSlide>
            <EventComponent ev={event2} />
          </SwiperSlide>
        ))}
      </Swiper>
            </div>
            </div>
      </>
      :
	  <>
	  <AddEvent setStage={setStage} stage={stage} addEvent={addEvent}/>
	  <div className="box-create-map">
      <Map setCoords={setCoords} />
      </div>
	  </>
    }

    </>
  );
};

export default Event;
