import React, { Component } from 'react'; // React import
import { connect } from 'react-redux'; // Redux store provider
import { Nav, Container, Header, Content, Icon, Loader } from 'rsuite';
import { Route, Switch, NavLink, Redirect } from 'react-router-dom';
import NewsFeed from './NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';


const News = (props) => {
	const [tab, setTab] = React.useState('feed');
	const url = props.match.path;

	if (!props.login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}
	else return (
		<Content>
      <NavigationBar />
      <NewsFeed 
				agency='All' 
				articles={ props.articles } 
			/>
		</Content>
	);
	
}

const mapStateToProps = state => ({
    login: state.auth.login,
    articles: state.articles.list,
});
  
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(News);
