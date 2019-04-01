var express = require("express")
var app = express();
var db = require("./db.js")
var md5 = require("md5")
var bodyParser = require("body-parser")
var cors = require('cors')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// Server port
var HTTP_PORT = 8000 ;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints
app.get("/api/products", (req, res, next) => {
    var sql = "select * from products"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


app.get("/api/product/:id", (req, res, next) => {
    var sql = "select * from products where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


app.get("/api/product/search/:name", (req, res, next) => {
  let SearchKey = '%' + req.params.name + '%';
  var params = [SearchKey];

  
    
     var sql = 'select * from  products   where name like ?';
console.log(sql)

    db.all(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
        
        
      });
});





// add user 
app.post("/api/product/", (req, res, next) => {
    var errors=[]
  
    var data = {
        name: req.body.name,
        hint: req.body.hint,
        quantity : req.body.quantity,
        priceTotal : req.body.priceTotal,
        TradepriceTotal : req.body.TradepriceTotal,
        priceForPicese : req.body.priceForPicese,
        TradePricePicese : req.body.TradePricePicese
    }
    var sql ='INSERT INTO products (name, hint, quantity ,priceTotal ,TradepriceTotal ,priceForPicese ,TradePricePicese) VALUES (?,?,?,?,?,?,?)'
    var params =[data.name, data.hint, data.quantity , data.priceTotal , data.TradepriceTotal , data.priceForPicese , data.TradePricePicese]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});

// update to user 
app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
});

// delete user by id  
app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

module.exports = app