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
    var sql = 'select * from products where product_id =' + pid;

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
    if(id!=""){
    var title = req.body.title;
    var price = req.body.price;
    var date=req.body.date;
    var block1="";
    var block2="";
    var block3="";
    var fsql=`update products set`;
    if(title!=""){block1=` title='${title}'`;}else{block1=" title=''";}
    if(price!=""){block2=` price='${price}'`;}else{block2=" price='0'";}
    if(date!=""){block3=` created_at='${date}'`;
    block3=block3.replace('GMT+0700 (GMT+07:00)','')
}  
    var lsql=` where product_id = ${id}`;
    var sql=fsql+block1+","+block2+","+block3+lsql;
    db.query(sql)
        .then(function(data)
        {
            res.redirect('/product');
        })
        .catch(function(data)
        {
            console.log('ERROR' + error);
        })
    }
});
app.post('/product/insert',function(req,res){
    var id=req.body.id;
var name=req.body.name;
var price=req.body.price;
    if(id!=""&&name!=""&&price!=""){
var sql = `INSERT INTO products (product_id, title, price)
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
    WHERE product_id=${id_delete};`
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
    var sql='select purchases.user_id,purchases.name,users.email,sum(purchase_items.price) as price from purchases inner join users on users.user_id=purchases.user_id inner join purchase_items on purchase_items.purchase_id=purchases.purchase_id group by purchases.user_id,purchases.name,users.email order by sum(purchase_items.price) desc LIMIT 25;'
    db.any(sql)
        .then(function (data) 
        {
            // console.log('DATA' + data);
            res.render('pages/buyer', { buyer: data });
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});
app.post('/search',function(req,res){
var info=req.body.Search_input;
var sql=`select * from products where upper(title) like upper('%${info}%')`;
db.any(sql)
        .then(function (data) 
        {
            res.render('pages/search', { search: data ,info});
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
console.log(sql);
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