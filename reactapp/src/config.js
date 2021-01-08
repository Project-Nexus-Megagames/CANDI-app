let gameServer = 'http://localhost:5000/';

if (process.env.NODE_ENV === "production") {
	gameServer = 'https://afterlife-server.herokuapp.com/';
	console.log(process.env)
}

export { gameServer };