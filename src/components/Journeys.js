import React, { useEffect, useState } from "react";
import "./Journeys.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import getCookie from "./getCookie"
import axios from "axios";
//import dump from "./DUMP.json"
//import dump2 from "./DUMP2.json"

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
        initialDate: dateInit,
        endDate: dateEnd,
        picturePath: 'dupa',
		userId: getCookie(),
        stages: [],
      };

	const arr=Array.from(newJourneys);
	arr.push(journey);
  
  //newJourneys.push(journey);
      //Array.from(newJourneys).push(journey);
      //http://localhost:3000/api/journey/add
      //localhost:3001/journeys
      await fetch("http://localhost:5000/api/journey/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journey)//,
		//userId:getCookie
      });

      props.setCreateJourney(0);
      //props.setJourneys(newJourneys);
      props.setJourneys(arr);
    }
  };

  return (<div className="box-create-journey">
    <div class="card-create-journey">
      <div class="card-header">
        <h3>Create Journey</h3>
      </div>
      <div class="card-body">
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


const Journey = (props) => {
  const [showStages, setShowStages] = useState(false);

  return (
  
    <div className="journey">
      <h1 className="title-journey">{props.journey.name}</h1>
      <img src={props.journey.picture} />
  
      <h4 className="date-journey">{props.journey.initialDate} to {props.journey.endDate}</h4>
      <div className="box-description">
      <span className="text-description">{props.journey.description}</span>
      </div>
      <Link to={`/journey/${props.journey.id}`}>
        <button className="button-open">OPEN</button>
      </Link>
    </div>
  
  );
};

function func(f)
{
	for(var i=0;i<f.lenght;i++)
	{
		return(
		<SwiperSlide>
			<Journey journey={f[i]} />
		</SwiperSlide>
		)
	}
}

function parseJSON(props) {
  JSON.stringify(props.journeys.name)
  JSON.stringify(props.journeys.description)
  JSON.stringify(props.journeys.initialDate)
  JSON.stringify(props.journeys.endDate)
}

function Journeys() {
  const [createJourney, setCreateJourney] = useState(0);
  const [journeys, setJourneys] = useState([]);
  
//###########################################################################################
//Tutaj pobieramy dane z backu i to chyba musi być json, albo chociaż string
//###########################################################################################

  useEffect(() => {
    (async () => {
      //"http://localhost:3000/api/Journeys/"+getCookie()
      const res = await fetch("http://localhost:5000/api/Journeys/"+getCookie());
	 
      const resJson = await res.json();
	  const resJourneys=resJson.journeys;
	  
	  //console.log(resJson);
		//var resJson = dump;

      setJourneys(resJourneys);
	  //setJourneys(JSON.parse(JSON.stringify(dump)));
	//console.log({journeys});
    })();
  }, []);
  
  console.log("tukej");
  console.log(journeys);

  return (
    <>
      {createJourney == 0 ? (
        <>
          
          <button className="button-add" onClick={() => setCreateJourney(1)}>ADD JOURNEYS</button>
         
          <div className="box-journeys">
          <div className="journeys">
            <Swiper spaceBetween={50} slidesPerView={journeys.length == 1 ? 1: journeys.length == 2 ? 2: 3 }>
             {
				  Array.from(journeys).map((journey) => (
                <SwiperSlide>
				
                  <Journey journey={journey} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          </div>
        </>
      ) : (
        <AddJourney
          setJourneys={setJourneys}
          journeys={journeys}
          setCreateJourney={setCreateJourney}
          
        />
        
      )}
    </>
  );
}

export default Journeys;
