import React from 'react'; // React import
import NewsFeed from '../Common/NewsFeed';

import NavigationBar from '../Navigation/NavigationBar';

const News = () => {
	const data = [
		{ id: '1', avatarUrl: '', name: 'John Doe', title: 'This is a test', date: 'August 8, 2022', numberOfComments: 0 },
		{ id: '2', avatarUrl: '', name: 'John Doe', title: 'This is a test', date: 'Augst 8, 2022', numberOfComments: 1 },
		{ id: '3', avatarUrl: '', name: 'Jane Doe', title: 'This is a test', date: 'August 7, 2022', numberOfComments: 2 }
	];

	return (
		<React.Fragment>
			<NavigationBar />
			<NewsFeed data={data} />
		</React.Fragment>
	);
};
export default News;
