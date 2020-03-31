var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(process.env.PORT || 3000);
var pg = require('pg');
var config = {
	user: 'postgres',
	database: 'asm2',
	password: '434f2a37175435987ff30e6cbce21a2b134cc12c14069ddf29cff7fd8142097a',
	host: 'ec2-18-235-97-230.compute-1.amazonaws.com',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,

};
var pool = new pg.pool(config);

app.get("/",function(req,res){
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query('select * from product', function(err, result){
			done();

			if(err) {
				res.end();
				return console.error('error running query', err);

			}
			res.render("home",{data:result});
		});

	});
	
})