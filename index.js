var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(process.env.PORT || 3000);
var pg = require('pg');
var config = {
	user: 'lxfkuxyihgnmcj',
	database: 'd95h9e01g63aq3',
	password: '434f2a37175435987ff30e6cbce21a2b134cc12c14069ddf29cff7fd8142097a',
	host: 'ec2-18-235-97-230.compute-1.amazonaws.com',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,

};

var bodyParser = require('body-parser');

var urlencodeParser = bodyParser.urlencoded({ extended: false });

var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, './public/avatar')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}

})

var upload = multer({ storage: storage }).single('uploadfile');

var pool = new pg.Pool(config);

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
	
});

app.get("/product/list", function(req,res){

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
			res.render("list",{data:result});
		});

	});
	
});

app.get("/product/delete/:id", function(req,res){
pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query('delete from product where id ='+req.params.id, function(err, result){
			done();

			if(err) {
				res.end();
				return console.error('error running query', err);

			}
			res.redirect("../list");
		});

	});

});
app.get("/product/add", function(req,res){
	res.render("add");
});

app.post("/product/add",urlencodeParser, function(req,res){
	upload(req, res, function(err){
		if (err){
			res.send("loi");
		}else{
			if(req.file == undefined){
				res.send("file chua duoc chon");
			}else{
				pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var sql = "insert into product (name, description, image) values('"+req.body.name+"','"+req.body.description+"','"+req.file.originalname+"')";
		client.query(sql, function(err, result){
			done();

			if(err) {
				res.end();
				return console.error('error running query', err);

			}
			res.redirect("../list");
		});

	});
			}
			
		}
	})
})


