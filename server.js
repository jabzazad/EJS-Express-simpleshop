var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var db = pgp('postgres://xbfkpgarhybvht:5fd0840ad36c6824a0d01b7e870db3b90677c3a21a876ebd0975848c373af50e@ec2-54-225-92-1.compute-1.amazonaws.com:5432/d506hfqcm3pofo?ssl=true')
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render('pages/index');
});
app.get('/product', function(req, res) {
    var sql ='select * from products';
    db.any(sql)
        .then(function (data) 
        {
            console.log('DATA' + data);
            res.render('pages/product', { products: data });
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});
app.get('/buyer', function(req, res) {
    res.render('pages/buyer');
});
app.get('/sold', function(req, res) {
    res.render('pages/sold');
});
app.listen(3000);