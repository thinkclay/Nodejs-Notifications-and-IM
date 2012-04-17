/*
 * 
 * 
 */
var fs = fs = require('fs');
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
	if (typeof user == 'undefined')
	{
		callback(false);
		return false;
	}
	if (typeof user.contacts == 'undefined')
	{
		callback(false);
		return false;
	}
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
	if (typeof user == 'undefined')
	{
		callback(false);
		return false;	
	}
	if (typeof user.mango_threads == 'undefined')
	{
		callback(false);
		return false;
	}
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
	if (typeof user == 'undefined')
		callback(false);
	if (typeof user.mango_tasks == 'undeinfed')
		callback(false);
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

var userLookup = function(req, callback){
	req.app.db.collection('mango_users', function(error, collection) {
		if (error) 
		{
			callback(false);
		}
		collection.find({_id : id}, {limit:1}).toArray(function(error, user) {
			if (user == null)
			{
				callback(false);	
			}
			else
			{
				user = user[0];
				this.user = user;
				callback(true);	
			}
		}); 
	});
}

var userLookup = function(req, callback){
	req.app.db.collection('mango_users', function(error, collection) {
		if (error) throw error;
		collection.find({_id : id}, {limit:1}).toArray(function(error, user) {
			if (user == null)
			{
				//console.log(user);
				callback(false);
				return false;
			}
			else
			{
				user = user[0];
				//console.log(user);
				this.user = user;
				this.data = [];
				contacts = [];
				//console.log(user);
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
							if (typeof contacts[i] != 'undefined')
							{
								if (contacts[i].status == 'active')
								{
									contacts[i].status = 'offline';
									for(x=0; x < onlineIds.length; x++)
									{
										if(contacts[i]._id == onlineIds[x])
										{
											contacts[i].status = 'online';	
										}
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
					} else { 
						callback(true); 
					}
				});
			}
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

var setId = function(req, callback){
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
                this.id = req.app.db.bson_serializer.ObjectID( theId );
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
			setId(req, function(bool){
				if (bool === true)
				{
					callback(true);
				}
			});
		} else { callback(false); }
	});
}

exports.getall = function (req, res) {
	this.notify = [];
	setUser(req, function(bool){
		if (bool === true) {
			checkMessages(function(bool) {
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
			});	
		}
		else 
		{
			json = {};
			json['success'] = false;
			json = JSON.stringify(json);
			res.end(json); 
		}
	});
};
