import React, { Component } from "react";
import { connect } from "react-redux";
import {
  FlexboxGrid,
  Loader,
  Panel,
  IconButton,
  Icon,
  Form,
  FormGroup,
  Button,
  ButtonToolbar,
  FormControl,
  ControlLabel,
  Divider,
  Content,
  Affix,
  Tag,
  Modal,
  Drawer,
  SelectPicker,
  Placeholder,
  Grid,
  Col,
  Row,
} from "rsuite";
import { getMyCharacter } from "../../redux/entities/characters";
import { assetLent, assetUpdated } from "../../redux/entities/assets";
import socket from "../../socket";
// import { playerActionsRequested } from "../../redux/entities/playerActions";
import PlaceholderParagraph from "rsuite/lib/Placeholder/PlaceholderParagraph";
import NavigationBar from "../Navigation/NavigationBar";

class MyCharacter extends Component {
  state = {
    formValue: {
      textarea: "",
    },
    memory: "",
    show: false,
    lending: null,
    target: null,
    characters: null,
    lendShow: false,
    unlend: false, // boolean for displaying the "unlend" modal
    unleanding: null, // what is being "Unlent"
  };

  componentDidMount = () => {
    const char = this.props.myCharacter;
    // console.log(this.props.character)
    if (char !== undefined) {
      const formValue = {
        textarea: char.standingOrders,
      };
      const characters = { ...this.props.characters };
      this.setState({ formValue, characters });
    }
  };

  componentDidUpdate = (prevProps) => {
	 if (this.props.playerCharacter !== prevProps.playerCharacter) {
		 const char = this.props.playerCharacter;
		 const formValue = {
			textarea: char.standingOrders,
		}
	 this.setState({ formValue });		
	 }
	}

  openAnvil(url) {
    const win = window.open(url, "_blank");
    win.focus();
  }

  showMemory = (memory) => {
    this.setState({ memory, show: true });
  };

  openLend = (lending) => {
    this.setState({ lending, lendShow: true });
  };

  closeLend = () => {
    this.setState({ lendShow: false });
  };

  openUnlend = (unleanding) => {
    this.setState({ unleanding, unlend: true });
  };

  render() {
    const playerCharacter = this.props.myCharacter;
    if (!this.props.login) {
      this.props.history.push("/");
      return <Loader inverse center content="doot..." />;
    }
    return (
      <Content style={{ overflow: "auto", height: "94vh", }}>
      <NavigationBar/>
        <Grid fluid>
          <Row>
            <Col xs={24} sm={24} md={8} className="gridbox">
              <div>
              <p>
                  <img
                    className="portrait"
                    src={`/images/${playerCharacter.characterName}.jpg`}
                    alt="Unable to load img"
                    width="95%"
                  />
                </p>
                <p>
                  <b>{playerCharacter.characterName}</b> {playerCharacter.tag}
                </p>
                <p>
                  <b>
                    World Anvil Link{" "}
                    <IconButton
                      onClick={() => this.openAnvil(playerCharacter.worldAnvil)}
                      icon={<Icon icon="link" />}
                      appearance="primary"
                    />
                  </b>
                </p>
                <p>
                  <b>Bio:</b> {playerCharacter.bio}
                </p>
                <Panel header="Standing Orders" style={{ width: "95%" }}>
                <Form
                  fluid
                  formValue={this.state.formValue}
                  onChange={(value) => this.setState({ formValue: value })}
                >
                  <FormGroup>
                    <ControlLabel></ControlLabel>
                    <FormControl
                      name="textarea"
                      componentClass="textarea"
                      placeholder="Orders for if you miss a turn..."
                    />
                  </FormGroup>
                  <FormGroup>
                    <ButtonToolbar>
                      <Button
                        appearance="primary"
                        onClick={() => this.handleStanding()}
                      >
                        Submit
                      </Button>
                    </ButtonToolbar>
                  </FormGroup>
                </Form>
              </Panel>
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} className="gridbox">
              <PlaceholderParagraph>Character shit goes here</PlaceholderParagraph>
            </Col>
            <Col xs={24} sm={24} md={8} className="gridbox">

            <Divider style={{ marginTop: "15px", marginBottom: "0px" }}>
                Assets
              </Divider>
              {playerCharacter.assets.filter(el => (el.type === 'Asset' || el.type === 'Wealth') && el.status.hidden !== true ).map((asset, index) => (
                <div key={index} style={{ paddingTop: "10px" }}>
                  {asset.uses > 0 && (
                    <React.Fragment>
                      <Affix>
                        {asset.status.lent && this.rednerHolder(asset)}
                        {!asset.status.lent && <Tag color="green">Ready</Tag>}
                      </Affix>
                      <Panel
                        style={{ backgroundColor: "#1a1d24" }}
                        shaded
                        header={asset.name}
                        bordered
                        collapsible
                      >
                        <FlexboxGrid>
                          <FlexboxGrid.Item colspan={20}>
                            <p>{asset.description}</p>
                          </FlexboxGrid.Item>
                          <FlexboxGrid.Item
                            style={{ textAlign: "center" }}
                            colspan={4}
                          >
                            {asset.status.lendable && !asset.status.lent && (
                              <Button
                                onClick={() => this.openLend(asset)}
                                appearance="ghost"
                                size="sm"
                              >
                                Lend
                              </Button>
                            )}
                            {asset.status.lendable && asset.status.lent && (
                              <Button
                                onClick={() => this.openUnlend(asset)}
                                appearance="ghost"
                                size="sm"
                              >
                                Un-Lend
                              </Button>
                            )}
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                        {asset.uses !== 999 && <p>Uses: {asset.uses}</p>}
                      </Panel>
                    </React.Fragment>
                  )}
                </div>
              ))} 
              <Divider style={{ marginBottom: "0px" }}>
                Traits
              </Divider>
              {playerCharacter.assets.filter(el => el.type === 'Trait' && el.status.hidden !== true).map((trait, index) => (
                <div key={index} style={{ paddingTop: "10px" }}>
                  {trait.uses >= 0 && ( // change this back to > 0
                    <React.Fragment>
                      <Panel
                        style={{ backgroundColor: "#1a1d24" }}
                        shaded
                        header={trait.name}
                        bordered
                        collapsible
                      >
                        <p>{trait.description}</p>

                        {trait.uses !== 999 && <p>Uses: {trait.uses}</p>}
                      </Panel>
                    </React.Fragment>
                  )}
                </div>
              ))}

              <Divider style={{ marginTop: "15px", marginBottom: "0px" }}>
                Bonds
              </Divider>
              {playerCharacter.assets.filter(el => el.type === 'Bond' && el.status.hidden !== true).map((bond, index) => (
                <div key={index} style={{ paddingTop: "10px" }}>
                  {bond.uses > 0 && (
                    <React.Fragment>
                      <Panel
                        style={{ backgroundColor: "#1a1d24" }}
                        shaded
                        header={bond.name}
                        bordered
                        collapsible
                      >
                        <p>{bond.description}</p>

                        {bond.uses !== 999 && <p>Uses: {bond.uses}</p>}
                      </Panel>
                    </React.Fragment>
                  )}
                </div>
              ))}

              <Divider style={{ marginTop: "15px", marginBottom: "0px" }}>Powers</Divider>
              {playerCharacter.assets.filter(el => el.type === 'Power' && el.status.hidden !== true).map((power, index) => (
                <div key={index} style={{ paddingTop: "10px" }}>
                  {power.uses >= 0 && ( // change this back to > 0
                    <React.Fragment>
                      <Panel
                        style={{ backgroundColor: "#1a1d24" }}
                        shaded
                        header={power.name}
                        bordered
                        collapsible
                      >
                        <p>{power.description}</p>

                        {power.uses !== 999 && <p>Uses: {power.uses}</p>}
                      </Panel>
                    </React.Fragment>
                  )}
                </div>
              ))}

             <Divider style={{ marginTop: "15px", marginBottom: "0px" }}>
                Borrowed Assets
              </Divider>
              {playerCharacter.lentAssets.map((borrowed, index) => (
                <div key={index} style={{ paddingTop: "10px" }}>
                  <Affix>
                    {borrowed.status.lent && this.findOwner(borrowed._id)}
                  </Affix>
                  <Panel shaded header={borrowed.name} bordered collapsible>
                    <p>{borrowed.description}</p>
                  </Panel>
                </div>
              ))}
            </Col>
          </Row>
        </Grid>
				
			<Modal backdrop="static"
			size='sm'
			show={this.state.unlend}
			onHide={() => this.setState({ unlend: false, unleanding: null })}>
				{this.state.unleanding && 
					<React.Fragment>
						<Modal.Body>
							{this.renderUnLendation()}
						</Modal.Body>	
						<Modal.Footer>
							<Button onClick={() => this.handleTakeback()} appearance="primary">
								Take it Back!
							</Button>
							<Button onClick={() => this.setState({ unlend: false, unleanding: null })} appearance="subtle">
								Cancel
							</Button>
						</Modal.Footer>											
					</React.Fragment>
				}
			</Modal>

			<Drawer
			show={this.state.lendShow}
			onHide={() => this.closeLend()}>
				<Drawer.Body>
					<SelectPicker placeholder="Select a Lending Target" onChange={(event) => this.setState({ target: event })} block valueKey='_id' labelKey='characterName' disabledItemValues={[playerCharacter._id]} data={this.props.characters}/>					
					{this.renderLendation()}
				</Drawer.Body>
			</Drawer>

      </Content>
    );
  }

  rednerHolder = (asset) => {
    let holder = this.props.characters.find((el) =>
      el.lentAssets.some((el2) => el2._id === asset._id)
    );
    if (!holder) holder = this.props.myCharacter;
    return <Tag color="violet">Lent to: {holder.characterName}</Tag>;
  };

  findOwner = (id) => {
    for (const character of this.props.characters) {
      if (
        character.assets.some((el) => el._id === id) ||
        character.traits.some((el) => el._id === id)
      ) {
        return <Tag color="blue">Borrowed from: {character.characterName}</Tag>;
      }
    }
    return <Tag color="blue">Borrowed from: ???</Tag>;
  };

  renderLendation = () => {
    if (this.state.target === null || this.state.target === undefined) {
      return (
        <Placeholder.Paragraph rows={15}>
          Awaiting Selection
        </Placeholder.Paragraph>
      );
    } else {
      const target = this.props.characters.find(
        (el) => el._id === this.state.target
      );
      return (
        <div>
          <Divider
            style={{ textAlign: "center", fontWeight: "bolder", fontSize: 20 }}
          >
            {target.characterName}, {target.tag}
          </Divider>
          <p>{target.bio}</p>
          <Divider></Divider>
          <p style={{ fontWeight: "bolder", fontSize: 20 }}>
            Are you sure you want to lend your '{this.state.lending.name}' to
            this person?{" "}
          </p>
          <Button
            onClick={() => this.handleSubmit()}
            disabled={
              this.state.target === null || this.state.target === undefined
            }
            appearance="primary"
          >
            Lend
          </Button>
        </div>
      );
    }
  };

  renderUnLendation = () => {
    if (this.state.unleanding === null) {
      return (
        <Placeholder.Paragraph rows={15}>
          Awaiting Selection
        </Placeholder.Paragraph>
      );
    } else {
      return (
        <p>
          Are you sure you want to take back your {this.state.unleanding.name}{" "}
          from {this.state.unleanding.currentHolder}?
        </p>
      );
    }
  };

  handleSubmit = async () => {
    const data = {
      id: this.state.lending._id,
      target: this.state.target,
      lendingBoolean: true,
      owner: this.props.myCharacter._id
    };
    
    socket.emit('assetRequest', 'lend',  data ); // new Socket event
    this.setState({ lending: null, target: null });
    this.closeLend();
  };

  handleTakeback = async () => {
    const holder = this.props.characters.find((el) =>
      el.lentAssets.some((el2) => el2._id === this.state.unleanding._id)
    );

    const data = {
      id: this.state.unleanding._id,
      target: holder._id,
      lendingBoolean: false,
      owner: this.props.myCharacter._id
    };
    socket.emit('assetRequest', 'lend',  data ); // new Socket event
    this.setState({ unlend: false });
  };

  handleStanding = async () => {
    const char = this.props.myCharacter;
    const data = {
      characterName: char.characterName,
      email: char.email,
      worldAnvil: char.worldAnvil,
      tag: char.tag,
      timeZone: char.timeZone,
      playerName: char.playerName,
      bio: char.bio,
      icon: char.icon,
      popSupport: char.popSupport,
      standing: this.state.formValue.textarea,
      id: char._id
  }
    socket.emit('characterRequest', 'modify', data ); // new Socket event
  };
}

const mapStateToProps = (state) => ({
  login: state.auth.login,
  user: state.auth.user,
  assets: state.assets.list,
  characters: state.characters.list,
  myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
});

const mapDispatchToProps = (dispatch) => ({
  updateAsset: (data) => dispatch(assetUpdated(data)),
  lendAsset: (data) => dispatch(assetLent(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCharacter);
