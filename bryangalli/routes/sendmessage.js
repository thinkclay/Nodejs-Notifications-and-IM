var mongodb = require('mongodb');
var fs = fs = require('fs');
var server = new mongodb.Server("127.0.0.1", 27017, {});
var db = new mongodb.Db('qwizzle', server, {});
db.open(function(err, db){
	db.authenticate('chosen', 'Ch0s3nLollip0p!', function(err, result){
		if (err) throw err;
	});
});



exports.index = function(req, res){
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
						console.log('kjas;dlfjas;ldfkjas;ldkfjas;ldkfja;lsdkjf;asldkjf;');
						senderIms = sender.im;
						recipientIms = sender.im;
						//console.log(reply);
						//console.log(senderIms);
						for(var key in senderIms)
						{
							if(key == reply)
							{
								newMessage = {
									'sender' : sender._id,
									'reciever' : recipient._id,
									'userName' : sender.username,
									'message' : 'this is a another test',
									'sent' : Date.now()
								};
								oldMessages = senderIms[key];
								oldMessages.messages.push(newMessage);
								updatedMessages = oldMessages;
								senderIms[key] = updatedMessages;	
								process.nextTick(function(){
									sender.im = senderIms;
									recipient.im = recipientIms;
									collection.update({_id:uId}, {$set:{ im : sender.im}});
									collection.update({_id:rId}, {$set:{ im : recipient.im}});
									console.log('finished');
									//this is where I left off!!
								});
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
							console.log(recipient.im);
							process.nextTick(function(){
								collection.update({_id:uId}, {$set:{ im : sender.im}});
								collection.update({_id:rId}, {$set:{ im : recipient.im}});
								res.end('done');
							});
						});
					}
				});
			});
		});
	});
};
