let gameServer = 'http://localhost:5000/';

if (process.env.NODE_ENV === "production") {
	gameServer = 'https://candi.onrender.com/';
	// console.log(process.env)
}

export { gameServer };