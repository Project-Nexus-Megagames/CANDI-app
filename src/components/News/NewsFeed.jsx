import React, { Component } from "react"; // React import
import { connect } from 'react-redux'; // Redux store provider
import { Button, CheckPicker, Col, Container, FlexboxGrid, Grid, Header, Input, InputGroup, Popover, Row, SelectPicker, TagPicker, Tooltip, Whisper } from "rsuite";
import { Panel, PanelGroup, IconButton, ButtonGroup, ButtonToolbar, Icon, Content, Sidebar, Modal } from "rsuite";
import { articleHidden } from "../../redux/entities/articles";
import socket from "../../socket";
import Article from "./Article";
import SubNews from "./SubNews";
import ViewArticle from "./ViewArticle";
const NewsFeed = (props) => {
	const [article, setArticle] = React.useState(props.articles[0]);
	const [filter, setFilter] = React.useState('');
	const [agencyFilter, setAgencyFilter] = React.useState([]);
  const [show, setShow] = React.useState(false);
	const [view, setView] = React.useState(false);
	const [editor, setEditor] = React.useState(false);
	const [edit, setEdit] = React.useState(false);
	const [tags, setTags] = React.useState(['Military', 'Aircraft', 'Facilities', 'Upgrades', 'Sites', 'Satellites' ]);

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
        <Header>
			  <FlexboxGrid justify="center" align="middle">
          <FlexboxGrid.Item colspan={4}>
            <InputGroup >
								<Input style={{ width: '80%' }} onChange={(value)=> setFilter(value)} placeholder="Search"></Input>
                <Button
                  style={{ color: 'black', borderRadius: '0px' }}
                  color="green"
                  onClick={() => handleThis()}
                >
                  <Icon icon="plus" />
                </Button>

                <Whisper delay={100} placement="top" speaker={(<Popover>Filter</Popover>)} trigger="hover">
						    	<IconButton color='violet' onClick={() => setShow(show === 'filter' ? false : 'filter')}  icon={<Icon icon='filter' />} ></IconButton>
					    	</Whisper> 
					    	{show === 'filter' && 
                  <TagPicker 
                    style={{ borderRadius: '0px', }}
                    menuStyle={{ }}
                    defaultExpandAll
                    data={tags}
                    defaultValue={tags}
                    placeholder="Set Filters"
                    valueKey='value'
                    onChange={(tags) => setTags(tags)}
                  />}							
							</InputGroup>            
          </FlexboxGrid.Item>
				</FlexboxGrid>
			</Header>

        <Content >
        
          {props.articles.length === 0 ? <h5>No articles published</h5> : null }

            <FlexboxGrid justify="center" >
              <FlexboxGrid.Item colspan={20}>
                {props.articles.map(article => (
                  <div>
                    <Article article={article}/>
                  </div>
                ))}       
              </FlexboxGrid.Item>
     
            </FlexboxGrid>

          {props.articles.length > 0 ? <div>

        </div> : null}
        </Content>

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

