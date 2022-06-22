const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports = async function DBH(dbpath)
{
	const db = await open({
		filename: dbpath,
		driver: sqlite3.Database
	});

	//db.on('trace', (data) =>
	//{
	//	console.log(data);
	//});

	return db;
}

//module.exports = DBH;