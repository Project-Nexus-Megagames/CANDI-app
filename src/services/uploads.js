import axios from 'axios'
const API_URL = "http://localhost:5000"

const cloudinaryUpload = (fileToUpload) => {
    return axios.post(API_URL + '/api/imageUpload', fileToUpload)
    .then(res => res.data)
    .catch(err => console.log(err))
}

export default cloudinaryUpload