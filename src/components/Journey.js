import { useState, useEffect } from "react";
import "./Journey.css";
import { useKeenSlider } from "keen-slider/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import { useParams } from "react-router-dom";
import axios from "axios";

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

  const createStage = async () => {
    
    if (fileUrl != "" && name != "" && date != "" && description != "") {
      
      const stages = JSON.parse(JSON.stringify(props.journey.stages));

      console.log("Stages Current", stages)

      const stage = {
        name: name,
        description: description,
        date: date,
        picture: fileUrl
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

      await fetch(`http://localhost:5000/journeys/${props.journey.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJourney),
      });

      props.addStage()
      props.setJourney(newJourney)
  
    }
  };
  function handleUploadImage(ev)
{
    const IDCookie = document
          .cookie
          .split('; ')
          .find((row) => row.startsWith('user_id='))?.split('=')[1];
    // console.log("handled");

    let data = new FormData();
    data.append('file', document.getElementById("image").files[0]);
    data.append('userID', IDCookie)

    axios.post('http://localhost:5000/api/upload/image', data).then(response => {
        console.log(response);
    }).catch(error => {
        console.log(error);
    });
}

  return (
    <div class="card-create-journey">
      <div class="card-header">
        <h3>Create Stage</h3>
      </div>
      <div class="card-body">
        <form>
        <div class="form-group">
          {files.length == 0 ?
            <IconButton onChange={handleUploadImage} onClick={open} >
              <input {...getInputProps()} />
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
        <button onClick={createStage}>Create Stage</button>
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
      <span>{props.stage.description}</span>
    </div>
  );
};

const Journey = () => {
  let { id } = useParams();

  const [journey, setJourney] = useState(undefined);

  const [createStage, setCreateStage] = useState(false)

  const addStage = () => {
    setCreateStage(0);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/Stages/"+id)//retrive
	  console.log(res);
      const resJson = await res.json()
      console.log("II", resJson)
      setJourney(Array.from(resJson).filter((j) => j.id == id)[0])
    })();
  }, []);

  return (
    <>
      {createStage == false ? 
      <>
      Stages
      <button onClick={() => setCreateStage(true)}>Add Stage</button>
      <Swiper spaceBetween={50} slidesPerView={3}>
        {journey?.stages.map((stage) => (
          <SwiperSlide>
            <Stage stage={stage} />
          </SwiperSlide>
        ))}
      </Swiper>
      </>
      :
      <AddStage setJourney={setJourney} journey={journey} addStage={addStage}/>
    }
    </>
  );
};

export default Journey;
