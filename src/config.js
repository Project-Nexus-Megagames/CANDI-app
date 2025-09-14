let gameServer = 'http://localhost:5000/';

if (process.env.NODE_ENV === "production") {
	gameServer = 'https://candi-server-5fla.onrender.com';
	// console.log(process.env)
}

export { gameServer };