import { useState, useEffect } from "react";
import "./Journey.css";
import { useKeenSlider } from "keen-slider/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import getCookie from "./getCookie"
import getStageId from "./getJourneyIdFromEvents"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import setImgs from "./setImgs"
import { Link } from "react-router-dom";
import getJourneyId from "./getJourneyIdv2"

import { useParams } from "react-router-dom";
import axios from "axios";

var globalEvents=[0];
var img;

function changeImgs(imgs)
{
	var list = document.getElementsByClassName("stage");
	
	for(var i=0;i<imgs.length;i++)
	{
		list[i].childNodes[1].src=imgs[i].filename;
	}
}

function handleUploadImage(ev)
{
	
    const IDCookie = document
          .cookie
          .split('; ')
          .find((row) => row.startsWith('user_id='))?.split('=')[1];
  
    let data = new FormData();
    data.append('file', img);
    data.append('id', getJourneyId());
	data.append('type','stage');

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

  const createEvent = async () => {
    
    if (fileUrl != "" && name != "" && date != "" && description != "") {
      
      const events = JSON.parse(JSON.stringify(props.stage.events));

	  handleUploadImage();

      const event = {
        name: name,
        description: description,
        timestamp: date,
		userId: getStageId(),
		journeyId: getJourneyId()
      };
	  
	  
	  

      events.push(event)
	  globalEvents=events;

      await fetch(`http://localhost:3000/api/event/add`, {//dodawanie
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      props.addEvent();
	   window.location.reload();
  
    }
  };
 

  return (
    <div class="card-create-journey">
      <div class="card-header">
        <h3>Create Stage</h3>
      </div>
      <div class="card-body">
        <form>
        <div class="form-group">
          {files.length == 0 ?
            <IconButton onClick={open} >
              <input type="file" id="image"{...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 40 }} />
            </IconButton>
            :
            <img src={fileUrl} />
          }
          </div>
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              id="name"
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div class="form-group">
            <input type="date" class="form-control" id="end_date" onChange={(e) => setDate(e.target.value)}/>
          </div>
          <div class="form-group">
            <textarea onChange={(e) => setDescription(e.target.value)} class="form-control" id="description" rows="3"></textarea>
          </div>
        </form>
        <button onClick={handleUploadImage,createEvent}>Create Event</button>
      </div>
    </div>
  );
};

const event = (props) => {//to byl stage
  return (
    <div className="event">
      <h1>{props.event.name}</h1>
      <img src={props.event.picture} />
      <h4>{props.event.date}</h4>
	  <h4>{props.event.timestamp}</h4>
      <span>{props.event.description}</span>
	  <Link to={`/event/${props.event.id}`}>
        <button className="button-open">OPEN</button>
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
        picturePath: 'dupa',
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
      const res = await fetch("http://localhost:3000/api/Events/"+id)//retrive
	  
	  console.log(res);
	  	  
      const resJson = await res.json()
	  
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
	  
	  var imagePaths=setImgs('stage').then(text=>{
			changeImgs(text);
		});
	  
      setStage(tmp);
    })();
  }, []);
  
  console.log(globalEvents);

  return (
    <>
      {createEvent == false ? 
      <>
      Events
      <button onClick={() => setCreateEvent(true)}>Add Event</button>
      <Swiper spaceBetween={50} slidesPerView={3}>
        
      </Swiper>
      </>
      :
	  <AddEvent setStage={setStage} stage={stage} addEvent={addEvent}/>
      
    }
    </>
  );
};

export default Event;