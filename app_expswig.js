var express = require('express'),
    app=express(),
    cons = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
    
app.engine('html',cons.swig);
app.set('view engine', 'html');
app.set('/views', express.static(__dirname +"/views"));
app.use(express.bodyParser());
app.use(app.router);

var mongoclient = new MongoClient(new Server('localhost',27017,{'native_parser':true}));

var db = mongoclient.db('users');

function errorHandler(err,req,res, next){
	console.error(err.message);
	console.error(err.stack);
	res.status(500);
	res.render('error',{error:err.message});
}

app.use(errorHandler);

app.get('/',function(req,res){
	db.collection('users').findOne({},function(err,doc){
		res.render('hello',doc);
	});
});

/*app.get('/:name',function(req,res){
	var display_name = {'name':req.params.name};
	res.render('hello',display_name);
});*/

app.get('/fruit',function(req,res){
	res.render('fruit',{'fruits':['apple','orange','banana','pineapple','cherry','mango','kiwi']});
});

app.get('*',function(req,res){
	res.send('Page not found',404);
});

app.post('/fruit',function(req,res,next){
	var favorite = req.body.fruit;
	if(typeof favorite == 'undefined'){
		next(Error('Please choose a fruit!'));
	}
	else {
		res.send("dude, I love "+favorite+"s too!");
	}
});

mongoclient.open(function(err,mongoclient){
	if (err) throw err;
	app.listen(8000);
	console.log('listening on port 8000');
});

