import { useState, useEffect } from "react";
import "./Stages.css";
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
import { useParams } from "react-router-dom";
import axios from "axios";
import setCSS from "./setCSS"

var globalStages=[0];
var img;
var isPublic = false;
var authorID ='';


function reloadPage()
{
	window.location.reload();
}

function changeImgs(imgs)
{
	var list = document.getElementsByClassName("stage");
	
	for(var i=0;i<imgs.images.length;i++)
	{
		list[i].childNodes[1].src=imgs.images[i];
		list[i].childNodes[1].setAttribute('id',imgs.imgsIds[i]);
	}
	
}

function setCookie()
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
    document.cookie = name + "=" + getJourneyId() + expires + "; path=/";
}

function getIDCookie() {
    const IDCookie = document
        .cookie
        .split('; ')
        .find((row) => row.startsWith('user_id='))?.split('=')[1];
    return IDCookie;
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
      }).then((response) => response.json()).then((resp)=> handleUploadImage(resp)).then(setTimeout(reloadPage,1000));
      props.addStage();  
    }
  };
 

return (
	<div className="box-create-journey">
    <div class="card-create-journey">
        <div class="card-body" style={{backgroundColor: "white"}}>
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
        </form>
        <button className="button-create" onClick={createStage}>CREATE STAGE</button>
      </div>
    </div>
    </div>
  );
};

const EditStage = (props) => {
	
  const [name, setName] = useState(props.stage.name);
  const [date, setDate] = useState((globalStages.find((element) => element.name == props.stage.name).timestamp));
  const [description, setDescription] = useState(props.stage.description);
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState((globalStages.find((element) => element.name == props.stage.name).image_path))
  const [price, setPrice] = useState(props.stage.price);

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

  const editStage = async (id) => {
  
    if (fileUrl != "" && name != "" && date != "" && description != "") {
      
	  const stage = globalStages.find((element) => element.name == props.stage.name)
	  
	  var localStage=
	{
		name:name,
		description:description,
		userId:stage.id,
		id:stage.id,
		timestamp:date,
		image_path:fileUrl,
		events:[],
		price: price,
	}
		
	 await fetch("http://localhost:3000/api/stage/edit",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localStage)
      }).then(()=>props.setEdit(false)).then(()=>reloadPage());
    }
  };


  return (
    <div className="box-edit-stage">
    <div class="card-edit-stage">
      <div class="card-body">
        <div className="card-header-stage">
            <h3>Edit Stage</h3>
        </div>
        <div>

        <div class="form-edit-group-stage">
          {fileUrl == "" ?
            <IconButton onClick={open}>
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 60 }} />
            </IconButton>
            :
            <>
              <img src={(globalStages.find(element => element.name==props.stage.name)).image_path} />
            </>
          }
          </div>
          <div class="form-edit-group-stage">
            <input
              type="text"
              class="form-control-name"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div class="form-edit-group-stage">
            <input value={(globalStages.find(element => element.name==props.stage.name)).timestamp} type="date" class="form-control-date" id="end_date" onChange={(e) => setDate(e.target.value)}/>
          </div>
          <div class="form-edit-group-stage">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} class="form-control-description" id="description" placeholder="Description" rows="3"></textarea>
          </div>
        </div>
        <button className="button-edit-stage" onClick={editStage}>EDIT STAGE</button>
        <button className="button-edit-stage" onClick={() => {
			reloadPage();
          props.setEdit(false)
        }}>BACK</button>
      </div>
    </div>
    </div>
  );
};

const Stage = (props) => {
	const [edit, setEdit] = useState(false)
	
	if (authorID == getIDCookie()) {
	
	
  return (
	<>
    {edit == false?
	
    <div className="stage">

      <h1>{props.stage.name}</h1>

      <img id="" src={(globalStages.find(element => element.name==props.stage.name)).image_path} />

      <h4 className="date-journey">{props.stage.timestamp}</h4>
	  <h4 className="price-journey">{props.stage.price}</h4>
      <div className="box-description">
      <span className="text-description">{props.stage.description}</span>
      </div>
	  
	  
	  <div >
	  <Link to={`/Events/${props.stage.id}`}>
        <button className="button-open" onClick={setCookie}>OPEN</button>
      </Link>
	  
	  <button className="button-open" onClick={()=>
	  {
			var localStage={
				name:props.stage.name,
				id:props.stage.id,
				timestamp:props.stage.timestamp,
				description:props.stage.description,
				image_path: document.getElementById(props.stage.id).src,
				price:props.stage.price,
				events:[],
			}

			for(var i=0;i<props.globalStages.length;i++)
			{
				if(props.globalStages[i].name==localStage.name)
				{
					props.globalStages[i]=localStage;
				}
			}
			
			setEdit(true);
	  }}>EDIT</button>
	  
		<button className="button-open" onClick={()=>
			{	
				var information = {
					id: props.stage.id
				}
							
				fetch("http://localhost:5000/api/stage/delete", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(information)//,
				}).then(setTimeout(reloadPage,500));
				
			}
		}>DELETE</button>
	  
	  </div>
    </div>
    :
    <EditStage stage={props.stage} journey={props.journey} setJourney={props.setJourney} setEdit={setEdit} />
    }
    </>
  );
	}else if (isPublic==true) {
    return (
        <>
                <div className="stage">

                    <h1>{props.stage.name}</h1>

                    <img id="" src={(globalStages.find(element => element.name == props.stage.name)).image_path}/>

                    <h4 className="date-journey">{props.stage.timestamp}</h4>
					<h4 className="price-event">{props.stage.price}</h4>
                    <div className="box-description">
                        <span className="text-description">{props.stage.description}</span>
                    </div>
                    <div>
                        <Link to={`/Events/${props.stage.id}`}>
                            <button className="button-open" onClick={setCookie}>OPEN</button>
                        </Link>

                    </div>
                </div>
        </>
    );
}
	
};

const Journey = () => {
  let { id } = useParams();

  var [journey, setJourney] = useState({
        name: "",
        description: "",
        initialDate: "",
        endDate: "",
        picturePath: "",
		userId: "",
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
	  
	  var imgs;
	  	  
      const resJson = await res.json();
	  
	  setStages(resJson.stages);
		globalStages=resJson.stages;
	  resJ=resJson.stages;
	  
	  const resJourney = resJson;
	  var tmp={
        name: "",
        description: "",
        initialDate: "",
        endDate: "",
        picturePath: "",
		userId: "",
        stages: resJ,
		price: "",
      };
	  
	  
	  var imagePaths=setImgs('stage').then(text=>{
			changeImgs(text);
		});
	  
      setJourney(tmp);
    })();
  }, []);
  
   useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/journey_info/"+getJourneyId())
      const resJson = await res.json();
      isPublic  = resJson.public;
      authorID = resJson.author_id;
    })();
  }, []);
if (authorID == getIDCookie()) {

  return (
    <>
    {setCSS()}
      {createStage == false ? 
      <>
      <button className="button-add" onClick={() => setCreateStage(1)}>ADD STAGE</button>
      <Link to={`/Journeys`}>
      <button className="button-add" onClick={() => setCreateStage(1)}>GO BACK</button>
      </Link>
      <div className="box-stages">
      <div className="stages">
      <br/>
      <Swiper spaceBetween={50} slidesPerView={stages.length == 1 ? 1: stages.length == 2 ? 2: 3 }>
        {Array.from(globalStages).map((stage) => (
          <SwiperSlide>
            <Stage stage={stage} globalStages={globalStages} />
          </SwiperSlide>
        ))}
      </Swiper>
	  
		</div>
		</div>
      </>
      :
      <AddStage setJourney={setJourney} journey={journey} addStage={addStage}/>
    
	}

    
	
	</>
  );
}else if (isPublic == true) {
    return (
        <>
            {setCSS()}
                <>
                    <Link to={`/Journeys`}>
                        <button className="button-add" onClick={() => setCreateStage(1)}>GO BACK</button>
                    </Link>
                    <div className="box-stages">
                        <div className="stages">
                            <br/>
                            <Swiper spaceBetween={50}
                                    slidesPerView={stages.length == 1 ? 1 : stages.length == 2 ? 2 : 3}>
                                {Array.from(globalStages).map((stage) => (
                                    <SwiperSlide>
                                        <Stage stage={stage} globalStages={globalStages}/>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                        </div>
                    </div>
                </>
        </>
    );
}
};

export default Journey;
