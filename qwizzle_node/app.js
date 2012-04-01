
/**
 * MongoDB dynamic database loading hack
 * @notes	make sure to run setDB(req) at the beginning of every route
 * @Author  Winter King
 */
var setDB = function(req, callback) {
	mongodb = require('mongodb');
	server = new mongodb.Server("127.0.0.1", 27017, {});
	if (typeof req.headers['x-forwarded-host'] != 'undefined')
	{
		if (req.headers['x-forwarded-host'].indexOf('dev.qwizzle.us') > -1)
		{
			app.db = new mongodb.Db('qwizzle_2', server, {});
		}
		else
		{
			app.db = new mongodb.Db('qwizzle_1', server, {});
		}	
	}
	else
	{
		app.db = new mongodb.Db('qwizzle_1', server, {});
	}
	process.nextTick(function(){
		app.db.open(function(err, db){
			app.db.authenticate('chosen', 'Ch0s3nLollip0p!', function(err, result){
				if (err) throw err;
				process.nextTick(function(){
					callback(true);
				});
			});
		});
	});
};
/* end hack */

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , notification = require('./routes/notification')
  , index = require('./routes/index')
  , im = require('./routes/im')
  , fs = require('fs');

var app = module.exports = express.createServer();
app.setMongoDB = setDB;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { pretty: true });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.settings.env = 'production';
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
}); 

// Routes
app.get('/', index.index);
app.get('/im', im.index);
app.post('/im/send', im.send);
app.post('/im/read', im.read);
app.get('/notification', notification.getall);


app.listen(3010);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
