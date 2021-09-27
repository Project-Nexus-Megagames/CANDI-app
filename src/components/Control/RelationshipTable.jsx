import React, { useEffect } from 'react';
import { Icon, IconButton, FlexboxGrid, Button, Table, Modal, Form, FormGroup } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { signOut } from '../../redux/entities/auth';
import { getGods, getNonPlayerCharacters, getPlayerCharacters } from '../../redux/entities/characters';
import { getGodBonds } from '../../redux/entities/assets';
import ModifyResource from './ModifyResource';
import AddAsset from '../OtherCharacters/AddAsset';
// import socket from '../../socket';

const { Column, HeaderCell, Cell } = Table;

const Navigation = props => {
	const [god, setGod] = React.useState(null);
	const [bonder, setBonder] = React.useState(null);  
	const [bond, setBond] = React.useState(null);

	const history = useHistory();

	// useEffect(() => {
	// 	renderTime(props.gamestate.endTime);
	// 	setInterval(() => {
	// 		renderTime(props.gamestate.endTime);
    //     //clearInterval(interval);
    // }, 60000);
	// }, [props.gamestate.endTime]);

    const hitMe = (god, bonder) => {
        setBonder(bonder);
        setGod(god);
    }

    const onBondClick = (bond) => {
        setBond(bond);
    }
	
  return (
      <React.Fragment>
        <Table style={{ textAlign: 'center' }} autoHeight data={props.playerCharacters} dataKey={'playerName'}>
            <Column flexGrow={1}>
                <HeaderCell>Name</HeaderCell>
                <Cell dataKey="characterName" />
            </Column>
            {props.godCharacters.map((god, data) => {
            console.log(data)
            return (
                <Column flexGrow={1}>
                <HeaderCell>{god.characterName}</HeaderCell>
                <TableStuff  verticalAlign='middle' god={god} onBondClick={onBondClick} onClick={hitMe} godBonds={props.godBonds} dataKey="characterName"/>
                </Column>
                );
            })}
        </Table>     

        {bonder && god && <AddAsset 
        	show={god && bonder}
            character={bonder}
            god={god}
            closeModal={() => setGod(false)}/>}

        {bond && <ModifyResource show={bond} bond={bond}
			closeModal={() => setBond(null)}/>}
      </React.Fragment>

	);
}

const TableStuff = ({ rowData, god, onClick, onBondClick, ...props }) => {
	// console.log(rowData._id)
	// console.log(god.characterName)
	const bond = props.godBonds.find(el => (el.with === god._id && el.ownerCharacter === rowData._id ))
	// console.log(bond)
    console.log(props.godBonds)
	if (bond)
		return (<Cell verticalAlign='middle' {...props}><b style={{ cursor: 'pointer' }} onClick={() => onBondClick && onBondClick(bond)}>{bond.level}</b>  </Cell>)
	else	
		return (<Cell verticalAlign='middle' {...props}><b style={{ cursor: 'pointer' }} onClick={() => onClick && onClick(god, rowData)}>No Bond Exists!</b></Cell>)
	  
}


const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	nonPlayerCharacters: getNonPlayerCharacters(state),
    playerCharacters: getPlayerCharacters(state),
	godCharacters: getGods(state),
	godBonds: getGodBonds(state),
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);

