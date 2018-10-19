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
            // console.log('DATA' + data);
            res.render('pages/product', { products: data });
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});
app.get('/product/:pid', function(req, res)
{
    var pid = req.params.pid;
    var sql = 'select * from products where id =' + pid;

    db.any(sql)
        .then(function (data)
        {
            res.render('pages/product_edit', { product: data[0] });
        })
        .catch(function (error) 
        {
            console.log('ERROR' + error);
        })
});
app.post('/product/update', function(req, res)
{
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var date=req.body.date;
    var sql = `update products set title = '${title}', price = ${price},created_at='${date}' where id = ${id}`;
    db.query(sql)
        .then(function(data)
        {
            res.redirect('/product');
        })
        .catch(function(data)
        {
            console.log('ERROR' + error);
        })
});
app.post('/product/insert',function(req,res){
    var id=req.body.id;
var name=req.body.name;
var price=req.body.price;
    if(id!=""&&name!=""&&price!=""){
var sql = `INSERT INTO products (id, title, price)
VALUES (${id}, '${name}', ${price})`;
console.log(sql);
    db.query(sql)
        .then(function(data)
        {
            res.redirect('/product');
        })
        .catch(function(data)
        {
            console.log('ERROR' + error);
        })
    }else{
        res.redirect('/product');
    }
});
app.post('/delete', function(req, res) {
    var id_delete=req.body.id_delete;
    var sql=`DELETE FROM products
    WHERE id=${id_delete};`
    db.query(sql)
    .then(function(data)
    {
        res.redirect('/product');
    })
    .catch(function(data)
    {
        console.log('ERROR' + error);
    })
});
app.get('/buyer', function(req, res) {
    res.render('pages/buyer');
});
app.get('/sold', function(req, res) {
    var sql ='select products.product_id,products.title,sum(purchase_items.quantity) as quantity,sum(purchase_items.price) as price from products inner join purchase_items on purchase_items.product_id=products.product_id group by products.product_id;select sum(quantity) as squantity,sum(price) as sprice from purchase_items';
    db.multi(sql)
    .then(function  (data) 
    {
 
        // console.log('DATA' + data);
        res.render('pages/sold', {sold: data[0],sum: data[1]});
    })
    .catch(function (data) 
    {
        console.log('ERROR' + error);
    })
});
app.listen(3000);