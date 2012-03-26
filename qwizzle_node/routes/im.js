/*
 * 
 * 
node.js:134
        throw e; // process.nextTick error, or 'error' event on first tick
        ^
Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters in hex format
    at Object.ObjectID (/var/node/qwizzle_node/node_modules/mongodb/lib/mongodb/bson/objectid.js:27:64)
    at /var/node/qwizzle_node/routes/im.js:296:34
    at /var/node/qwizzle_node/routes/im.js:209:6
    at Array.<anonymous> (/var/node/qwizzle_node/routes/im.js:195:21)
    at EventEmitter._tickCallback (node.js:126:26)

 * 
 */

var mongodb = require('mongodb');
var fs = fs = require('fs');
var server = new mongodb.Server("127.0.0.1", 27017, {});
var db = new mongodb.Db('qwizzle', server, {});
db.open(function(err, db){
	db.authenticate('chosen', 'Ch0s3nLollip0p!', function(err, result){
		if (err) throw err;
	});
});

var isEmpty = function(map) {
   var empty = true;

   for(var key in map) {
      empty = false;
      break;
   }

   return empty;
}

var checkOnline = function(callback) {
	fs.readdir('/var/lib/php5/', function(error, files) {
		if(error) throw error;
		this.onlineIds = [];
		online = [];
		remaining = files.length;
		sessions = [];
		//console.log(files.length);
		for(i=0; i < files.length; i++)
		{
			try
			{
				data = fs.readFileSync('/var/lib/php5/' + files[i]);
				//fs.readFile('/var/lib/php5/' + files[i], function (err, data) {
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
			}
			catch(err)
			{
				console.log(err);
			}
			
			remaining -= 1;
			//console.log(remaining);
			if ( remaining == 0 ) {
				callback(true);
			}
		}
	});	
}

var getMessageHistory = function(callback) {
	online = [];
	z = data.length;
	for(i = 0; i < data.length; i++)
	{
		if(data[i]._id != null && data[i].status == 'online')
		{
			online.push(data[i]._id);
		}
	} 
	process.nextTick(function(){
		online = Array(online);
		if(typeof user.im == 'undefined')
		{
			user.im = new Object();
		}
		threads = Array(user.im);
		// seems to be a bug here. sometimes threads is not set
		//console.log(threads);
		process.nextTick(function(){
			// attach threads from database to data array
			if(data.length > 0){
				for(r = 0; r < data.length; r++){ // iterate over each contact (data)
					if(typeof threads != 'undefined'){
						for(var threadId in threads[0]){ // loop through each thread
						recipients = Array(threads[0][threadId].recipients); // find recipients
							recipients[0].forEach(function(recId, key1) {
									if(!data[r].thread)
									{
										data[r].thread = [];
									}
									if(data[r]._id == recId)
									{
										//console.log(threads[0])
										data[r].thread = threads[0][threadId];
									}
								
							});
						}	
					} else {
						data[r].thread = [];
					}
				}	
			}
			process.nextTick(function(){
				callback(true);
			});
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
				if (typeof user == 'undefined') 
				{
					callback(false);	
					return false;
				}
				if(user.contacts)
				{ 
					contacts = user.contacts;
					y = contacts.length;
					for(i=0; i < contacts.length; i++)
					{
						if (contacts[i] != 'defined')
						{
							if (contacts[i].status == 'active')
							{
								contacts[i].status = 'offline';
								for(x=0; x < onlineIds.length; x++)
								{
									if(contacts[i]._id == onlineIds[x])
										contacts[i].status = 'online';
								}
								try
								{
									data.push(contacts[i]);	
								}
								catch(e)
								{ 
									callback(false);
								}
							}
						}
						y -= 1;
						if(y == 0)
						{
							callback(true);
						}	
					}	
				} else { callback(false); }
			});
			
		}); 
	});
}


var setSessionFile = function(req, callback){
	fs.stat('/var/lib/php5/sess_' + req.cookies.session, function(error, stats){
		if(error) // didn't find the session file
		{
			callback(false);	
		}
		else
		{
			this.sessFile = '/var/lib/php5/sess_' + req.cookies.session;
			process.nextTick(function(){
				callback(true);
			}); 	
		}
			
	});
}

var setId = function(callback){
	fs.readFile(sessFile, function (err, data){
		txt = String(data);
		match = txt.match(/\"_id\";C:7:\"MongoId\":24:\{(.*?)\}s\:/);
		if (match)
		{
		  theId = match[1]; 
            theId = theId.replace(/\W/g, "");
            if(match == null)
            {
                callback(false);
            }
            else
            {
                this.id = db.bson_serializer.ObjectID( theId );
                process.nextTick(function(){
                    callback(true);
                }); 
            }    
		}
	});
}

var setUser = function(req, callback){
	setSessionFile(req, function(bool){
		if (bool === true)
		{
			setId(function(bool){
				if (bool === true)
				{
					callback(true);
				}
			});
		} else { callback(false); }
	});
}

exports.index = function(req, res){
	// get session cookie
	setUser(req, function(bool){
		if(bool === true){
			process.nextTick(function(){
				checkOnline(function(bool){
					if(bool === true){
						userLookup(function(bool){
							if (bool === true){
								getMessageHistory(function(bool){
									//console.log(user.email + ' just made a request\r\n');
									title = 'Qwizzle IM System v1.0 (alpha)';
									var d = {};
									d.contacts = data;
									d.user_id = id;
									d.success = true;
									json = JSON.stringify(d);
									res.end(json);
								});	
							} else {
								//console.log(user.email + ' just made a request');
								json = JSON.stringify({'user_id' : id, 'success' : false})
								res.end(json);				
							}
						});	
					} else { res.end('Access Denied'); }
				});
			});	
		} else { res.end('Access Denied'); }
	});
};

exports.read = function(req, res){
	this.thid = req.param('thread-id');
    if(thid != 'false')
    {
    	process.nextTick(function(){
	    	setUser(req, function(bool){
		        if(bool === true){
		            process.nextTick(function(){
		                checkOnline(function(bool){
		                    if(bool === true){
		                        userLookup(function(bool){
		                            if(bool === true)
		                            {
		                                thread = user.im[thid];
		                                if (typeof thread != 'undefined')
		                                {
		                                    process.nextTick(function(){
		                                        thread['read'] = 1;  
		                                        process.nextTick(function(){ 
		                                            user.im[thid] = thread;
		                                            process.nextTick(function(){
		                                                db.collection('mango_users', function(error, collection){
		                                                    collection.update({_id:id}, {$set:{ im : user.im}});
		                                                    res.end();    
		                                                });
		                                            });    
		                                        });  
		                                    });    
		                                }
		                            } else { res.end('Access denied'); }   
		                        });
		                    } else { res.end('Access denied'); }
		                });
		            });
		        } else { res.end('Access denied'); }
		    });
		});
	} else { res.end(); }
}


exports.send = function(req, res){
	//console.log('client; ' + req.cookies);
	//console.log(req);
	setUser(req, function(bool){
		if (typeof req.param('im-recipient') != 'undefined')
		{
			this.rId = db.bson_serializer.ObjectID( req.param('im-recipient', null) );	
			this.message = req.param('im-message', null);
			this.reply = req.param('im-thread');
			//console.log(reply);
			//console.log(message);
			ourTime = Math.round(new Date().getTime()/1000);
			process.nextTick(function(){
				//console.log(ourTime);
				db.collection('mango_users', function(error, collection){
					collection.find({_id:this.id}, {limit:1}).toArray(function (error, sender){
						sender = sender[0];
						collection.find({_id:this.rId}, {limit:1}).toArray(function (error, recipient){
							recipient = recipient[0];
							if(reply != 'false') 
							{
								newMessage = {
									'sender' 	: String(sender._id),
									'reciever' 	: String(recipient._id),
									'userName' 	: sender.username,
									'message'	: message,
									'sent' 		: ourTime,
								}
								senderIms = sender.im;
								recipientIms = recipient.im;
								
							     // update sender thread
	                            for(var key in senderIms)
	                            {
	                                if(key == reply)
	                                {
	                                    if (typeof senderIms[key] != 'undefined')
	                                    {
	                                        //console.log(senderIms);
	                                        senderIms[key].messages.push(newMessage);
	                                        senderIms[key].read = 1;
	                                        collection.update({_id:this.id}, {$set:{ im : senderIms}});
	                                        //console.log('sen' + senderIms);
	                                    }
	                                }
	                            }
	                            
	                            // update recipient thread
	                            count = 0;
	                            for(var key1 in recipientIms)
	                            {
	                                if(key1 == reply)
	                                { 
	                                    if (typeof recipientIms[key] != 'undefined')
	                                    {
	                                        recipientIms[key].messages.push(newMessage);
	                                        recipientIms[key].read = 0;
	                                        collection.update({_id:this.rId}, {$set:{ im : recipientIms}});
	                                        //console.log('rec' + recipientIms);       
	                                    }
	                                    
	                                }
	                                count += 1;
	                            }
	                            process.nextTick(function(){
	                                res.end();  
	                            });
								
							}
							else {
								
								if(!sender.im)
									sender.im = {};
								if(!recipient.im)
									recipient.im = {};
								everyone = [sender._id, recipient._id];
							 	threadId = String(new db.bson_serializer.ObjectID( null ));
								theMessage = {
									'recipients' : [String(sender._id), String(recipient._id)],
									'id'		 : threadId,
									'created' : ourTime,
									'read' : 0,
									'messages' : [
										{
											'sender' : String(sender._id),
											'reciever' : String(recipient._id),
											'userName' : sender.username,
											'message' : message,
											'sent' : ourTime,
										}
									]
								};
								process.nextTick(function(){
									sender.im[threadId] = theMessage;
									recipient.im[threadId] = theMessage;
									//console.log(sender);
									//console.log(recipient.im);
									process.nextTick(function(){
										collection.update({_id:id}, {$set:{ im : sender.im}});
										collection.update({_id:rId}, {$set:{ im : recipient.im}});
										//console.log(sender);
										//console.log(recipient);
										res.end();
									});
								});
							}
						});
					});
				});
			});
		}
		res.end();
	});
};