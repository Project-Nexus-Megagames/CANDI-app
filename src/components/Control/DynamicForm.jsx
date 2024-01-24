import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Divider, Grid, GridItem, Input, VStack } from '@chakra-ui/react';
import InputNumber from '../Common/InputNumber';
import socket from '../../socket';

const DynamicForm = (props) => {
  const { selected, title } = props;
	const loggedInUser = useSelector((state) => state.auth.user);
  const [formMap, setFormMap] = useState([]); 
  const [formValue, setFormValue] = useState({}); // TODO: update with Faction tags
  const diabled = ['_id', '__v', 'model', 'submodel'];

  // dynamically create setFormMap and formValue. FormValue hold the edited state of the object being edited
  // formMap is used to .map() out the object using the renderSwitch() 
	useEffect(() => {
		if (selected) {
      let test = [];
      for (const el in selected) {
        test.push(el)
        // typeof selected[el] !== 'object'
        //   ? test.push(el)
        //   : console.log(el);
      }
      setFormMap(test)
      setFormValue(selected)
		}
	}, [selected]);

  const handleSubmit = () => {
    // console.log(formValue)
    socket.emit('request', { route: formValue.model.toLowerCase(), action: 'modify', data: { data: formValue, loggedInUser } });
  }
  
	const handleInput = (value, id) => {
    let temp = Array.isArray(formValue) ? [ ...formValue ] : { ...formValue };
		temp[id] = value;
    // console.log(temp)

    if (title) {
      // console.log(title)
      props.handleInput(temp, title)
    }
    else {
      setFormValue(temp);
    }
	};

  const renderSwitch = (el, index) => {
		switch (typeof formValue[el]) {
			case 'string':
				return (
					<div key={index}>
						<h5>{el}</h5>
						{!diabled.some((dis) => dis === el) && <Input              
							id={el}
							disabled={diabled.some((dis) => dis === el)}
							type="text"
							value={formValue[el]}
							name={el}
							label={el}
							placeholder={el}
							onChange={(value) => handleInput(value.target.value, el)}
						/>}
					</div>
				);
			case 'number':
				return (
					<div key={index}>
						<h5>{el} - number</h5>
						<InputNumber
							id={el}
							defaultValue={formValue[el]}
							name={el}
							label={el}
							placeholder={el}
							onChange={(value) => handleInput(parseInt(value), el)}
						/>
					</div>
				);
			default:
        // console.log(el)
        return(<div >
          <DynamicForm background={props.background + 111} selected={formValue[el]} title={el} handleInput={handleInput}/>
        </div>)
		}
	
  };

	return ( 
    <div style={{ background: `#${props.background}` }} >
        {title && <h5>Sub Object: {title}</h5>}
        {!title && <Button onClick={handleSubmit} variant={'solid'} colorScheme={'green'}  >Handle Submit</Button>}
        <Divider/>
        {selected._id}
      <VStack  divider={<Divider/>}>
        {formMap.filter(el => !diabled.some((dis) => dis === el)).map((el, index) => renderSwitch(el, index))}        
      </VStack>    
    </div>
	);
}

export default (DynamicForm);