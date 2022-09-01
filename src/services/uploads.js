import axios from 'axios'
const API_URL = "http://localhost:5000"
import { gameServer } from "../../config";

const cloudinaryUpload = (fileToUpload) => {
    return axios.post(API_URL + `${gameServer}api/imageUpload`, fileToUpload)
    .then(res => res.data)
    .catch(err => console.log(err))
}

const cloudinaryUploadSmall = (fileToUpload) => {
	return axios.post(API_URL + `${gameServer}api/imageUpload/small`, fileToUpload)
	.then(res => res.data)
	.catch(err => console.log(err))
}

const cloudinaryUploadMedium = (fileToUpload) => {
	return axios.post(API_URL + `${gameServer}api/imageUpload/medium`, fileToUpload)
	.then(res => res.data)
	.catch(err => console.log(err))
}

const cloudinaryUploadLarge = (fileToUpload) => {
	return axios.post(API_URL + `${gameServer}api/imageUpload/large`, fileToUpload)
	.then(res => res.data)
	.catch(err => console.log(err))
}

export {cloudinaryUpload, cloudinaryUploadSmall, cloudinaryUploadMedium, cloudinaryUploadLarge}