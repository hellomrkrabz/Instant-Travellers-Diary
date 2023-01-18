import { useState, useEffect } from "react";
import "./Journey.css";
import { useKeenSlider } from "keen-slider/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { v4 as uuid } from 'uuid';

// Import Swiper styles
import "swiper/css";

import { useParams } from "react-router-dom";

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

  console.log("JOURNEY ", props.journey)
  
  const createStage = async () => {
    
    if (files.length > 0 && fileUrl != "" && name != "" && date != "" && description != "") {
      
      const stages = JSON.parse(JSON.stringify(props.journey.stages));

      console.log("Stages Current", stages)
      console.log("ID", uuid())


      const stage = {
        name: name,
        description: description,
        date: date,
        picture: fileUrl,
        id: uuid(),
        events: []
      };

      stages.push(stage)

      const newJourney = {
        name: props.journey.name,
        description: props.journey.description,
        endDate: props.journey.endDate,
        initialDate: props.journey.initialDate,
        picture: props.journey.picture,
        stages: stages,
        id: props.journey.id
      }

      console.log("Stages Now", stages)

      await fetch(`http://localhost:3001/journeys/${props.journey.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJourney),
      });

      props.addStage()
      props.setJourney(newJourney)
  
    }
  };


  return (
    <div className="box-create-stage">
    <div class="card-create-stage">
      <div class="card-header">
        <h3>Create Stage</h3>
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
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div class="form-group">
            <input type="date" class="form-control-date" id="end_date" onChange={(e) => setDate(e.target.value)}/>
          </div>
          <div class="form-group">
            <textarea onChange={(e) => setDescription(e.target.value)} class="form-control-description" id="description" placeholder="Description" rows="3"></textarea>
          </div>
        </form>
        <button className="button-create" onClick={createStage}>Create Stage</button>
      </div>
    </div>
    </div>
  );
};

const EditStage = (props) => {

  const [name, setName] = useState(props.stage.name);
  const [date, setDate] = useState(props.stage.date);
  const [description, setDescription] = useState(props.stage.description);
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState(props.stage.picture)

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

  const editStage = async (id) => {
  
    if (fileUrl != "" && name != "" && date != "" && description != "") {
      
      const stages = JSON.parse(JSON.stringify(props.journey.stages));

      const index = stages.findIndex((s) => s.id == props.stage.id)

      const stage = {
        name: name,
        description: description,
        date: date,
        picture: fileUrl,
        id: props.stage.id,
        events: props.stage.events
      };

      stages[index] = stage

      const newJourney = {
        name: props.journey.name,
        description: props.journey.description,
        endDate: props.journey.endDate,
        initialDate: props.journey.initialDate,
        picture: props.journey.picture,
        stages: stages,
        id: props.journey.id
      }

      console.log("Stages Now", stages)

      await fetch(`http://localhost:3001/journeys/${props.journey.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJourney),
      });

      props.setJourney(newJourney)
      props.setEdit(false)
  
    }
  };


  return (
    <div className="box-create-stage">
    <div class="card-create-stage">
      <div class="card-header">
        <h3>Edit Stage</h3>
      </div>
      <div class="card-body">
        <div>
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
            <input value={date} type="date" class="form-control-date" id="end_date" onChange={(e) => setDate(e.target.value)}/>
          </div>
          <div class="form-group">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} class="form-control-description" id="description" placeholder="Description" rows="3"></textarea>
          </div>
        </div>
        <button className="button-create" onClick={editStage}>EDIT Stage</button>
        <button className="button-create" onClick={() => {
          props.setEdit(false)
        }}>Back</button>
      </div>
    </div>
    </div>
  );
};

const Stage = (props) => {

  const [edit, setEdit] = useState(false)

  return (
    <>
    {edit == false?
    <div className="stage">
      <h1 className="title-stage">{props.stage.name}</h1>
      <img src={props.stage.picture} />
      <h4 className="date-stage">{props.stage.date}</h4>
      <div className="box-description"> 
      <span className="text-description">{props.stage.description}</span>
      </div>
      <button onClick={() => props.deleteStage(props.stage.id)}>DELETE</button>
      <button onClick={() => setEdit(true)}>EDIT</button>
      <Link to={`/journey/${props.journey.id}/stages/${props.stage.id}`}>
        <button>OPEN</button>
      </Link>
    </div>
    :
    <EditStage stage={props.stage} journey={props.journey} setJourney={props.setJourney} setEdit={setEdit} />
    }
    </>
  );
};

const Journey = () => {
  let { id } = useParams();

  const [journey, setJourney] = useState(undefined);

  const [createStage, setCreateStage] = useState(false)

  const addStage = () => {
    setCreateStage(0);
  };

  const deleteStage = async (id) => {
    const newStages = journey.stages.filter((s) => s.id != id)
    
    const newJourney = JSON.parse(JSON.stringify(journey))
    newJourney["stages"] = newStages

    setJourney(newJourney)

    await fetch(`http://localhost:3001/journeys/${journey.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJourney),
      });
  }

  useEffect(() => {
    (async () => {

      //"http://localhost:3000/api/Stages/"+id
      //retrive
      const res = await fetch("http://localhost:3001/journeys")
	  console.log(res);
      const resJson = await res.json()
      console.log("II", resJson)
      setJourney(Array.from(resJson).filter((j) => j.id == id)[0])
    })();
  }, []);

  return (
    <>
      {createStage == false ? 
      <div className="stage-page">
      
      <button className="button-add" onClick={() => setCreateStage(true)}>ADD STAGE</button>
      <div className="box-stages">
      <Swiper spaceBetween={50} slidesPerView={3}>
        {journey?.stages.map((stage) => (
          <SwiperSlide>
            <Stage setJourney={setJourney} journey={journey} deleteStage={deleteStage} stage={stage} />
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      </div>
      :
      <AddStage setJourney={setJourney} journey={journey} addStage={addStage}/>
    }
    </>
  );
};

export default Journey;
