Presc = function(){};

Presc = function(path = '')
{

	var prescriptions_tbl = 'prescriptions_tbl';
	var dbpath = path;

	this.listAll = async () =>
	{
		var sql = `SELECT * FROM ${prescriptions_tbl}
					ORDER BY id DESC `;

		const db = await DBH(dbpath);
		const stmt = await db.prepare(sql);
		var results = await stmt.all();

		return results;
	}

	this.info = async (id) =>
	{
		var sql = `SELECT * FROM ${prescriptions_tbl}
					WHERE id = ? `;

		const db = await DBH(dbpath);
		const stmt = await db.prepare(sql);
		var results = await stmt.get([id]);

		return results;
		console.log(results);
	}

	this.deleteById = async (id) =>
	{
		var sql = `DELETE FROM ${prescriptions_tbl}
					WHERE id = ? `;

		const db = await DBH(dbpath);
		const stmt = await db.prepare(sql);
		var results = await stmt.run([id]);

		return results;
	}

}

module.exports = Presc;