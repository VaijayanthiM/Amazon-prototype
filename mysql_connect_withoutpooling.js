/**
 * New node file
 */
/**
 * New node file
 */


var id=0;

var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'user1',
	password : 'user1',
	port: '3306',
	database: 'amazon'
});

/*connection.connect();

	//var sql = 'CREATE TABLE customer1 (`id` INT NOT NULL,`name` VARCHAR(45) NOT NULL, PRIMARY KEY (`id`))';

	/*connection.query(sql, function(err, res) {
		if(err){
			console.log("ERROR: " + err.message);
		}else{
			console.log("SQL DB CONNECTED AND TABLE CREATED");
		}


	});*/


function insertAndQuery(callback, email, password, firstname, lastname){
	//console.log("In insertquery  1");
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});

	connection.connect();
	var sql = 'INSERT INTO customer(id, name, password, firstname, lastname) VALUES("' + id++ + '","' + email + '", "' + password + '", "'+ firstname +'", "'+ lastname +'")';

	//var sql = 'insert into PERSON (id, name) values ("' +userName + '", "' + password + '")';{}
	connection.query(sql, function(err, result) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(result);
		connection.query('update customer set timestamp=current_timestamp where name = "'+ email +'"', function(err, rows, fields){
			if(err)
				throw err;

			connection.query('select * from customer where name = "'+ email + '"', function(err, rows, fields){
				if(err)
					throw err;
				console.log("here:" + fields + rows.length +JSON.stringify(rows));
				callback(err, rows);
				//connection.release();
			});

		});



	});
}

/*function fetchData(callback,email,password){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});
	console.log("In sql_connect.js, EMail: " + email + "Password: " + password);

	connection.connect();
	var sql = 'SELECT * FROM customer where name = "'+ email +'" and password = "'+ password +'"';
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("DATA : "+JSON.stringify(rows));
			callback(err, rows);
			connection.query('update customer set timestamp=current_timestamp where name = "'+ email +'"', function(err, rows, fields){
				if(err)
					throw err;
			});

		}
		else
		{
			callback(err, rows);
			//return res.send("Invalid username/password! Try again...");
		}
		//connection.release();
	});
}*/

function fetchData(callback,email,password){
	var mysql      = require('mysql');
	console.log("In sql_connect.js, EMail: " + email + "Password: " + password);
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});

	connection.connect();
		
		var sql = 'SELECT * FROM customer where name = "'+ email +'" and password = "'+ password +'"';
		connection.query(sql, function(err, rows, fields){
			if(rows.length!==0){
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
				connection.query('update customer set timestamp=current_timestamp where name = "'+ email +'"', function(err, rows, fields){
					if(err)
						throw err;
				});

			}
			else
			{

				callback(err, rows);
				//return res.send("Invalid username/password! Try again...");
			}
			//connection.release();
		});
	
}




function fetchProd(callback,prodName, catalogitem){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});
	console.log("In sql_connect.js, prodName: " + prodName);
	

	connection.connect();

	var sql = 'SELECT * FROM ' + catalogitem + ' where productName = "'+ prodName +'"';
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("DATA : "+JSON.stringify(rows));
			callback(err, rows);
		}
		else
		{
			callback(err, rows);
			//return res.send("Invalid username/password! Try again...");
		}
		//connection.release();
	});

}



function fetch(callback, catalogitem){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});
	console.log("In sql_connect.js, fetch");
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});

	connection.connect();
	var sql = 'SELECT * FROM ' + catalogitem + '';
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("DATA : "+JSON.stringify(rows));
			callback(err, rows);
		}
		else
		{
			callback(err, rows);
			//return res.send("Invalid username/password! Try again...");
		}
		//connection.release();
	});
}


function fetchAddItem(callback, prodQty, prodName, catalogitem){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});
	var finalproductQty=0;
	console.log("In sql_connect.js, fetchAddItem"+ prodQty + prodName);


	connection.connect();
	var sql = 'SELECT * FROM ' + catalogitem + ' where productName = "'+ prodName +'"';
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("Rows length: "+ rows.length);
			finalproductQty=rows[0].productQty-prodQty;
			console.log("Product qty: "+ rows[0].productQty);
			if(finalproductQty>=0)
			{
				console.log("DATA : "+JSON.stringify(rows));
				qtyflag=0;

				prodID=rows[0].productID;
				prodName=rows[0].productName;
				prodDesc=rows[0].productDesc;
				prodQty=prodQty;
				prodPrice=rows[0].productPrice;
				prodPriceTotal=prodPrice*prodQty;

				console.log(prodID + prodName + prodDesc + prodQty + prodPrice + prodPriceTotal);

				//callback(err, rows, qtyflag);
				//connection.query('INSERT INTO shoppingcart(productID, productName, productDesc, productQty, productPrice, productPriceTotal) VALUES("' + rows[0].productID + '","' + rows[0].productName + '", "' + rows[0].productDesc + '", "' + rows[0].productQty + '", "' + rows[0].productPrice + '", "' + (rows[0].productQty*rows[0].productPrice) + '")', function(err, rows, fields){
				connection.query('INSERT INTO shoppingcart(productID, productName, productDesc, productQty, productPrice, productPriceTotal, catalogName) VALUES("' + prodID + '","' + prodName + '", "' + prodDesc + '", "' + prodQty + '", "' + prodPrice + '", "' + (prodQty*prodPrice) + '", "' + catalogitem +'" )', function(err, results){
					if(err)
						throw err;
					//console.log("here:" + fields + rows.length +JSON.stringify(rows));


				});

				connection.query('update ' + catalogitem + ' set productQty="' + finalproductQty + '" where productName="' + prodName + '"', function(err, rows, fields){
					if(err)
						throw err;


				});

				connection.query('select * from shoppingcart', function(err, rows, fields){
					if(err)
						throw err;
					callback(err, rows, qtyflag);

				});

			}
			else
			{
				console.log("Qty in error!");
				qtyflag=1;
				callback("Qty in error!", rows, qtyflag);
			}
		}
		else
		{
			callback(err, rows);
			//return res.send("Invalid username/password! Try again...");
		}
		//connection.release();
	});
}

function flushPage(callback){
	var mysql      = require('mysql');
	var finalproductQty=0;
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});

	console.log("In sql_connect.js, flushPage");
	connection.connect();

	var sql = 'SELECT * FROM shoppingcart';
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("Rows length: "+ rows.length);


			console.log("DATA : "+JSON.stringify(rows));
			qtyflag=0;

			prodID=rows[0].productID;
			prodName=rows[0].productName;
			prodDesc=rows[0].productDesc;
			prodQty=rows[0].productQty;
			prodPrice=rows[0].productPrice;
			prodPriceTotal=rows[0].productPriceTotal;
			catalogName=rows[0].catalogName;

			console.log(prodID + prodName + prodDesc + prodQty + prodPrice + prodPriceTotal);

			//callback(err, rows, qtyflag);
			//connection.query('INSERT INTO shoppingcart(productID, productName, productDesc, productQty, productPrice, productPriceTotal) VALUES("' + rows[0].productID + '","' + rows[0].productName + '", "' + rows[0].productDesc + '", "' + rows[0].productQty + '", "' + rows[0].productPrice + '", "' + (rows[0].productQty*rows[0].productPrice) + '")', function(err, rows, fields){
			/*connection.query('INSERT INTO shoppingcart(productID, productName, productDesc, productQty, productPrice, productPriceTotal, catalogName) VALUES("' + prodID + '","' + prodName + '", "' + prodDesc + '", "' + prodQty + '", "' + prodPrice + '", "' + (prodQty*prodPrice) + '", "' + catalogitem +'" )', function(err, results){
					if(err)
						throw err;
					//console.log("here:" + fields + rows.length +JSON.stringify(rows));


				});*/
			connection.query('select * from '+ catalogName +' where productName="'+ prodName +'"', function(err, rows, fields){
				if(err)
					throw err;
				console.log("here qty:" + finalproductQty + "" + rows[0].productQty + "" +prodQty);
				finalproductQty=prodQty+rows[0].productQty;
				connection.query('update ' + catalogName + ' set productQty="' + finalproductQty + '" where productName="' + prodName + '"', function(err, rows, fields){
					if(err)
						throw err;


				});

			});





			connection.query('delete from shoppingcart', function(err, rows, fields){
				if(err)
					throw err;
				callback(err, rows);

			});


		}
		else
		{
			callback(err, rows);
			//return res.send("Invalid username/password! Try again...");
		}
		//connection.release();
	});

}



function fetchRemoveItem(callback, qty, prodName){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});
	var finalproductQty=0;
	console.log("In sql_connect.js, fetchRemoveItem"+ qty + prodName);
	connection.connect();

	var sql = 'SELECT * FROM shoppingcart where productQty = '+ qty +' and productName = "'+ prodName +'"';
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("Rows length: "+ rows.length);
			finalproductQty=rows[0].productQty;
			var catalogitem=rows[0].catalogName;
			console.log("Product qty to be added: "+ finalproductQty);
			if(finalproductQty>=0)
			{
				console.log("DATA : "+JSON.stringify(rows));

				connection.query('delete from shoppingcart where productQty = '+ qty +' and productName = "'+ prodName +'"', function(err, results){
					if(err)
						throw err;
					//console.log("here:" + fields + rows.length +JSON.stringify(rows));


				});

				connection.query('select * from ' + catalogitem + ' where productName="' + prodName + '"', function(err, rows, fields){
					if(err)
						throw err;
					finalproductQty=finalproductQty+rows[0].productQty;
					console.log("now, qty is "+ finalproductQty);
					connection.query('update ' + catalogitem + ' set productQty="' + finalproductQty + '" where productName="' + prodName + '"', function(err, rows, fields){
						if(err)
							throw err;


					});


				});




				connection.query('select * from shoppingcart', function(err, rows, fields){
					if(err)
						throw err;
					callback(err, rows, qtyflag);

				});

			}
			else
			{
				console.log("Qty in error!");
				qtyflag=1;
				callback("Qty in error!", rows, qtyflag);
			}
		}
		else
		{
			callback(err, rows);
			//return res.send("Invalid username/password! Try again...");
		}
		//connection.release();
	});

}



function fetchTransactionHistory(callback, userID){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});
	console.log("In sql_connect.js, fetchTransactionHistory");
	connection.connect();

	var sql = 'SELECT * FROM shoppingcart';
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if(rows.length>0)
		{
			for(var i=0;i<rows.length;i++){
				console.log("Rows length: "+ rows.length);

				//console.log("Product qty: "+ rows[0].productQty);

				console.log("DATA : "+JSON.stringify(rows));


				prodID=rows[i].productID;
				prodName=rows[i].productName;
				prodDesc=rows[i].productDesc;
				prodQty=rows[i].productQty;
				prodPrice=rows[i].productPrice;
				prodPriceTotal=rows[i].productPriceTotal;
				prodCatalog=rows[i].catalogName;
				userID=userID;


				console.log(prodID + prodName + prodDesc + prodQty + prodPrice + prodPriceTotal);

				connection.query('INSERT INTO transactionhistory(productID, productName, productDesc, productQty, productPrice, productPriceTotal, catalogName, userID) VALUES("' + prodID + '","' + prodName + '", "' + prodDesc + '", "' + prodQty + '", "' + prodPrice + '", "' + prodPriceTotal + '", "' + prodCatalog +'", "'+ userID +'" )', function(err, results){
					if(err)
						throw err;
					//console.log("here:" + fields + rows.length +JSON.stringify(rows));


				});

			}
			connection.query('delete from shoppingcart', function(err, rows, fields){
				if(err)
					throw err;


			});

			connection.query('select * from transactionhistory where userID ="'+ userID +'"', function(err, rows, fields){
				if(err)
					throw err;
				callback(err, rows);

			});




		}
		else
		{
			callback(err, rows);
			//return res.send("Invalid username/password! Try again...");
		}
		//connection.release();
	});

}



function fetchShoppingCart(callback, userID){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});
	
	console.log("In sql_connect.js, fetchShoppingCart"+ userID);


	connection.connect();

	connection.query('select * from shoppingcart', function(err, rows, fields){
		if(err)
			throw err;
		callback(err, rows);
		//connection.release();

	});


}

function fetchPurchaseHistory(callback, userID){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});

	console.log("In sql_connect.js, fetchPurchaseHistory"+ userID);
	connection.connect();


	connection.query('select * from transactionhistory where userID = "'+ userID +'"', function(err, rows, fields){
		if(err)
			throw err;
		callback(err, rows);
		//connection.release();

	});


}


function deleteshoppingcart(callback){
	
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'user1',
		password : 'user1',
		port: '3306',
		database: 'amazon'
	});
	console.log("In sql_connect.js, deleteshoppingcart");


	connection.connect();

	connection.query('delete from shoppingcart', function(err, rows, fields){
		if(err)
			throw err;
		else{
			connection.query('delete from customer', function(err, rows, fields){
				if(err)
					throw err;
				else
				{
					connection.query('delete from transactionhistory', function(err, rows, fields){
						if(err)
							throw err;
					});
				}

			});


			callback(err, rows);
			//connection.release();
		}
	});
}



//exports.connect = connect;
exports.insertAndQuery = insertAndQuery;
exports.fetchData = fetchData;
exports.fetch=fetch;
exports.fetchProd=fetchProd;
exports.fetchAddItem=fetchAddItem;
exports.fetchShoppingCart=fetchShoppingCart;
exports.deleteshoppingcart=deleteshoppingcart;
exports.fetchRemoveItem=fetchRemoveItem;
exports.fetchTransactionHistory=fetchTransactionHistory;
exports.fetchPurchaseHistory=fetchPurchaseHistory;
exports.flushPage=flushPage;