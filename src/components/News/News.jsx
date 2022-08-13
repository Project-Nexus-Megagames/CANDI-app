import React, { Component } from 'react'; // React import
import { connect } from 'react-redux'; // Redux store provider
import { Nav, Container, Header, Content, Icon, Loader } from 'rsuite';
import { Route, Switch, NavLink, Redirect } from 'react-router-dom';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';

const News = () => {
	const data = [
		{ id: '1', avatarUrl: '', name: 'John Doe', title: 'This is a test', date: 'August 8, 2022' },
		{ id: '2', avatarUrl: '', name: 'John Doe', title: 'This is a test', date: 'Augst 8, 2022' },
		{ id: '3', avatarUrl: '', name: 'Jane Doe', title: 'This is a test', date: 'August 7, 2022' }
	];

	return <NewsFeed data={data} />;
};
export default News;
