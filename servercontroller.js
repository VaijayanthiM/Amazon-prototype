/**
 * New node file
 */
var application_root = __dirname,
express = require("express"),
path = require("path"),
ejs = require("ejs");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");

var RedisStore = require('connect-redis')(express);

app.use(express.cookieParser());
/*app.use(express.session({
	  store: new RedisStore({
	    host: 'localhost',
	    port: 6379,
	    db: 2,
	    pass: 'RedisPASS'
	  }),
	  secret: '1234567890QWERTY'
	}));*/

app.use(express.session({secret: '1234567890QWERTY',
	maxAge  : new Date(Date.now() + 1000), //1 Hour
	expires : new Date(Date.now() + 1000)}));

var title = 'EJS template with Node.JS';
var data = 'Data from node';
var productName, userID='', globalamounttopay, catalogitem;
var sec, sec1;
var id=0;

mysql.deleteshoppingcart(function(err,results){

});

var date = new Date();
var sec=date.getSeconds();

console.log(sec);

var date1 = new Date();
var sec1=date.getSeconds();

console.log(sec);

var prodID=new Array();
var name= new Array();
var desc= new Array();
var qty=new Array();
var price=new Array();
var totalPrice=new Array();
var catalogName=new Array();
var userName=new Array();

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});



app.get('/index/:catalogitem/:productName', function (req, res) {
	productName=req.params.productName;
	catalogitem=req.params.catalogitem;
	mysql.fetchProd(function(err,results){
		if(results.length==0){
			console.log("error!");
			res.send('Error 400: ');
			//throw err;
		}else{
			//console.log("results length:" + results.length);
			ejs.renderFile('amazon_electronicsproduct.ejs',
					{name0 : results[0].productName, desc0 : results[0].productDesc, price0 : results[0].productPrice, qty0 : results[0].productQty,
				userID: userID, catalogitem : catalogitem},
				function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						console.error('CONNECTION error: ',err);
						res.statusCode = 503;
						res.send({
							result: 'error',
							err: err.code
						});
						//res.end('An error occurred');
						console.log(err);
					}
				});
		}
	}, req.params.productName, catalogitem);

});




app.get('/index/:catalogitem', function (req, res) {
	catalogitem=req.params.catalogitem;
	mysql.fetch(function(err,results){
		if(results.length==0){
			console.log("error!");
			res.send('Error 400: ');
			//throw err;
		}else{
			console.log("results length:" + results.length);
			ejs.renderFile('amazon_electronics.ejs',
					{name0 : results[0].productName, desc0 : results[0].productDesc, price0 : results[0].productPrice, qty0 : results[0].productQty, 
				name1 : results[1].productName, desc1 : results[1].productDesc, price1 : results[1].productPrice, qty1 : results[1].productQty, 
				name2 : results[2].productName, desc2 : results[2].productDesc, price2 : results[2].productPrice, qty2 : results[2].productQty,
				userID : userID, catalogitem : catalogitem},
				function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						//res.end('An error occurred');
						console.error('CONNECTION error: ',err);
						res.statusCode = 503;
						res.send({
							result: 'error',
							err: err.code
						});
						console.log(err);
					}
				});
		}
	}, catalogitem);

});




app.post('/index/:catalogitem/:productName/additemtocart', function (req, res) {
	productName=req.params.productName;
	catalogitem=req.params.catalogitem;
	if(!req.body.hasOwnProperty('prodQty') ) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}

	mysql.fetchAddItem(function(err,results,qtyflag){
		if(results.length==0){
			console.log("error!");
			res.send('Error 400!');
			//throw err;
		}
		else{
			console.log("results length:" + results.length);
			var amounttopay=0;
			for(var i=0;i<results.length;i++){
				prodID[i] = results[i].productID;
				name[i] = results[i].productName;
				desc[i]= results[i].productDesc;
				qty[i]= results[i].productQty;
				price[i]= results[i].productPrice;
				totalPrice[i]= results[i].productPrice*results[i].productQty;
				catalogName[i]=results[i].catalogName;
				amounttopay=amounttopay+totalPrice[i];
			}
			globalamounttopay=amounttopay;
			ejs.renderFile('amazon_shoppingcart.ejs',
					{userID : userID, length : results.length, catalogitem : catalogName,
				prodId : prodID, name : name, desc : desc, qty : qty, price : price, totalPrice : totalPrice, amounttopay : amounttopay},
				function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						/*console.error('CONNECTION error: ',err);
							 res.statusCode = 503;
							 res.send({
							 result: 'error',
							 err: err.code
							 });*/
						console.log(err);
					}
				});
		}
	},req.param('prodQty'), productName, catalogitem);

});

app.get('/index/:catalogitem/:productName/:qty/removefromcart', function (req, res) {
	productName=req.params.productName;
	//catalogitem=req.params.catalogitem;
	qty=req.params.qty;


	mysql.fetchRemoveItem(function(err,results,qtyflag){
		if(results.length==0){

			console.log("Nothing to display in the cart!");
			ejs.renderFile('amazon_shoppingcart.ejs',
					{userID : userID, length : results.length,
				prodId : prodID, name : name, desc : desc, qty : qty, price : price, totalPrice : totalPrice, amounttopay : amounttopay, catalogitem : catalogitem},
				function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			//throw err;

		}
		else{
			console.log("results length:" + results.length);
			var amounttopay=0;
			for(var i=0;i<results.length;i++){
				prodID[i] = results[i].productID;
				name[i] = results[i].productName;
				desc[i]= results[i].productDesc;
				qty[i]= results[i].productQty;
				price[i]= results[i].productPrice;
				totalPrice[i]= results[i].productPrice*results[i].productQty;
				catalogName[i]=results[i].catalogName;
				amounttopay=amounttopay+totalPrice[i];
			}
			globalamounttopay=amounttopay;
			ejs.renderFile('amazon_shoppingcart.ejs',
					{userID : userID, length : results.length, catalogitem : catalogName,
				prodId : prodID, name : name, desc : desc, qty : qty, price : price, totalPrice : totalPrice, amounttopay : amounttopay},
				function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');

						console.log(err);
					}
				});
		}
	},qty, productName);

});


app.post('/checkout', function (req, res) {
	console.log("In checkOut! userID:"+userID + globalamounttopay);
	if(userID=='')
	{
		console.log("userID:" +userID);
		ejs.renderFile('amazon_login.ejs',
				{totalPrice: globalamounttopay, userID : userID},
				function(err, result)
				{
					if (!err) {
						//console.log(result);
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}

				});

	}
	else
	{
		ejs.renderFile('amazon_creditcheck.ejs',
				{totalPrice : globalamounttopay, userID : userID},
				function(err, result)
				{
					if (!err) {
						//console.log(result);
						//req.session.time=Date();
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}

				});


	}

});


app.post('/validatepayment', function (req, res) {
	console.log("In validatecreditcard! userID:"+userID + totalPrice + req.param('cvv') + ", "+ req.body.cvv);
	if((req.param('cvv').length!=3)||(req.param('cc1').length!=4)||(req.param('cc2').length!=4)||(req.param('cc3').length!=4)
			||(req.param('cc4').length!=4)||(req.param('addr1').length!=4)||(req.param('addr2').length!=4)||(req.param('name').length!=4)||(req.param('email').length!=4)
			||(req.param('year').length!=4))
	{
		console.log("Invalid credit card details!");
		if(!req.session.lastPage)
		{
			req.session.lastPage="/validatepayment";
			req.session.time=new Date();
			sec=req.session.time.getHours()*60+req.session.time.getMinutes();
			console.log("here:" + sec);
		}
		//req.session.expires=new Date(Date.now() + 5000);

		req.session.time=new Date();
		sec1=req.session.time.getHours()*60+req.session.time.getMinutes();
		console.log("and outside: "+ sec1);

		if(sec1-sec<1)
		{

			ejs.renderFile('amazon_creditcheck_reenter.ejs',
					{totalPrice : globalamounttopay, userID : userID},
					function(err, result)
					{
						if (!err) {
							//console.log(result);
							res.end(result);
						}
						// render or error
						else {

							res.end('An error occurred');
							console.log(err);
						}

					});
		}
		else
		{
			console.log("Page expired! Please login again!");
			userID='';
			req.session.lastPage='';
			mysql.flushPage(function(err, results){
				ejs.renderFile('amazon_index.ejs',
						{title : title, data : data, userID : '', lastlogintime :''},
						function(err, result) {
							// render on success
							if (!err) {

								//console.log(result);
								res.end(result);
							}
							// render or error
							else {
								//res.end('An error occurred');
								console.error('CONNECTION error: ',err);
								res.statusCode = 503;
								res.send({
									result: 'error',
									err: err.code
								});
								console.log(err);
							}
						});

			});
		}


	}
	else{
		mysql.fetchTransactionHistory(function(err,results){
			if(results.length==0){
				console.log("TRansaction history error!");
				res.send('Error 400!');
				//throw err;
			}
			else{
				console.log("results length:" + results.length);
				var amounttopay=0;
				for(var i=0;i<results.length;i++){
					prodID[i] = results[i].productID;
					name[i] = results[i].productName;
					desc[i]= results[i].productDesc;
					qty[i]= results[i].productQty;
					price[i]= results[i].productPrice;
					totalPrice[i]= results[i].productPriceTotal;
					catalogName[i]=results[i].catalogName;
					userName[i]=results[i].userID;
					amounttopay=amounttopay+totalPrice[i];
				}
				globalamounttopay=amounttopay;
				ejs.renderFile('amazon_successpayment.ejs',
						{userID : userID, length : results.length, catalogitem : catalogName,
					prodId : prodID, name : name, desc : desc, qty : qty, price : price, totalPrice : totalPrice, amounttopay : amounttopay},
					function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');

							console.log(err);
						}
					});
			}
		},userID);




	}

});


app.get('/shoppingcart', function (req, res) {
	mysql.fetchShoppingCart(function(err,results){
		if(results.length==0){
			console.log("Nothing to display in the cart!");
			ejs.renderFile('amazon_shoppingcart.ejs',
					{userID : userID, length : results.length,
				prodId : prodID, name : name, desc : desc, qty : qty, price : price, totalPrice : totalPrice, amounttopay : amounttopay, catalogitem : catalogitem},
				function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			//throw err;
		}
		else{
			console.log("results length:" + results.length);
			var amounttopay=0;
			for(var i=0;i<results.length;i++){
				prodID[i] = results[i].productID;
				name[i] = results[i].productName;
				desc[i]= results[i].productDesc;
				qty[i]= results[i].productQty;
				price[i]= results[i].productPrice;
				totalPrice[i]= results[i].productPrice*results[i].productQty;
				catalogitem[i]=results[i].catalogName;
				amounttopay=amounttopay+totalPrice[i];
			}
			ejs.renderFile('amazon_shoppingcart.ejs',
					{userID : userID, length : results.length,
				prodId : prodID, name : name, desc : desc, qty : qty, price : price, totalPrice : totalPrice, amounttopay : amounttopay, catalogitem : catalogitem},
				function(err, result) {
					// render on success
					if (!err) {

						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
		}
	}, userID);

});

app.get('/transactionhistory', function (req, res) {
	mysql.fetchPurchaseHistory(function(err,results){
		if(results.length==0){
			console.log("Nothing to display in the transaction history!");
			ejs.renderFile('amazon_transactionhistory.ejs',
					{userID : userID, length : results.length,
				prodId : prodID, name : name, desc : desc, qty : qty, price : price, totalPrice : totalPrice, amounttopay : amounttopay, catalogitem : catalogitem},
				function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			//throw err;
		}
		else{
			console.log("results length:" + results.length);
			var amounttopay=0;
			for(var i=0;i<results.length;i++){
				prodID[i] = results[i].productID;
				name[i] = results[i].productName;
				desc[i]= results[i].productDesc;
				qty[i]= results[i].productQty;
				price[i]= results[i].productPrice;
				totalPrice[i]= results[i].productPriceTotal;
				catalogitem[i]=results[i].catalogName;
				amounttopay=amounttopay+totalPrice[i];
			}
			ejs.renderFile('amazon_transactionhistory.ejs',
					{userID : userID, length : results.length,
				prodId : prodID, name : name, desc : desc, qty : qty, price : price, totalPrice : totalPrice, amounttopay : amounttopay, catalogitem : catalogitem},
				function(err, result) {
					// render on success
					if (!err) {

						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
		}
	}, userID);

});



app.post('/validate', function (req, res) {
	if(!req.body.hasOwnProperty('email') ||!req.body.hasOwnProperty('password')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');

	}


	if(!req.body.email||!req.body.password)
	{
		ejs.renderFile('amazon_login_reenter.ejs',
				{title : title, data : data},
				function(err, result) {
					// render on success
					if (!err) {
						//console.log(result);
						res.end(result);
					}
					// render or error
					else {

						res.end('An error occurred');
						console.log(err);
					}
				});
	}
	else{

		mysql.fetchData(function(err,results){
			if(results.length==0){
				console.log("error!");
				ejs.renderFile('amazon_login_reenter.ejs',
						{title : title, data : data},
						function(err, result) {
							// render on success
							if (!err) {
								//console.log(result);
								res.end(result);
							}
							// render or error
							else {

								res.end('An error occurred');
								console.log(err);
							}
						});

				//res.send('Error 400!');
				//throw err;
			}else{
				console.log("results length:" + results.length);
				userID=results[0].name;
				ejs.renderFile('amazon_resultafterlogin.ejs',
						{id : results[0].id, userID : results[0].name, lastlogintime : results[0].timestamp},
						function(err, result) {
							// render on success
							if (!err) {
								console.log("timestamp changed!");
								res.end(result);
							}
							// render or error
							else {
								res.end('An error occurred');
								console.log(err);
							}
						});
			}
		},req.param('email'),req.param('password'));
	}


});


app.get('/', function (req, res) {


	ejs.renderFile('amazon_index.ejs',
			{title : title, data : data, userID : userID, lastlogintime :''},
			function(err, result) {
				// render on success
				if (!err) {

					//console.log(result);
					res.end(result);
				}
				// render or error
				else {
					//res.end('An error occurred');
					console.error('CONNECTION error: ',err);
					res.statusCode = 503;
					res.send({
						result: 'error',
						err: err.code
					});
					console.log(err);
				}
			});
});

app.get('/login', function (req, res) {
	ejs.renderFile('amazon_login.ejs',
			{title : title, data : data},
			function(err, result) {
				// render on success
				if (!err) {
					//console.log(result);
					res.end(result);
				}
				// render or error
				else {

					res.end('An error occurred');
					console.log(err);
				}
			});
});



app.get('/signup', function(req, res){


	ejs.renderFile('amazon_signup.ejs',
			{title : title, data: data},
			function(err, result) {
				// render on success
				if (!err) {
					//console.log("1" + result);
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log("Error:" + err);
				}
			});

});



app.post('/insert', function (req, res) {
	console.log("2");
	if(!req.body.hasOwnProperty('email') ||!req.body.hasOwnProperty('password')) {
		console.log("in here!");
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}

	//console.log(toString(req.body.name));
	if(!req.body.email||!req.body.password||!req.body.firstname||!req.body.lastname)
	{
		console.log(req.body.email+"password:"+req.body.password);
		//res.statusCode = 400;
		//return res.send("Error 400: Incomplete data!");
		ejs.renderFile('amazon_signup_reenter.ejs',
				{title : title, data: data},
				function(err, result) {
					// render on success
					if (!err) {
						//console.log("1" + result);
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log("Error:" + err);
					}
				});

	}
	else
	{

		///mysql.connect();
		mysql.insertAndQuery(function(err,results){
			if(err){
				throw err;
			}else{
				userID=results[0].name;
				ejs.renderFile('amazon_resultafterlogin.ejs',
						{id : results[0].id, userID : results[0].name, lastlogintime : ''},
						function(err, result) {
							// render on success
							if (!err) {

								console.log("User ID in insert and signup:"+userID);
								//console.log("timestamp changed!");

								res.end(result);
							}
							// render or error
							else {
								res.end('An error occurred');
								console.log("Error in ejs.renderfile: " + err);
							}
						});
			}
		},req.param('email'),req.param('password'), req.param('firstname'), req.param('lastname'));

	}



});


app.get('/signout', function(req, res){


	ejs.renderFile('amazon_signout.ejs',
			{title : title, data: data},
			function(err, result) {
				// render on success
				if (!err) {
					//console.log("1" + result);
					userID='';
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log("Error:" + err);
				}
			});

});


process.stdin.resume();

process.on('SIGINT', function () {
	console.log('Got SIGINT.  Press Control-D to exit.');
});


/*app.get('/awesome', function(req, res) {
	 if(req.session.lastPage) {
	   res.write('Last page was: ' + req.session.lastPage + ' accessed at '+ req.session.time + sec+ sec1);
	 }

	 req.session.lastPage = '/awesome';
	 req.session.time=new Date();
	 sec=new Date();
	 sec1=req.session.time.getSeconds();
	 //req.session.cookie.maxAge = 1000;
	 res.send('Your Awesome.');
	});*/


app.listen(4009);