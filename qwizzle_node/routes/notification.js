/*/*
 * @TODO Fix this error:
 * 
 * node.js:134
        throw e; // process.nextTick error, or 'error' event on first tick
        ^
TypeError: Cannot call method 'authenticate' of null
    at /var/node/qwizzle_node/routes/notification.js:6:5
    at /var/node/qwizzle_node/node_modules/mongodb/lib/mongodb/db.js:155:16
    at [object Object].<anonymous> (/var/node/qwizzle_node/node_modules/mongodb/    lib/mongodb/connection/server.js:184:42)
    at [object Object].emit (events.js:67:17)
    at [object Object].<anonymous> (/var/node/qwizzle_node/node_modules/mongodb/    lib/mongodb/connection/connection_pool.js:110:14)
    at [object Object].emit (events.js:67:17)
    at Socket.<anonymous> (/var/node/qwizzle_node/node_modules/mongodb/lib/mongo    db/connection/connection.js:313:12)
    at Socket.emit (events.js:64:17)
    at Array.<anonymous> (net.js:831:12)
    at EventEmitter._tickCallback (node.js:126:26)
 * 
 * 
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

var checkIms = function(callback) {
	notify['im'] = 0;
	imThreads = user.im;
	process.nextTick(function() {
		for(key in imThreads)
		{
			if(imThreads[key].read == 0)
			{
				notify['im']++;
			}
		}
		process.nextTick(function() {
			callback(true);
		});
	});
};

var oc = function(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}

var checkAppointments = function(callback){
	windowOfTime = 3600;//this is number of seconds in this case it is a 60 min window
	appointments = user.mango_appointments;
	notify['appointments'] = [];
	currentTime = Math.floor(new Date().getTime()/1000);
	for(var key in appointments)
	{
		startTime = appointments[key]['start_time'];
		if((startTime - currentTime) < windowOfTime && startTime > currentTime)
		{
			notify['appointments'].push(appointments[key]);
		}
	}
	process.nextTick(function() {
		callback(true);
	});
}
var checkContacts = function(callback){
	contacts = user.contacts;
	notify['contacts'] = 0;
	process.nextTick(function() {
		for(var key in contacts)
		{
			// 'request'
			if (contacts[key]['status'] == 'request')
			{
				notify['contacts'] += 1;
			}
		}
		process.nextTick(function(){
			callback(true);
		});
	});
}

var checkMessages = function(callback){
	threads = user.mango_threads;
	threadKeys = [];
	theMessages = [];
	notify['messages'] = 0;
	process.nextTick(function() {
		for(var key in threads)
		{
			threadKeys.push(key);
		}
		process.nextTick(function() {
			for(i = 0; i < threadKeys.length; i++)
			{
				if (typeof threads[threadKeys[i]] != 'undefined')
				{
					theMessages.push(threads[threadKeys[i]].messages);	
				}
				else { callback(false); }
			}
			process.nextTick(function() {
				for(c = 0; c < theMessages.length; c++)
				{
					for(key in theMessages[c])
					{
						if(theMessages[c][key].read == 0)
						{
							notify['messages']++;
						}
					}
				}
				process.nextTick(function() {
					callback(true);
				});
			});
		});
	});
}

var checkTasks = function(callback){
	tasks = user.mango_tasks
	notify['tasks'] = 0;
	process.nextTick(function() {
		if (tasks != undefined)
		{
			for(x = 0; x < tasks.length; x++)
			{
				if(tasks[x].status == 'pending')
				{
					notify['tasks']++;
				}
			}
			process.nextTick(function() {
				callback(true);
			});	
		} else { callback(true); }
	});
}

var checkTestimonials = function(callback){
	testimonials = user.testimonials;
	testimonialKeys = [];
	notify['testimonials'] = 0;
	process.nextTick(function() {
		for(var key in testimonials)
		{
			testimonialKeys.push(key);
		}
		process.nextTick(function () {
			if(testimonials != undefined)
			{
				for(x = 0; x < testimonialKeys.length; x++)
				{
					if(testimonials[testimonialKeys[x]].status == 'pending')
					{
						notify['testimonials']++;
					}
				}
				process.nextTick(function() {
					callback(true);
				});
			} else { callback(true); }
		});
	});
}

var userLookup = function(callback){
	db.collection('mango_users', function(error, collection) {
		if (error) throw error;
		collection.find({_id : id}, {limit:1}).toArray(function(error, user) {
			user = user[0];
			this.user = user;
			callback(true);
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
		if(match)
		{
    		theId = match[1]; 
            theId = theId.replace(/\W/g, "");
            if(match == null)
            {
                callback(false);
            }
            else
            {
                try
                {
                    this.id = db.bson_serializer.ObjectID( theId ); 
                    process.nextTick(function(){
                        callback(true);
                    }); 
                }
                catch(err)
                {
                    
                    callback(false);
                }
            }    
		} else { callback(false); }
		
	});
}

var setUser = function(req, callback){
	setSessionFile(req, function(bool){
		if (bool === true)
		{
			setId(function(bool){
				if (bool === true)
				{
					userLookup(function(bool){
						if (bool === true)
						{
							callback(true);
						} else { callback(false); }
					});
				} else { callback(false); }
			});
		} else { callback(false); }
	});
}

exports.getall = function (req, res) {
	this.notify = [];
	setUser(req, function(bool){
		if (bool === true)
		{
			checkMessages(function(bool) {
				if (bool)
				{
					checkIms(function(bool) {
						checkTasks(function(bool) {
							checkContacts(function(bool) {
								checkTestimonials(function(bool){
									checkAppointments(function(bool) {
										data = {};
										for(var key in notify)
										{
											data[key] = notify[key]; 
										}
										data['success'] = true;
										process.nextTick(function(){
											json = JSON.stringify(data);
												res.end(json);
										});
									});
								});
							});
						});
					});		
				} 
				else 
				{ 
					data = {};
					data['sucess'] = false;
					res.end(JSON.stringify(data)); 
				}
			});	
		} 
		else 
		{ 
			json = {};
			json['sucess'] = false;
			json = JSON.stringify(json);
			res.end(json); 
		}
	});
};
