import React from 'react';
import { Panel } from 'rsuite'
import { Link } from 'react-router-dom'

const ImgPanel = (props) => {
    
    return (
        <Link to={props.disabled ? '#' : props.to}>
        <div style={{ border: "5px solid #d4af37", width: '90%', borderRadius: '10px', position: 'relative', margin: '10px', height: props.height ? props.height: '44vh', overflow: 'hidden' }}>
            
            <div className="container">
                <img src={props.img} className={props.disabled ? 'image disabled' : 'image'} height='auto' alt='Failed to load img' />             
            </div>
            <h6 style={{position: 'absolute', bottom: '25px', left: '15px', color:'white', background: '#663300', }}>{`${props.disabled ? '[DISABLED] ' : ''}${props.title}`}</h6>
            <p style={{position: 'absolute', bottom: '10px', left: '15px', color:'white', background: '#663300', fontSize: '0.966em',}}>{props.body}</p>
            
        </div>
        </Link>
    );
}


export default ImgPanel;