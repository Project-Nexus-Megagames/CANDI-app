import React from 'react';
import { Panel } from 'rsuite'
import { Link } from 'react-router-dom'

const ImgPanel = (props) => {
    
    return (
        <div style={{ border: "5px solid #ff66c4", borderRadius: '10px', position: 'relative', float:'left', display:'inline-block', margin: '10px', height: '40vh', overflow: 'hidden' }}>
            <Link to={props.disabled ? '#' : props.to}>
            <div className="container">
                <img src={props.img} className={props.disabled ? 'image disabled' : 'image'} height='auto' alt='Failed to load img' />             
            </div>
            <h6 style={{position: 'absolute', bottom: '25px', left: '15px', color:'white'}}>{`${props.disabled ? '[DISABLED] ' : ''}${props.title}`}</h6>
            <p style={{position: 'absolute', bottom: '10px', left: '15px', color:'white', fontSize: '0.966em',}}>{props.body}</p>
            </Link>
        </div>
    );
}


export default ImgPanel;