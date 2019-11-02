'use strict'

const path = require('path')
const fs = require('fs')
const SQL = require('sql.js')
const database = path.join(__dirname, 'db', 'percakapan.db');

let _rowsFromSqlDataObject = function (object)
{
	let data = {}
	let i = 0
	let j = 0
	
	for (let valueArray of object.values)
	{
		data[i] = {}
		j = 0
		
		for (let column of object.columns)
		{
			Object.assign(data[i], {[column]: valueArray[j]})
			j++
		}
		i++
	}
	return data
}

SQL.dbOpen = function (databaseFileName)
{
	try
	{
		return new SQL.Database(fs.readFileSync(databaseFileName))
	}
	catch (error)
	{
		console.log("Can't open database file.", error.message)
		return null
	}
}

SQL.dbClose = function (databaseHandle, databaseFileName)
{
	try
	{
		let data = databaseHandle.export()
		let buffer = Buffer.alloc(data.length, data)
		fs.writeFileSync(databaseFileName, buffer)
		databaseHandle.close()
		return true
	}
	catch (error)
	{
		console.log("Can't close database file.", error)
		return null
	}
}

module.exports.getDaftarPercakapan = function ()
{
	let db = SQL.dbOpen(database)

	if (db !== null)
	{
		let query = 'SELECT * FROM `tb_daftar_percakapan` ORDER BY `id` ASC'
		
		try
		{
			let row = db.exec(query)


			if (row !== undefined && row.length > 0)
			{
				row = _rowsFromSqlDataObject(row[0])
				return row;
			}
		}
		catch (error)
		{
			console.log('model.getDaftarPercakapan', error.message)
		}
		finally
		{
			SQL.dbClose(db, database)
		}
	}
}

module.exports.getPercakapan = function (id)
{
	let db = SQL.dbOpen(database)

	if (db !== null)
	{
		let query = 'SELECT * FROM `tb_percakapan` WHERE id_daftar IS '+id+' ORDER BY `nomor_urut` ASC'

		try
		{
			let row = db.exec(query)


			if (row !== undefined && row.length > 0)
			{
				row = _rowsFromSqlDataObject(row[0])
				return row;
			}
		}
		catch (error)
		{
			console.log('model.getPercakapan', error.message)
		}
		finally
		{
			SQL.dbClose(db, database)
		}
	}
}

module.exports.getKamus = function (id)
{
	let db = SQL.dbOpen(database)

	if (db !== null)
	{
		let query = 'SELECT * FROM `tb_kamus` WHERE id_daftar IS '+id+' ORDER BY `id` ASC'
		
		try
		{
			let row = db.exec(query)


			if (row !== undefined && row.length > 0)
			{
				row = _rowsFromSqlDataObject(row[0])
				return row;
			}
		}
		catch (error)
		{
			console.log('model.getKamus', error.message)
		}
		finally
		{
			SQL.dbClose(db, database)
		}
	}
}

module.exports.getDetailPercakapan = function (id)
{
	let db = SQL.dbOpen(database)

	if (db !== null)
	{
		let query = 'SELECT * FROM `tb_daftar_percakapan` WHERE id IS ?'
		let statement = db.prepare(query, [id])
		
		try
		{
			if (statement.step())
			{
				let values = [statement.get()]
				let columns = statement.getColumnNames()
				return _rowsFromSqlDataObject({values: values, columns: columns})
			}
			else
			{
				console.log('model.getDetailPercakapan', 'No data found for id =', id)
			}
		}
		catch (error)
		{
			console.log('model.getDetailPercakapan', error.message)
		}
		finally
		{
			SQL.dbClose(db, database)
		}
	}
}