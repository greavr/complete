/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.AddRecord = (req, res) => {
    // Everything is okay.
    console.log(req.body.message);
    res.set('Access-Control-Allow-Origin', "*")
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.header("Access-Control-Allow-Headers","*")


	var mysql = require('mysql');
    var c = mysql.createConnection({
      socketPath: '/cloudsql/' + '<PROJECT ID>:<REGION>:<DB INSTANCE>',
      user     : '<DATA USER>',
      password : '<PASSWORD>',
      database: '<DATABASE>'
    });
    c.connect();
    var ThisQuery = "update products SET quickclicks = quickclicks + 1 where name = '" + req.body.message + "';";
  	console.log(ThisQuery);
  	c.query(ThisQuery, function(err, result, fields) {
  		if (!err)
    		console.log(result.affectedRows + " record(s) updated");
      		
  		else
    		console.log('Error while performing Query.' + err);
	});

	c.end();
  
    res.status(200).send('Success: ' + req.body.message);
  
};