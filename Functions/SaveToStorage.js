//This function connects to the MySQL Instance and does a dump per character to Bucker
exports.buildFiles = (req, res) => {
	// Parameters
	var db = 'bestbuy';
	var pwd = 'Set2=$u^qV4#5);*';
	var user = 'data_reader';
	var dbhost = '35.224.221.233';
	var targetBucket = 'rgreaves-mysite';


	//Build Connection
	var mysql = require('mysql');
	var con = mysql.createConnection({
	  host: dbhost,
	  user: user,
	  password: pwd,
	  database: db
	});

	var BreakDown = [ 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z' ];

	// Itterate connection to build file
	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	  //Itterate through array
	  BreakDown.forEach(function(value){
		var sql = 	"SELECT 'name','price','category_name','shipping','description','manufacturer','model','url','image' FROM products WHERE 'name' like '" + value + "%'";
		con.query(sql, function (err, result) {
		if (err) throw err;
			console.log(result);
	  });
	  }

	});

};

function SaveToBucket(WhichArray,objectName,bucketName) {
	
	var storage = require('@google-cloud/storage')();
	var myBucket = storage.bucket(bucketName);

	var options = {
	  entity: 'allUsers',
	  role: storage.acl.READER_ROLE
	};

	myBucket.acl.add(options, function(err, aclObject) {});

	myBucket.acl.add(options).then(function(data) {
	  var aclObject = data[0];
	  var apiResponse = data[1];
	});
}