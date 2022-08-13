import React from "react";
import { connect } from 'react-redux'; // Redux store provider
import { Alert, Form, FormGroup, FormControl, Button, ButtonToolbar, SelectPicker, TreePicker, Input, Modal, Toggle, Divider } from "rsuite";
import { getMyCharacter } from "../../redux/entities/characters";
import socket from "../../socket";

class SubNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      article: {...this.props.article},
      data: [],
      preview: false
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  handleInput = (value, id) => {
    let article = this.state.article;
    article[id] = value;
    this.setState({ article });
  };

  handleSubmit = () => {
    // e.preventDefault(); // ????????
    let edit = this.props.edit;
		const data = { 
			id: this.state.article._id,
			article: this.state.article,
			publisher: this.props.myCharacter._id,
			// location: getLocation(),
			// headline: Same as old
			// body: Same as old
			// tags: Same as old
			// imageSrc: Same as old
		}
    try {
      if (!edit) {
				socket.emit('request', { route: 'article', action: 'post', data });
        // resArticle = await axios.put(`${gameServer}game/news/${this.state.article._id}`, this.state.article);
      } 
			else {
				socket.emit('request', { route: 'article', action: 'edit', data });
        // resArticle = await axios.post(`${gameServer}game/news`, this.state.article);
      }
      // this.setState({article: {
      //   publisher: this.props.team._id,
      //   agency: this.props.team.code,
      //   location: '',
      //   headline: '',
      //   body: '',
      //   tags: [],
      //   imageSrc: ''
      // }})
      // this.props.onClose();
    } catch (err) {
      Alert.error(`Failed to create news item - Error: ${err.message}`);
    }
  };


  handlePreview = (value) => { this.setState({preview: value})};

  getLocation = () => {
    if (typeof(this.state.article.location) === 'object') return this.state.article.location;
    if (typeof(this.state.article.location) === 'string') return this.state.article.location;
  };

  render() {
    const { body, headline, imageSrc  } = this.state.article;
    const location = this.getLocation() 
    let preview = this.state.preview;
    let disabled = body.length > 50 && headline.length > 10  ? false : true;

    return (
      <React.Fragment>
        <Modal.Header>
          <Modal.Title>
            {/* <TeamAvatar size={"sm"} code={this.props.team.code} /> */}
            { !preview && <span style={{verticalAlign: 'super'}}> Submit</span> }
            { preview && <span style={{verticalAlign: 'super'}}> {headline}</span> }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { !preview && <Form fluid>
          <FormGroup>
              <Input
                id="headline"
                type="text"
                value={headline}
                name="headline"
                label="Headline"
                placeholder="Enter your headline..."
                onChange={value => this.handleInput(value, "headline")}
              />
            </FormGroup>
            <FormGroup>
              {/* {this.props.team.type === 'Control' && 
                <SelectPicker
                  block
                  id="publisher"
                  data={this.props.teams}
                  labelKey="shortName"
                  valueKey="_id"
                  placeholder="Select Publisher..."
                  onChange={value => this.handleInput(value, "publisher")}
                /> } */}
                {/* <TreePicker
                  block
                  id="location"
                  value={location}
                  data={this.state.data}
                  labelKey='name'
                  valueKey='_id'
                  placeholder="Choose the Location..."
                  onChange={value => this.handleInput(value, "location")}
                /> */}
            </FormGroup>
            <FormGroup>
            <FormControl
              id="body"
              componentClass="textarea"
              placeholder="Write your article..."
              rows={10}
              name="body"
              value={body}
              onChange={value => this.handleInput(value, "body")}
            />
          </FormGroup>
          <FormGroup>
            <Input
              id="imageSrc"
              type="text"
              value={imageSrc}
              name="img"
              label="Image Source"
              placeholder="img"
              onChange={value => this.handleInput(value, "imageSrc")}
            />
          </FormGroup>
            <ButtonToolbar>
              <Button disabled={disabled} appearance="primary" onClick={this.handleSubmit}>
                {body.length < 50 ? <b>Body needs {50 - body.length} characters</b> : 
								headline.length < 10 ? <b>Healine needs {10 - headline.length} characters</b>  : 
								 
								<b>Submit</b>}
              </Button>
            </ButtonToolbar>
          </Form> }
          { preview && <span>
            {/* <p><b>Author:</b> {this.props.user} | <b>Publisher:</b> {this.props.team.name}</p>
            { typeof(location) === 'object' && <p>{location.dateline} - Turn</p> }
            { typeof(location) === 'string' && location !== undefined && <p>{this.props.sites.find(el => el._id === location).dateline} - Turn</p> } */}
            <Divider />
            <p>{body}</p>
          </span> }
        </Modal.Body>
        <Modal.Footer>
          <Toggle style={{float: 'right'}} onChange={this.handlePreview} size="md" checkedChildren="Edit Article" unCheckedChildren="Peview" />  
        </Modal.Footer>
      </React.Fragment>
    );
  }


}

const mapStateToProps = state => ({
  login: state.auth.login,
  user: state.auth.user.username,
  myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SubNews);
