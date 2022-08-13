import React, { Component } from 'react'; // React import
import { connect } from 'react-redux'; // Redux store provider
import { Nav, Container, Header, Content, Icon, Loader } from 'rsuite';
import { Route, Switch, NavLink, Redirect } from 'react-router-dom';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';

const News = (props) => {
	return <NewsFeed />;
};
export default News;
