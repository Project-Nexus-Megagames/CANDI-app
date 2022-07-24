import React, { Component } from "react"; // React import
import { connect } from 'react-redux'; // Redux store provider
import { Container } from "rsuite";
import { Panel, PanelGroup, IconButton, ButtonGroup, ButtonToolbar, Icon, Content, Sidebar, Modal } from "rsuite";
import { articleHidden } from "../../redux/entities/articles";
import socket from "../../socket";
import SubNews from "./SubNews";
import ViewArticle from "./ViewArticle";
const NewsFeed = (props) => {
	const [article, setArticle] = React.useState(props.articles[0]);
	const [filtered, setFiltered] = React.useState(props.articles);
	const [agencyFilter, setAgencyFilter] = React.useState([]);
	const [view, setView] = React.useState(false);
	const [editor, setEditor] = React.useState(false);
	const [edit, setEdit] = React.useState(false);

	/*
	Scott's TODO list:
	Fix comments looking dumb
	Add more reactions (flags, dislike, alien, ect)
	Add in filtering based on published/hidden booleans
	change user from username to player's actual name or in-game title
	Figure out AvatarIcons and how to use user to get proper flag
	*/
	
    
    const buttonTxt = true === 'Media' ? 'Draft new Article' : 'Draft new Press Release';
    const dummyArticle = {
      location: '',
      headline: '',
      body: '',
      tags: [],
      imageSrc: ''
    }

		const handleEdit = (arti) => {
			setEditor(true);
			setEdit(true);
			setArticle(arti);
		}

		const handleOpen = (arti) => {
			setView(true);
			setArticle(arti);
		}

		const handleThis = () => {
			setEditor(true);
			setEdit(false);
			setArticle(dummyArticle);
		}

		const handleHide = (article) => {
			props.hideArticle(article);
			socket.emit('request', { route: 'article', action: 'delete', data: { id: article._id } });
		}

    return (
      <Container>
        <Content>
          {props.articles.length === 0 ? <h5>No articles published</h5> : null }
          {props.articles.length > 0 ? <PanelGroup>
          {props.articles.map(article => (
              <Panel
                key={article._id}
                header={
                  <span>
                    {/* <TeamAvatar size={"sm"} code={article.agency} /> */}
                    <h5 style={{marginLeft:'10px', display: 'inline', verticalAlign:'super'}}>{article.headline}</h5>
                    <ButtonToolbar style={{float: 'right'}}>
                      <ButtonGroup>
                        {true ? <IconButton icon={<Icon icon="edit" />} onClick={() => handleEdit(article)} /> : null}
                        {/* <IconButton icon={<Icon icon="eye-slash" />} onClick={() => props.hideArticle(article)} /> */}
                        <IconButton icon={<Icon icon="trash" />} onClick={() => handleHide(article)} color="red"/>
                      </ButtonGroup>
                      <IconButton icon={<Icon icon="file-text" />} onClick={() => handleOpen(article)} color="green">Open Article</IconButton>
                    </ButtonToolbar>
                  </span>}
                bordered
              >
                <p>{article.articleBody}</p>
              </Panel>
          ))}
        </PanelGroup> : null}
        </Content>
        <Sidebar>
          <IconButton block icon={<Icon icon='file-text' />} onClick={() => handleThis()}>{buttonTxt}</IconButton>
        </Sidebar>
         <Modal overflow edit={edit} size='lg' show={editor} onHide={() => setEditor(false)}>
          {article && <SubNews edit={edit} article={article} onClose={() => setEditor(false)} />}
        </Modal>
        
        <Modal overflow size='lg' show={view} onHide={() => setView(false)}>
          {article && <ViewArticle id={article._id} articles={props.articles} user={props.user} onClose={() => setView(false)} />}
        </Modal>
      </Container>
    );
  
}

const mapStateToProps = state => ({
  login: state.auth.login,
	user: state.auth.user.username,
  articles: state.articles.list.slice().sort((a, b) => new Date(b.date) - new Date(a.date)),
  lastFetch: state.articles.lastFetch
});

const mapDispatchToProps = dispatch => ({
  hideArticle: article => dispatch(articleHidden(article))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);

