import { useState, useEffect } from "react";
import "./Journey.css";
import { useKeenSlider } from "keen-slider/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import getCookie from "./getCookie"
import getStageId from "./getJourneyId"
import getJourneyId from "./getJourneyIdFromStages"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import setImgs from "./setImgs"
import { Link } from "react-router-dom";
import MapSection from './Map'


import { useParams } from "react-router-dom";
import axios from "axios";

var globalStages=[0];
var img;

const location = {
  address: 'zadupie znane też jako AEi',
  lat: 50.288714,
  lng: 18.678154,
}//50.288714, 18.678154

const location2 = {
  address: 'kurde',
  lat: 50.188714,
  lng: 18.678154,
}//50.288714, 18.678154

function changeImgs(imgs)
{
	var list = document.getElementsByClassName("stage");
	//console.log(imgs);
	
	for(var i=0;i<imgs.length;i++)
	{
		list[i].childNodes[1].src=imgs[i].filename;
	}
}

function setCookie(journeyID)
{
	var days =1;
	var name='journey_id';
	var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + journeyID + expires + "; path=/";
}

function handleUploadImage(ev)
{
	console.log(getJourneyId());
	
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

const AddStage = (props) => {

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

  const createStage = async () => {
    
    if (fileUrl != "" && name != "" && date != "" && description != "") {
      
      const stages = JSON.parse(JSON.stringify(props.journey.stages));

	  handleUploadImage();

      const stage = {
        name: name,
        description: description,
        timestamp: date,
		userId: getJourneyId()
      };
	  
	  
	  

      stages.push(stage)
	  globalStages=stages;

      await fetch(`http://localhost:3000/api/stage/add`, {//dodawanie
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stage),
      });//.then(()=> handleUploadImage());
      props.addStage();
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
        <button onClick={handleUploadImage,createStage}>Create Stage</button>
      </div>
    </div>
  );
};

const Stage = (props) => {
  return (
    <div className="stage">
      <h1>{props.stage.name}</h1>
      <img src={props.stage.picture} />
      <h4>{props.stage.date}</h4>
	  <h4>{props.stage.timestamp}</h4>
      <span>{props.stage.description}</span>
	  <div onClick={setCookie(getJourneyId())}>
	  <Link to={`/stage/${props.stage.id}`}>
        <button className="button-open">OPEN</button>
      </Link>
	  </div>
    </div>
  );
};

const Journey = () => {
  let { id } = useParams();

  var [journey, setJourney] = useState({
        name: "cos",
        description: "cos",
        initialDate: "cos",
        endDate: "cos",
        picturePath: 'dupa',
		userId: "cos",
        stages: []
      });
	  
	var [stages,setStages]=useState([]);

  const [createStage, setCreateStage] = useState(false)

	var {resJ} = [];

  const addStage = () => {
    setCreateStage(0);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/Stages/"+id)//retrive
	  
	  
	  	  
      const resJson = await res.json()
	  
	  setStages(resJson.stages);
		globalStages=resJson.stages;
	  resJ=resJson.stages;
	  
	  const resJourney = resJson;
	  var tmp={
        name: "cos",
        description: "cos",
        initialDate: "cos",
        endDate: "cos",
        picturePath: 'cos',
		userId: "cos",
        stages: resJ
      };
	  
	  var imagePaths=setImgs('stage').then(text=>{
			changeImgs(text);
		});
	  
      setJourney(tmp);
    })();
  }, []);

  return (
    <>
      {createStage == false ? 
      <>
      Stages
      <button onClick={() => setCreateStage(true)}>Add Stage</button>
      <Swiper spaceBetween={50} slidesPerView={3}>
        {Array.from(globalStages).map((stage) => (
          <SwiperSlide>
            <Stage stage={stage} />
          </SwiperSlide>
        ))}
      </Swiper>
      </>
      :
      <AddStage setJourney={setJourney} journey={journey} addStage={addStage}/>
    }
    
	<div id="map">
    <MapSection location={location} loc2={location2} zoomLevel={17} />
	</div>
	</>
  );
};

export default Journey;
