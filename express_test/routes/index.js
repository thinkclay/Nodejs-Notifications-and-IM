/*
 * GET home page.
 */

exports.index = function(req, res){
	//logic goes here	
	res.render('index', { title: 'Express' })
};