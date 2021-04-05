import React from 'react';
import { Panel } from 'rsuite'
import { Link } from 'react-router-dom'

const ImgPanel = (props) => {
    return (
        <Panel style={{width: props.width, height: props.height, position: 'relative', float:'left', display:'inline-block', margin: '10px'}} boardered shaded bodyFill>
            <Link to={props.to}>
                <img src={props.img} style={{width: '100%'}} alt='Failed to load img' />
            </Link>
            <h6 style={{position: 'absolute', bottom: '25px', left: '15px', color:'white'}}>{props.title}</h6>
            <p style={{position: 'absolute', bottom: '10px', left: '15px', color:'white'}}>{props.body}</p>
        </Panel>
    );
}
 
export default ImgPanel;