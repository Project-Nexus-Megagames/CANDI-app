import React, { useState } from 'react';
import cloudinaryUpload from '../../services/uploads';

function FileUploadTest() {
	const [imageURL, setImageURL] = useState('');
	const handleFileUpload = async (e) => {
		const uploadData = new FormData();
		uploadData.append('file', e.target.files[0], 'file');
		const img = await cloudinaryUpload(uploadData);
		setImageURL(img.secure_url);
	};

	const renderImage = () => {
		return <img src={imageURL}></img>;
	};

	return (
		<div>
			<div style={{ margin: 10 }}>
				<label style={{ margin: 10 }}>Cloudinary:</label>
				<input type="file" onChange={(e) => handleFileUpload(e)} />
			</div>
			<div>
				<p>test</p>
				{renderImage()}
			</div>
		</div>
	);
}

export default FileUploadTest;
