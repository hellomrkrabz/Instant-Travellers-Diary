import React, { useEffect, useState } from "react";
import "./Journeys.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import getCookie from "./getCookie"
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

  const removeFiles = () => {
    setFiles([])
  }

  const createJourney = async () => {

    if (files.length > 0 && fileUrl != "" && name != "" && dateInit != "" && dateEnd != "" && description != "") {
      const newJourneys = JSON.parse(JSON.stringify(props.journeys));

      const journey = {
        name: name,
        description: description,
        initialDate: dateInit,
        endDate: dateEnd,
        picture: fileUrl,
        stages: [],
      };

	/*const arr=Array.from(newJourneys);
	arr.push(journey);
  */
  newJourneys.push(journey);
      //Array.from(newJourneys).push(journey);
      //http://localhost:3000/api/journey/add
      //localhost:3001/journeys
      await fetch("http://localhost:3001/journeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journey),
		userId:getCookie
      });

      props.setCreateJourney(0);
      props.setJourneys(newJourneys);
      /*props.setJourneys(arr);*/
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
            <>
            <img src={fileUrl} />
            <button onClick={removeFiles}>X</button>
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

const EditJourney = (props) => {
  const [name, setName] = useState(props.journey.name);
  const [dateInit, setDateInit] = useState(props.journey.initialDate);
  const [dateEnd, setDateEnd] = useState(props.journey.endDate);
  const [description, setDescription] = useState(props.journey.description);
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState(props.journey.picture)

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

  const removeFiles = () => {
    setFiles([])
    setFileUrl("")
  }

  const editJourney = async () => {
    
    // console.log("NAME ", name)
    // console.log("END ", dateEnd)
    // console.log("INIT", dateInit)
    // console.log("URL", fileUrl)
    // console.log("DESCRIPTION", description)

    if (fileUrl != "" && name != "" && dateInit != "" && dateEnd != "" && description != "") {
      let newJourneys = JSON.parse(JSON.stringify(props.journeys));

      const index = newJourneys.findIndex((j) => j.id == props.journey.id)      
      
      const journey = {
        name: name,
        description: description,
        initialDate: dateInit,
        endDate: dateEnd,
        picture: fileUrl,
        stages: props.journey.stages,
      };

      console.log("NEW ", journey)
      console.log("INDEX ", index)
    
      newJourneys[index] = journey

      await fetch("http://localhost:3001/journeys/"+props.journey.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journey)
      });
      props.setJourneys(newJourneys);
      props.setEdit(false)
      /*props.setJourneys(arr);*/
    }
  };

  return (<div className="box-create-journey">
    <div class="card-create-journey">
      <div class="card-header">
        <h3>Editar jornada</h3>
      </div>
      <div class="card-body">
        <form>
          
          <div class="form-group">
          {fileUrl == "" ?
            <IconButton onClick={open}>
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 60 }} />
            </IconButton>
            :
            <>
            <img src={fileUrl} />
            <button onClick={removeFiles}>X</button>
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
        <button className="button-create" onClick={editJourney}>Editar Jornada</button>
        <button className="button-create" onClick={() => {
          setName("")
          setDateInit("")
          setDateEnd("")
          setFileUrl("")
          setFiles([])
          setDescription("")
          props.setEdit(false)
        }}>Back</button>
      </div>
    </div>
    </div>
  );
};

const Journey = (props) => {
  const [edit, setEdit] = useState(false);

  const deleteJourney = async (id) => {

    await fetch(`http://localhost:3001/journeys/${id}`, {
        method: "DELETE"
      });

    props.deleteJourney(id)
  }

  return (
    <>
    {edit == false ? 
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
      <button onClick={() => deleteJourney(props.journey.id)}>DELETE</button>
      <button onClick={() => setEdit(true)}>EDIT</button>
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

function Journeys() {
  const [createJourney, setCreateJourney] = useState(0);
  const [journeys, setJourneys] = useState([]);
  
  const deleteJourney = (id) => {
    const newJourneys = journeys.filter((j) => j.id != id)
    setJourneys(newJourneys)
  }

//###########################################################################################
//Tutaj pobieramy dane z backu i to chyba musi być json, albo chociaż string
//###########################################################################################

  useEffect(() => {
    (async () => {
      //"http://localhost:3000/api/Journeys/"+getCookie()
      const res = await fetch("http://localhost:3001/journeys");
	 
      const resJson = await res.json();
		//var resJson = dump;
      setJourneys(resJson);
	  //setJourneys(JSON.parse(JSON.stringify(dump)));
	//console.log({journeys});
    })();
  }, []);
  
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
				
                   <Journey  journeys={journeys} setJourneys={setJourneys} journey={journey} deleteJourney={deleteJourney} />
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


//// yarn run json-server --port 3001 journey.json