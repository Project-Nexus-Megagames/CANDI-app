import React from 'react'; // React import
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { Heading } from '@chakra-ui/react';

const body =
	'Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carro\
t cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chup\
s dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow.';

const News = () => {
	const data = [
		{ id: '1', avatarUrl: '', name: 'John Doe', title: 'This is a test', body: body, date: 'August 8, 2022', numberOfComments: 0 },
		{ id: '2', avatarUrl: '', name: 'John Doe', title: 'This is a test', body: body, date: 'Augst 8, 2022', numberOfComments: 1 },
		{ id: '3', avatarUrl: '', name: 'Jane Doe', title: 'This is a test', body: body, date: 'August 7, 2022', numberOfComments: 2 }
	];

	return (
		<React.Fragment>
			<NavigationBar />
			<Heading>News</Heading>
			<NewsFeed data={data} />
		</React.Fragment>
	);
};
export default News;
