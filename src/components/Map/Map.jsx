import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Icon, Loader, Sidebar, Divider } from 'rsuite';
import { useHistory } from 'react-router-dom';
import HexMap from './HexMap';
import { getMyLocations } from '../../redux/entities/locations';
import NavigationBar from '../Navigation/NavigationBar';

const Map = (props) => {
	const { locations, login, loading, unlockedLocations } = props;
	const defaultTerr = {
		name: 'Hover over territory to see details',
		description: '?????',
		currentOwner: '????????',
		influence: 0,
		coords: { x: 0, y: 0 }
	};
	const [value] = useState({
		scale: 1,
		translation: { x: 0, y: 0 }
	});
	const [territory, setTerritory] = useState(defaultTerr);
	const [setSelected] = useState(false);
	const [tab, setTab] = useState('info');
	const [setMission] = useState(undefined);
	const [setStart] = useState();

	const history = useHistory();

	//const width = 350; // window.innerHeight / 2.5;

	const clickHandlerer = (type, unit, coords) => {
		console.log(type);
		switch (type) {
			case 'Military':
				setSelected(unit);
				setStart(coords);
				setTerritory(false);
				break;
			case 'hex':
				const loc = locations.find(
					(el) => el.coords.x === coords.q && el.coords.y === coords.r
				);
				loc ? setTerritory(loc) : console.log('loc undefined');
				break;
			default:
				console.log(`${type} is BAD!!!`);
				break;
		}
	};

	const handleHover = (x) => {
		const loc = locations.find(
			// eslint-disable-next-line eqeqeq
			(el) => el.coords.x == x[0] && el.coords.y == x[1]
		);
		if (loc) {
			setTerritory(loc);
		} else {
			setTerritory({
				name: 'Undiscovered Territory',
				description: 'Here be Monsters...',
				currentOwner: value,
				influence: -999,
				coords: { x: parseInt(x[0]), y: parseInt(x[1]) }
			});
		}
	};

	const getHexId = (row, col) => {
		const Letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var letterIndex = parseInt(row);
		var letters = '';
		while (letterIndex > 25) {
			letters = [letterIndex % 26] + letters;
			letterIndex -= 26;
		}

		return `${Letters[letterIndex] + letters + (col + 1)}`;
	};

	const handleTab = (type) => {
		setTab(type);
		setMission(false);
		setTerritory(defaultTerr);
	};

	if (!login && !loading) {
		history.push('/');
		return <Loader inverse center content="doot..." />;
	}
	return (
		//
		<React.Fragment>
			<NavigationBar />
			<Container style={{ height: 'calc(100vh - 50px)' }}>
				<Content>
					<div style={{ width: '100%', height: '100%' }}>
						<HexMap
							handleHover={handleHover}
							handleClick={clickHandlerer}
							locations={unlockedLocations}
						/>
					</div>
				</Content>
				<Sidebar width={250} style={{ transition: '0.8s ease' }}>
					<div
						className="side-bar"
						style={{
							width: 250,
							minHeight: '100vh'
						}}
					>
						<button
							onClick={() => handleTab('info')}
							className="toggle-menu"
							style={{
								transform: `translate(${-20}px, ${100}px)`,
								backgroundColor: '#087ad1'
							}}
						>
							<Icon icon="info-circle" />
						</button>

						{tab === 'info' && (
							<div>
								{unlockedLocations.length}
								<h3>{territory.name}</h3>
								<Divider>
									{territory.coords ? (
										getHexId(territory.coords.x, territory.coords.y)
									) : (
										<b>Bad Coords</b>
									)}{' '}
									- ({territory.coords.x}, {territory.coords.y}){' '}
								</Divider>
								<p className="p-left">{territory.description}</p>
								<Divider>Unlocked By</Divider>
								{territory.unlockedBy &&
									territory.unlockedBy.map((el) => <div>{el.playerName}</div>)}
							</div>
						)}
					</div>
				</Sidebar>
			</Container>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => ({
	unlockedLocations: state.auth.character ? getMyLocations(state) : [],
	locations: state.locations.list,
	control: state.auth.control,
	characters: state.characters.list,
	login: state.auth.login,
	loading: state.auth.loading,
	user: state.auth.user
	// myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
