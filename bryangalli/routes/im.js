var mongodb = require('mongodb');
var fs = fs = require('fs');
var server = new mongodb.Server("127.0.0.1", 27017, {});
var db = new mongodb.Db('qwizzle', server, {});
db.open(function(err, db){
	db.authenticate('chosen', 'Ch0s3nLollip0p!', function(err, result){
		if (err) throw err;
	});
});

var checkOnline = function(callback) {
	fs.readdir('/var/lib/php5/', function(error, files) {
		this.onlineIds = [];
		online = [];
		remaining = files.length;
		for(i=0; i < files.length; i++)
		{
			fs.readFile('/var/lib/php5/' + files[i], function (err, data) {
				if (err) throw err;
				var txt = String(data);
				match = txt.match(/Model_Mango_User/);
				if(match != null)
				{
					// build out online array to store user arrays
	     			online.push(match);	
	     			txt = String(data);
	     			match = txt.match(/\"_id\";C:7:\"MongoId\":24:\{(.*?)\}s\:/);
	     			onlineIds.push(match[1]);
				}	
				remaining -= 1;
				//console.log(remaining);
				if ( remaining == 0 ) {
					callback(true);
				}
			});
		}
	});	
}

var getMessageHistory = function(callback) {
	inSystem = [];
	z = data.length;
	for(i = 0; i < data.length; i++)
	{
		if(data[i]._id != null && data[i].status == 'online')
		{
			inSystem.push(data[i]._id);
		}
	} 
	process.nextTick(function(){
		inSystem = Array(inSystem);
		messages = Array(user.im);
		count = messages.length;
		process.nextTick(function(){
			for(var threadid in messages[0]){
				recipients = Array(messages[0][threadid].recipients);
				//console.log(recipients);
				recipients[0].forEach(function(recId, key1) {
					for(var ocId in inSystem[0])
					{
						if(recId == inSystem[0][ocId])
						{
							for(r = 0; r < data.length; r++)
							{
								if(!data[r].thread)
								{
									data[r].thread = [];
								}
								if(data[r]._id == inSystem[0][ocId])
								{
									messages[0][threadid].threadid = threadid
									data[r].thread = messages[0][threadid];
									//console.log(data);
									count -= 1;
									if (count == 0 )
									{
										callback(true);	
									}
								}	
							}
						}
					}
				});
			}
		});
	});
}


var userLookup = function(callback){
	db.collection('mango_users', function(error, collection) {
		if (error) throw error;
		collection.find({_id : id}, {limit:1}).toArray(function(error, user) {
			user = user[0];
			this.user = user;
			this.data = [];
			contacts = [];
			process.nextTick(function(){
				if(user.contacts)
				{
					contacts = user.contacts;
					//console.log(contacts);
					y = contacts.length;
					for(i=0; i < contacts.length; i++)
					{
						contacts[i].status = 'offline';
						for(x=0; x < onlineIds.length; x++)
						{
							if(contacts[i]._id == onlineIds[x])
								contacts[i].status = 'online';
						}
						data.push(contacts[i]);
						y -= 1;
						if(y == 0)
						{
							//console.log(data);
							callback(true);
						}
					}	
				} else { callback(false); }
			});
		}); 
	});
}

var setData = function(){}

var setId = function(req, callback){
	fs.readdir('/var/lib/php5/', function(error, files) {
		files.forEach(function(file, key){
			if(file.replace('sess\_','') === req.cookies.session)
			{
				fs.readFile('/var/lib/php5/' + file, function (err, data){
					txt = String(data);
					match = txt.match(/\"_id\";C:7:\"MongoId\":24:\{(.*?)\}s\:/);
					this.id = db.bson_serializer.ObjectID( match[1] );
					process.nextTick(function(){
						callback(true);
					});
				});
			}			
		});
	});
}

exports.index = function(req, res){
	// get session cookie
	setId(req, function(bool){
		process.nextTick(function(){
			checkOnline(function(bool){
				userLookup(function(bool){
					if (bool === true){
						getMessageHistory(function(bool){
							//console.log(data[0] + "\r\n");
							console.log(user.email + ' just made a request\r\n');
							title = 'Qwizzle IM System v1.0 (alpha)';
							json = JSON.stringify(data);
							console.log(json);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end('im(\''+json+'\')');
						});	
					} else {
						//console.log(data + "\r\n");
						console.log(user.email + ' just made a request');
						res.writeHead(200, {'Content-Type': 'text/plain'});
						res.end();				
					}
				});	
			});
		});
	});
};

exports.send = function(req, res){
	this.uId = db.bson_serializer.ObjectID( req.params.id );
	this.rId = db.bson_serializer.ObjectID( req.params.r_id );
	this.message = req.params.message;
	this.reply = req.params.reply;
	process.nextTick(function(){
		db.collection('mango_users', function(error, collection){
			collection.find({_id:this.uId}, {limit:1}).toArray(function (error, sender){
				sender = sender[0];
				collection.find({_id:this.rId}, {limit:1}).toArray(function (error, recipient){
					recipient = recipient[0];
					if(reply != 'false') 
					{
						senderIms = sender.im;
						console.log(senderIms);
						for(var key in senderIms)
						{
							if(key == reply)
							{
								senderIms[key].push(test);
								console.log(senderIms);
							}
						}
					}
					else {
						
						if(!sender.im)
							sender.im = {};
						if(!recipient.im)
							recipient.im = {};
						everyone = [sender._id, recipient._id];
					 	threadId = String(new db.bson_serializer.ObjectID( null ));
						theMessage = {
							'recipients' : [sender._id, recipient._id],
							'created' : Date.now(),
							'messages' : [
								{
									'sender' : sender._id,
									'reciever' : recipient._id,
									'userName' : sender.username,
									'message' : 'this is a big test',
									'sent' : Date.now()
								},
								{
									'sender' : sender._id,
									'reciever' : recipient._id,
									'userName' : sender.username,
									'message' : 'this is a big test',
									'sent' : Date.now()
								}
							]
						};
						process.nextTick(function(){
							sender.im[threadId] = theMessage;
							recipient.im[threadId] = theMessage;
							//console.log(sender);
							console.log(recipient.im);
							process.nextTick(function(){
								collection.update({_id:uId}, {$set:{ im : sender.im}});
								collection.update({_id:rId}, {$set:{ im : recipient.im}});
								//console.log(sender);
								//console.log(recipient);
								res.end('done');
							});
						});
					}
				});
			});
		});
	});
};