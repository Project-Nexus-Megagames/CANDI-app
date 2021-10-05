import React, { useEffect } from 'react';
import { Icon, IconButton, FlexboxGrid, Button, Table, Modal, Form, FormGroup, Toggle } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { signOut } from '../../redux/entities/auth';
import { getGods, getNonPlayerCharacters, getPlayerCharacters } from '../../redux/entities/characters';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';
import ModifyResource from './ModifyResource';
import AddAsset from '../OtherCharacters/AddAsset';
// import socket from '../../socket';

const { Column, HeaderCell, Cell } = Table;

const Navigation = props => {
	const [god, setGod] = React.useState(null);
	const [bonder, setBonder] = React.useState(null);  
	const [bond, setBond] = React.useState(null);

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
        <Table style={{ textAlign: 'center' }} height={500} virtualized data={props.playerCharacters} cellBordered dataKey={'playerName'}>
            <Column minWidth={150} fixed flexGrow={4}>
                <HeaderCell>Name</HeaderCell>
                <Cell dataKey="characterName" />
            </Column>
            {props.data.map((god, data) => {
            return (
                <Column minWidth={100} flexGrow={2}>
                <HeaderCell>{god.characterName}</HeaderCell>
                <TableStuff  verticalAlign='middle' god={god} onBondClick={onBondClick} onClick={hitMe} mortalBonds={props.mortalBonds} godBonds={props.godBonds} dataKey="characterName"/>
                </Column>
                );
            })}
        </Table>     

        {bonder && god && <AddAsset 
        	show={god && bonder}
            character={bonder}
            god={god}
            godData={props.godData}
            closeModal={() => setGod(false)}/>}

        {bond && <ModifyResource show={bond} bond={bond}
			closeModal={() => setBond(null)}/>}
      </React.Fragment>

	);
}

const TableStuff = ({ rowData, god, onClick, onBondClick, ...props }) => {
	let bond = props.godBonds.find(el => (el.with === god._id && el.ownerCharacter === rowData._id ));
    !bond ? bond = props.mortalBonds.find(el => (el.with === god._id && el.ownerCharacter === rowData._id )) : console.log('hi');
	// console.log(bond)
    // console.log(props.godBonds)
	if (bond)
		return (<Cell verticalAlign='middle' {...props}><b style={{ cursor: 'pointer' }} onClick={() => onBondClick && onBondClick(bond)}>{bond.level}</b>  </Cell>)
	else	
		return (<Cell verticalAlign='middle' {...props}><b style={{ cursor: 'pointer' }} onClick={() => onClick && onClick(god, rowData)}>-</b></Cell>)
	  
}


const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
    playerCharacters: getPlayerCharacters(state),
	godBonds: getGodBonds(state),
    mortalBonds: getMortalBonds(state),
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);

