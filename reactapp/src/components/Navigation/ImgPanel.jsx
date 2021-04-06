import React from 'react';
import { Panel } from 'rsuite'
import { Link } from 'react-router-dom'

const ImgPanel = (props) => {
    return (
        <Panel style={{width: props.width, height: props.height, position: 'relative', float:'left', display:'inline-block', margin: '10px'}} boardered shaded bodyFill>
            <Link to={props.to}>
            <div class="container">
                <img src={props.img} class='image' alt='Failed to load img' />
                <div class="middle">
                   <div class="text">John Doe</div>
                 </div>                
            </div>
            </Link>
            <h6 style={{position: 'absolute', bottom: '25px', left: '15px', color:'white'}}>{props.title}</h6>
            <p style={{position: 'absolute', bottom: '10px', left: '15px', color:'white'}}>{props.body}</p>
        </Panel>
    );
}


 
export default ImgPanel;