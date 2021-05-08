import React from 'react';
import { Panel } from 'rsuite'
import { Link } from 'react-router-dom'

const ImgPanel = (props) => {
    return (
        <Panel style={{width: props.width, height: props.height, position: 'relative', float:'left', display:'inline-block', margin: '10px'}} boardered shaded bodyFill>
            <Link to={props.to}>
            <div className="container">
                <img src={props.img} className='image' height='100%' alt='Failed to load img' />             
            </div>
            </Link>
            <h6 style={{position: 'absolute', bottom: '25px', left: '15px', color:'white'}}>{props.title}</h6>
            <p style={{position: 'absolute', bottom: '10px', left: '15px', color:'white'}}>{props.body}</p>
        </Panel>
    );
}

export default ImgPanel;