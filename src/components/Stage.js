import { useState, useEffect } from "react";
import "./Journey.css";
import { useKeenSlider } from "keen-slider/react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { v4 as uuid } from "uuid";

// Import Swiper styles
import "swiper/css";

import { useParams } from "react-router-dom";

const AddEvent = (props) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState("");

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
        const url = "data:image/png;base64," + base64;
        setFileUrl(url);
      };

      reader.readAsDataURL(file);
    },
  });

  const removeFiles = () => {
    setFiles([]);
  };

  const createEvent = async () => {
    
    if (
      files.length > 0 &&
      fileUrl != "" &&
      name != "" &&
      date != "" &&
      description != ""
    ) {

      const stage = JSON.parse(JSON.stringify(props.currentStage));
      const events = stage.events
      console.log("STAGES -> ", stage)
      console.log("Events ", events)

      const event = {
        name: name,
        description: description,
        date: date,
        picture: fileUrl,
        id: uuid(),
      };

      console.log("NEW EVENT ", event)

      stage.events.push(event)

      const oldStages = JSON.parse(JSON.stringify(props.journey.stages))
      const index = oldStages.findIndex((o) => o.id == stage.id)
      oldStages[index] = stage

      const newJourney = {
        name: props.journey.name,
        description: props.journey.description,
        endDate: props.journey.endDate,
        initialDate: props.journey.initialDate,
        picture: props.journey.picture,
        stages: oldStages,
        id: props.journey.id,
      };

      console.log("NOVA JORNADA - ", newJourney)

      await fetch(`http://localhost:3001/journeys/${props.journey.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJourney),
      });

      console.log('AQUI')

      props.addEvent();
      props.setJourney(newJourney);
      props.setCurrentStage(stage)
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
              {files.length == 0 ? (
                <IconButton onClick={open}>
                  <input {...getInputProps()} />
                  <CloudUploadIcon sx={{ fontSize: 60 }} />
                </IconButton>
              ) : (
                <>
                  <img src={fileUrl} />
                  <button onClick={removeFiles}>X</button>
                </>
              )}
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
              <input
                type="date"
                class="form-control-date"
                id="end_date"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div class="form-group">
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                class="form-control-description"
                id="description"
                placeholder="Description"
                rows="3"
              ></textarea>
            </div>
          </form>
          <button className="button-create" onClick={createEvent}>
            Create Stage
          </button>
        </div>
      </div>
    </div>
  );
};

const EditEvent = (props) => {
  const [name, setName] = useState(props.event.name);
  const [date, setDate] = useState(props.event.date);
  const [description, setDescription] = useState(props.event.description);
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState(props.event.picture);

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
        const url = "data:image/png;base64," + base64;
        setFileUrl(url);
      };

      reader.readAsDataURL(file);
    },
  });

  const removeFiles = () => {
    setFiles([]);
    setFileUrl("");
  };

  const editStage = async () => {
    if (fileUrl != "" && name != "" && date != "" && description != "") {
      console.log("PROPS -> ", props)
      const stage = JSON.parse(JSON.stringify(props.currentStage));
      const events = stage.events
      
      const event = {
        name: name,
        description: description,
        date: date,
        picture: fileUrl,
        id: props.event.id,
      };

      const eventIndex = events.findIndex((e) => e.id == props.event.id)
      events[eventIndex] = event

      const stages = JSON.parse(JSON.stringify(props.journey.stages));

      console.log('Stages -> ', stages)

      const index = stages.findIndex((s) => s.id == props.currentStage.id);

      const newStage = {
        name: name,
        description: description,
        date: date,
        picture: fileUrl,
        id: props.currentStage.id,
        events: events
      };

      stages[index] = newStage;

      const newJourney = {
        name: props.journey.name,
        description: props.journey.description,
        endDate: props.journey.endDate,
        initialDate: props.journey.initialDate,
        picture: props.journey.picture,
        stages: stages,
        id: props.journey.id,
      };

      await fetch(`http://localhost:3001/journeys/${props.journey.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJourney),
      });

      props.setJourney(newJourney);
      props.setEdit(false);
      props.setCurrentStage(newStage)      
    }
  };

  return (
    <div className="box-create-stage">
      <div class="card-create-stage">
        <div class="card-header">
          <h3>Editar Stage</h3>
        </div>
        <div class="card-body">
          <div>
            <div class="form-group">
              {fileUrl == "" ? (
                <IconButton onClick={open}>
                  <input {...getInputProps()} />
                  <CloudUploadIcon sx={{ fontSize: 60 }} />
                </IconButton>
              ) : (
                <>
                  <img src={fileUrl} />
                  <button onClick={removeFiles}>X</button>
                </>
              )}
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
                value={date}
                type="date"
                class="form-control-date"
                id="end_date"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div class="form-group">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                class="form-control-description"
                id="description"
                placeholder="Description"
                rows="3"
              ></textarea>
            </div>
          </div>
          <button className="button-create" onClick={editStage}>
            EDITAR Stage
          </button>
          <button
            className="button-create"
            onClick={() => {
              props.setEdit(false);
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

const Event = (props) => {
  const [edit, setEdit] = useState(false);

  return (
    <>
      {edit == false ? (
        <div className="stage">
          <h1 className="title-stage">{props.event.name}</h1>
          <img src={props.event.picture} />
          <h4 className="date-stage">{props.event.date}</h4>
          <div className="box-description">
            <span className="text-description">{props.event.description}</span>
          </div>
          <button onClick={() => props.deleteEvent(props.event.id)}>
            DELETE
          </button>
          <button onClick={() => setEdit(true)}>EDIT</button>
        </div>
      ) : (
        <EditEvent
          event={props.event}
          journey={props.journey}
          setJourney={props.setJourney}
          setEdit={setEdit}
          setCurrentStage={props.setCurrentStage}
          currentStage={props.currentStage}
        />
      )}
    </>
  );
};

const Stage = ({ props }) => {
  let { id, stageId } = useParams();

  const [journey, setJourney] = useState(undefined);
  const [currentStage, setCurrentStage] = useState(undefined)

  const [createEvent, setCreateEvent] = useState(false);

  const addEvent = () => {
    setCreateEvent(0);
  };

  const deleteEvent = async (id) => {
    const newEvents = currentStage.events.filter((s) => s.id != id);

    const newJourney = JSON.parse(JSON.stringify(journey));

    const index = newJourney.stages.findIndex((s) => s.id == stageId)

    newJourney.stages[index].events = newEvents 

    setJourney(newJourney);
    setCurrentStage(newJourney.stages[index])

    await fetch(`http://localhost:3001/journeys/${newJourney.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJourney),
    });
  };

  useEffect(() => {
    (async () => {
      //"http://localhost:3000/api/Stages/"+id
      //retrive
      const res = await fetch("http://localhost:3001/journeys");

      const resJson = await res.json();

      setJourney(Array.from(resJson).filter((j) => j.id == id)[0]);

      const item = Array.from(resJson).filter((j) => j.id == id)[0]

      const stage = item.stages.filter((s) => s.id == stageId)[0]
      setCurrentStage(stage)
    })();
  }, []);

  return (
    <>
      {createEvent == false ? (
        <div className="stage-page">
          <button className="button-add" onClick={() => setCreateEvent(true)}>
            ADD EVENT
          </button>
          <div className="box-stages">
            <Swiper spaceBetween={50} slidesPerView={3}>
              {currentStage?.events.map((event, index) => (
                <SwiperSlide key={index}>
                  <Event
                    setJourney={setJourney}
                    journey={journey}
                    deleteEvent={deleteEvent}
                    event={event}
                    currentStage={currentStage}
                    setCurrentStage={setCurrentStage}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      ) : (
        <AddEvent
          setJourney={setJourney}
          journey={journey}
          addEvent={addEvent}
          stageId={stageId}
          currentStage={currentStage}
          setCurrentStage={setCurrentStage}
        />
      )}
    </>
  );
};

export default Stage;
