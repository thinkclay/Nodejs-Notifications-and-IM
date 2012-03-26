
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , notification = require('./routes/notification')
  //, index = require('./routes/index')
  , im = require('./routes/im')
  , fs = require('fs');

var app = module.exports = express.createServer();

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
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
//app.get('/', index.index)
app.get('/im', im.index);
app.post('/im/send', im.send);
app.post('/im/read', im.read);
app.get('/notification', notification.getall);


app.listen(3010);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
