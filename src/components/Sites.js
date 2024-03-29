import React, { useState, useEffect } from "react";
import "./Sites.css";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import setImgs from "./setImgsInSites"
import { Link } from "react-router-dom";
import getJourneyId from "./getJourneyIdFromSites"
import { useParams } from "react-router-dom";
import axios from "axios";
import setCSS from "./setCSS";
import GetJourneyCookie from "./getJourneyCookie";
import GoogleMapsWith1Pin from "./GoogleMaps1Pin";
import Popup from 'reactjs-popup';

var globalSites = [0];
var img;

function reloadPage() {
	window.location.reload();
}

function changeImgs(imgs) {
	var list = document.getElementsByClassName("site");

	for(var i = 0; i < imgs.images.length; i++) {
		list[i].childNodes[0].childNodes[0].src = imgs.images[i];
		list[i].childNodes[0].childNodes[0].setAttribute('id', imgs.imgsIds[i]);
	}
}

function setCoords(lat, lng) {
	document.getElementById("lat").value = lat;
	document.getElementById("lng").value = lng;
}

function handleUploadImage(res)
{
	const IDCookie = document
		.cookie
		.split('; ')
		.find((row) => row.startsWith('user_id='))?.split('=')[1];

	if(isNaN(res.id))
	{
		console.log(res.id);
		return;
	}

	let data = new FormData();
	data.append('file', img);
	data.append('id', res.id);
	data.append('type', 'site');

	axios.post('http://localhost:5000/api/upload/image', data).then(response => {
		console.log(response);
	}).catch(error => {
		console.log(error);
	});
}

const AddSite = (props) => {

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

	const createSite = async () => {

		if(files.length > 0 && fileUrl != "" && description != "") {

			const sites = JSON.parse(JSON.stringify(props.event.events));

			const site = {
				description: description,
				eventId: getJourneyId(),
				images: fileUrl,
			};

			sites.push(site)
			globalSites = sites;

			await fetch(`http://localhost:3000/api/site/add`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(site),
			}).then((response) => response.json()).then((resp) => handleUploadImage(resp)).then(setTimeout(reloadPage, 1000));

		}
	};

	return ( <div className = "box-create-site">
		<div class = "card-create-site">
		<div class = "card-body-site"
		style = { { backgroundColor: "white" } }>
		<form>
		<div class = "form-group-sites"> {
			files.length == 0 ?
			<IconButton onClick = { open }>
			<input { ...getInputProps() }/>
			<CloudUploadIcon sx = { { fontSize: 150 } }/>
			</IconButton> :
			<>
			<img src = { fileUrl }/>
			</>
		} </div>
		<div class = "form-group-sites">
		<textarea class = "form-control-description"
		id = "description"
		rows = "3"
		value = { description } placeholder = "Description"
		onChange = {
			(e) => setDescription(e.target.value) }>
		</textarea>
		</div>
		</form>
		<button className = "button-create-site"
		onClick = { createSite }> CREATE SITE
		< /button>
		</div>
		</div>
		</div>
	);
};

const EditSite = (props) => {

	const [description, setDescription] = useState(props.site.description);
	const [files, setFiles] = useState([]);
	const [fileUrl, setFileUrl] = useState((globalSites.find((element) => element.name == props.site.name).images))

	const { fileRejections, getRootProps, getInputProps, open } = useDropzone({
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

	const editSite = async (id) => {

		if(fileUrl != "" && description != "") {

			const site = globalSites.find((element) => element.id == props.site.id)

			const localSite = {
				description: description,
				eventId: getJourneyId(),
				id: site.id,
			};

			await fetch("http://localhost:3000/api/site/edit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(localSite)
			}).then(() => props.setEdit(false)).then(() => reloadPage());
		}
	};

	return ( <div className = "box-edit-site">
		<div class = "card-edit-site">
		<div class = "edit-card-body">
		<div className = "edit-card-header">
		<h3> Edit Site </h3>
		</div>
		<div>
		<div class = "form-edit-group-site"> {

			fileUrl == "" ?
			<IconButton onClick = { open }>
			<input { ...getInputProps() }/>
			<CloudUploadIcon sx = { { fontSize: 60 } }/>
			</IconButton> :
			<>
			<img src = {
				(globalSites.find(element => element.id == props.site.id)).image_path }/>
			</>
		}
		</div>

		<div class = "form-edit-group-site">
		<textarea value = { description } onChange = {
			(e) => setDescription(e.target.value) } class = "form-control-description"
		id = "description"
		placeholder = "Description"
		rows = "3" >
		</textarea>
		</div>
		</div>
		<button className = "button-edit"
		onClick = { editSite }> EDIT SITE
		</button>
		<button className = "button-edit"
		onClick = {
			() => {
				reloadPage();
				props.setEdit(false)
			}
		}> BACK
		</button>
		</div>
		</div>
		</div>

	);
};

const Photo = (props) => {
	const [edit, setEdit] = useState(false)
	return (
		<> {
			edit == false ?
			<div>
			<img src = { props.image.image_path }/>
			<span className = "text-description" > { props.image.description }
			</span>

			<button className = "button-open"
			onClick = {
				() => {

					setEdit(true);
				}
			}> EDIT
			</button>

			<button className = "button-open"
			onClick = {
				() => {
					var information = {
						id: 20000
					}

					fetch("http://localhost:5000/api/site/delete", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(information)
					}).then(setTimeout(reloadPage, 500));

				}
			}> DELETE
			< /button>
			</div> :
			<EditSite site = { props.site } event = { props.event } setEvent = { props.setEvent } setEdit = { setEdit }/>
		}
		</>
	);
}

const SiteComponent = (props) => {
	const [edit, setEdit] = useState(false)

	return (
		<> {
			edit == false ?

			<div className = "site">
			<div>
			<img id = ""
			src = {
				(globalSites.find(element => element.name == props.site.name)).image_path }/>
			<div className = "box-description">
			<span className = "text-description" > { props.site.description } </span>
			</div>
			</div>
			<button className = "button-open"
			onClick = {
				() => {

					const localSite = {
						description: props.site.description,
						image_path: document.getElementById(props.site.id).src,
						id: props.site.id,
					};

					for(var i = 0; i < props.globalSites.length; i++) {
						if(props.globalSites[i].id == localSite.id) {
							props.globalSites[i] = localSite;
						}
					}

					setEdit(true);
				}
			}> EDIT
			< /button>

			<button className = "button-open"
			onClick = {
				() => {

					var information = {
						id: props.site.id
					}

					fetch("http://localhost:5000/api/site/delete", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(information)
					}).then(setTimeout(reloadPage, 500));

				}
			}> DELETE
			< /button>

			</div> :
			<EditSite site = { props.site } event = { props.event } setEvent = { props.setEvent } setEdit = { setEdit }/>
		}
		</>
	);
}

const Site = (props) => {
		let { id } = useParams();

		var [event, setEvent] = useState({
			name: "",
			description: "",
			timestamp: "",
			picturePath: "",
			userId: "",
			sites: [],
		});

		var [sites, setSites] = useState([]);

		const [createSite, setCreateSite] = useState(false)

		var { resJ } = [];
		const addSite = () => {
			setCreateSite(0);
		};

		useEffect(() => {
			(async () => {
				const res = await fetch("http://localhost:3000/api/Sites/" + id);
				const resJson = await res.json();

				setSites(resJson.sites);
				globalSites = resJson.sites;
				resJ = resJson.sites;

				var tmp = {
					name: "",
					description: "",
					initialDate: "",
					endDate: "",
					picturePath: "",
					userId: "",
					events: resJ
				};

				var siteId = [];

				siteId.push(getJourneyId());

				var imagePaths = setImgs(siteId).then(text => {
					changeImgs(text);
				});
				setEvent(tmp);
			})();
		}, []);

		return (
			<>
			{ setCSS() } {
				createSite == false ?
					<>
					<button className = "button-add" onClick = {() => setCreateSite(1) }> CREATE SITE
					< /button>
					<Popup trigger = {
						<button className = "button-add" > SHOW ON MAP </button>}
						position = "right center"
						modal
						nested>
						{
							close => (
								<div className = "modal">
								<button className = "close"
								onClick = { close }>
								&times;
								</button>
								<div className = "header"> Location of the event
								</div>
								<div id = "box-create-map">
								<GoogleMapsWith1Pin id = { getJourneyId() }/>
								</div>
								</div>
							)
						}
					</Popup>
						<Link to = { `/Events/` + GetJourneyCookie() }>
						<button className = "button-add"> GO BACK
						</button>
						</Link>

						<div className = "box-events">
						<div className = "events">
						<br/>
						<Swiper spaceBetween = { 50 } slidesPerView = { sites.length == 1 ? 1 : sites.length == 2 ? 2 : 3 }> {
							Array.from(globalSites).map((site) => (
								<SwiperSlide>
								<SiteComponent site = { site } globalSites = { globalSites }/>
								</SwiperSlide>
							))
						}
						</Swiper>

						</div>
						</div>
						</>:
							<>
							<div className = "center">
							<AddSite setEvent = { setEvent } event = { event } addSite = { addSite }/>
							</div>
							</>
					}
					</>
			);
		};
export default Site;