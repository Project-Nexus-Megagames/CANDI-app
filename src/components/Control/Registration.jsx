import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Content,
	Container,
	Sidebar,
	PanelGroup,
	Panel,
	Input,
	FlexboxGrid,
	List,
	Alert,
	SelectPicker,
	Button,
	Loader,
	Toggle
} from 'rsuite';
import socket from '../../socket';
import NavigationBar from '../Navigation/NavigationBar';

class Registration extends Component {
	state = {
		users: [],
		characters: [],
		filtered: [],
		unfiltered: [],
		selected: null,
		target: null,
		loading: true,
		britta: true
	};

	componentDidMount = async () => {
		try {
			const existingUsernames = [];
			for (const character of this.props.characters) {
				if (!existingUsernames.some((el) => el === character.username))
					existingUsernames.push(character.username);
			}
			const { data } = await axios.get(
				`https://nexus-central-server.herokuapp.com/api/users/`
			);

			const filteredUsers = [];
			for (const user of data) {
				if (!existingUsernames.some((el) => el === user.username))
					filteredUsers.push(user);
			}
			//	Alert.success('Asset Successfully Deleted');
			this.setState({
				unfiltered: data,
				filtered: filteredUsers,
				loading: false,
				users: data
			});
		} catch (err) {
			console.log(err);
			Alert.error(
				`Error: ${err.response.data ? err.response.data : err.response}`,
				5000
			);
		}
	};

	listStyle(item) {
		if (item === this.state.selected) {
			return { cursor: 'pointer', backgroundColor: '#212429' };
		} else return { cursor: 'pointer' };
	}

	render() {
		if (!this.props.login) {
			this.props.history.push('/');
			return <Loader inverse center content="doot..." />;
		}
		return (
			<React.Fragment>
				<NavigationBar />
				<Container>
					<Sidebar style={{ backgroundColor: 'black' }}>
						<PanelGroup>
							<Panel style={{ backgroundColor: '#000101' }}>
								<FlexboxGrid align="middle">
									<FlexboxGrid.Item colspan={12}>
										<Input
											onChange={(value) => this.filter(value)}
											placeholder="Search"
										></Input>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={12}>
										<Toggle
											checked={this.state.britta}
											onChange={() =>
												this.setState({ britta: !this.state.britta })
											}
											checkedChildren="Filtered"
											unCheckedChildren="Unfiltered"
										/>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</Panel>
							<Panel
								bodyFill
								style={{
									height: 'calc(100vh - 130px)',
									borderRadius: '0px',
									overflow: 'auto',
									scrollbarWidth: 'none',
									borderRight: '1px solid rgba(255, 255, 255, 0.12)'
								}}
							>
								{this.state.loading && <Loader />}
								{!this.state.loading && this.state.britta && (
									<List>
										{this.state.filtered
											.sort((a, b) => {
												// sort the catagories alphabetically
												if (a.name.first < b.name.first) {
													return -1;
												}
												if (a.name.first > b.name.first) {
													return 1;
												}
												return 0;
											})
											.map((user, index) => (
												<List.Item
													key={index}
													index={index}
													onClick={() => this.setState({ selected: user })}
													style={this.listStyle(user)}
												>
													<FlexboxGrid>
														<FlexboxGrid.Item
															colspan={16}
															style={{
																...styleCenter,
																flexDirection: 'column',
																alignItems: 'flex-start',
																overflow: 'hidden'
															}}
														>
															<b style={titleStyle}>
																{user.name.first} {user.name.last}
															</b>
															<b style={slimText}>{user.email}</b>
														</FlexboxGrid.Item>
													</FlexboxGrid>
												</List.Item>
											))}
									</List>
								)}
								{!this.state.loading && !this.state.britta && (
									<List>
										{this.state.unfiltered
											.sort((a, b) => {
												// sort the catagories alphabetically
												if (a.name.first < b.name.first) {
													return -1;
												}
												if (a.name.first > b.name.first) {
													return 1;
												}
												return 0;
											})
											.map((user, index) => (
												<List.Item
													key={index}
													index={index}
													onClick={() => this.setState({ selected: user })}
													style={this.listStyle(user)}
												>
													<FlexboxGrid>
														<FlexboxGrid.Item
															colspan={16}
															style={{
																...styleCenter,
																flexDirection: 'column',
																alignItems: 'flex-start',
																overflow: 'hidden'
															}}
														>
															<b style={titleStyle}>
																{user.name.first} {user.name.last}
															</b>
															<b style={slimText}>{user.email}</b>
														</FlexboxGrid.Item>
													</FlexboxGrid>
												</List.Item>
											))}
									</List>
								)}
							</Panel>
						</PanelGroup>
					</Sidebar>

					{this.state.selected && (
						<React.Fragment>
							<Content>
								<Panel
									style={{
										padding: '0px',
										textAlign: 'left',
										backgroundColor: '#15181e'
									}}
								>
									<h3 style={{ textAlign: 'center' }}>
										{' '}
										{this.state.selected.name.first}{' '}
										{this.state.selected.name.last}{' '}
									</h3>
									<h5 style={{ textAlign: 'center' }}>
										{' '}
										{this.state.selected.email}{' '}
									</h5>
									<b>Username: {this.state.selected.username} </b>
									<SelectPicker
										placeholder="Select a Character"
										onChange={(event) => this.setState({ target: event })}
										block
										valueKey="_id"
										labelKey="characterName"
										data={this.props.characters}
									/>
								</Panel>
								<Panel>
									<Button
										disabled={!this.state.target}
										onClick={() => this.handleReg()}
									>
										Register this Player!
									</Button>
								</Panel>
							</Content>
						</React.Fragment>
					)}
				</Container>
			</React.Fragment>
		);
	}

	filter = (fil) => {
		if (this.state.britta) {
			const existingUsernames = [];
			for (const character of this.props.characters) {
				if (!existingUsernames.some((el) => el === character.username))
					existingUsernames.push(character.username);
			}

			const filteredUsers = [];
			for (const user of this.state.users) {
				if (!existingUsernames.some((el) => el === user.username))
					filteredUsers.push(user);
			}
			const filtered = filteredUsers.filter(
				(user) =>
					user.name.first.toLowerCase().includes(fil.toLowerCase()) ||
					user.name.last.toLowerCase().includes(fil.toLowerCase()) ||
					user.email.toLowerCase().includes(fil.toLowerCase())
			);
			this.setState({ filtered });
		} else {
			const unfiltered = this.state.users.filter(
				(user) =>
					user.name.first.toLowerCase().includes(fil.toLowerCase()) ||
					user.name.last.toLowerCase().includes(fil.toLowerCase()) ||
					user.email.toLowerCase().includes(fil.toLowerCase())
			);
			this.setState({ unfiltered });
		}
	};

	handleReg = async () => {
		const data = {
			character: this.state.target,
			username: this.state.selected.username,
			playerName: this.state.selected.name.first,
			email: this.state.selected.email
		};
		try {
			socket.emit('request', { route: 'character', action: 'register', data });
			// await axios.patch(`${gameServer}api/characters/register`,  data );
			// Alert.success('User successfully given their character');
			this.setState({ selected: null, target: null });
		} catch (err) {
			console.log(err);
			Alert.error(`Error: ${err}`, 5000);
		}
	};
}

const styleCenter = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '60px'
};

const titleStyle = {
	whiteSpace: 'nowrap',
	fontWeight: 500,
	paddingLeft: 2
};

const slimText = {
	fontSize: '0.966em',
	color: '#97969B',
	fontWeight: 'lighter',
	paddingBottom: 5,
	paddingLeft: 2
};

const mapStateToProps = (state) => ({
	characters: state.characters.list,
	login: state.auth.login
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
