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

var img;

function reloadPage()
{
	window.location.reload();
}

function changeImgs(imgs)
{
	var list = document.getElementsByClassName("journey");
	
	for(var i=0;i<imgs.length;i++)
	{
		list[i].childNodes[1].src=imgs[i].filename;
	}
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
      <img src={props.journey.image_path} />
  
      <h4 className="date-journey">{props.journey.initial_date} to {props.journey.end_date}</h4>
      <div className="box-description">
      <span className="text-description">{props.journey.description}</span>
      </div>
	  
      <Link to={`/journey/${props.journey.id}`}>
        <button className="button-open">OPEN</button>
      </Link>
	  
		<Link to={`/Journeys`}>
			<button className="button-open" onClick={()=>
				{
					console.log("edit");
				}
			}>EDIT</button>
		</Link>
	  
		<Link >
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
		</Link>
	  
    </div>
  
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
  const [journeys, setJourneys] = useState([]);
  const [id,setId] = useState(0);

  useEffect(() => {
		(async () => {
		const res = await fetch("http://localhost:5000/api/Journeys/"+getCookie());

		const resJson = await res.json();
		const resJourneys=resJson.journeys;

		setImgs("journey").then(text=>{
			changeImgs(text);
		});
		
		setJourneys(resJourneys);

    })();
  }, []);
  
  return (
    <>
	{setCSS()}
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
