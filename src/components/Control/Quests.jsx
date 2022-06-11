import React, { useEffect } from 'react';
import {
	Panel,
	FlexboxGrid,
	IconButton,
	Loader,
	Icon,
	ButtonGroup,
	ButtonToolbar
} from 'rsuite';
import {
	characterUpdated,
	getMyCharacter
} from '../../redux/entities/characters';
import { connect } from 'react-redux';
import NavigationBar from '../Navigation/NavigationBar';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';

const Quests = (props) => {
	useEffect(() => {}, []);

	if (!props.login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	} else
		return (
			<React.Fragment>
				<NavigationBar />
				<h3>Quests</h3>
				<div
					style={{
						border: '3px solid #00a0bd',
						borderRadius: '5px',
						width: '50vh'
					}}
				>
					<FlexboxGrid style={publicComm} align="middle" justify="start">
						<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
							{/* <Avatar circle size="md" src={`/images/${this.props.comment.commentor}.jpg`} alt="?" style={{ maxHeight: '50vh' }} /> */}
						</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={15}>
							<h5>Quest Name</h5>
							<p className="slim-text">quest desc</p>
						</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={4}>
							{true && (
								<ButtonToolbar>
									<ButtonGroup>
										<IconButton
											size="xs"
											onClick={() => this.setState({ commentEdit: true })}
											color="blue"
											icon={<Icon icon="pencil" />}
										/>
										<IconButton
											size="xs"
											onClick={() => this.setState({ deleteWarning: true })}
											color="red"
											icon={<Icon icon="trash2" />}
										/>
									</ButtonGroup>
								</ButtonToolbar>
							)}
						</FlexboxGrid.Item>
					</FlexboxGrid>

					<Panel
						shaded
						style={{
							padding: '0px',
							textAlign: 'left',
							backgroundColor: '#15181e',
							whiteSpace: 'pre-line'
						}}
					>
						<p>Quest main text</p>
					</Panel>

					{/* <Modal backdrop="static" size='sm' show={this.state.deleteWarning} onHide={() => this.setState({ deleteWarning: false })}>
							<Modal.Body>
								<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
									{'  '}
									Warning! Are you sure you want delete your Comment?
								<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
							</Modal.Body>
							<Modal.Footer>
								<Button onClick={() => this.handleDelete()} appearance="primary">
									I am Sure!
								</Button>
								<Button onClick={() => this.setState({ deleteWarning: false })} appearance="subtle">
									Nevermind
								</Button>
							</Modal.Footer>
						</Modal>	 */}

					{/* <Modal overflow
					style={{ width: '90%' }}
					size='md'
					show={this.state.commentEdit}
					onHide={() => this.setState({ commentEdit: false })}>
						<Modal.Header>
							<Modal.Title>Edit this comment</Modal.Title>
						</Modal.Header>
						<Modal.Body>
						<br></br>
							<form>
								Body
								<br/>
								{this.props.myCharacter.tags.some(el => el === 'Control') && <Toggle defaultChecked={this.state.private} onChange={()=> this.setState({ private: !this.state.private })} checkedChildren="Hidden" unCheckedChildren="Revealed" />}
								<textarea rows='6' defaultValue={this.props.comment.body} value={this.state.body} style={textStyle} onChange={(event)=> this.setState({body: event.target.value})}></textarea>
							</form>
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.props.comment ? this.handleEditSubmit() : this.handleSubmit()}  disabled={this.isDisabled()} appearance="primary">
								{this.state.body.length < 11 ? <b>Description text needs {11 - this.state.body.length} more characters</b> :

								<b>Submit</b>}
							</Button>
							<Button onClick={() => this.setState({ commentEdit: false })} appearance="subtle">
								Cancel
							</Button>
						</Modal.Footer>
					</Modal>					 */}
				</div>
			</React.Fragment>
		);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	assets: state.assets.list,
	login: state.auth.login,
	characters: state.characters.list,
	duck: state.gamestate.duck,
	mortalBonds: getMortalBonds(state),
	godBonds: getGodBonds(state),
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

const publicComm = {
	backgroundColor: '#00a0bd'
};

export default connect(mapStateToProps, mapDispatchToProps)(Quests);
