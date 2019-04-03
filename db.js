var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{

        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE products (  ALTER TABLE id INTEGER PRIMARY KEY AUTOINCREMENT,
             name varchar(20) collate nocase,
             hint text ,
             quantity integer , 
             priceTotal real , 
             TradepriceTotal real ,
             priceForPicese real , 
             TradePricePicese real )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO products (name, hint, quantity ,priceTotal ,TradepriceTotal , priceForPicese ,  TradePricePicese) VALUES (%?%,?,?,?,?,?,?)'
                db.run(insert, ["fan","Toshiba Fane",15 , 1000 , 105 ,120 , 90 ])
                db.run(insert, ["Elag","Toshiba Flage",1502 , 100510 , 10512 ,1240 , 90 ])
                db.run(insert, ["Elag","Toshiba Flage2",1502 , 10051055 , 10512 ,1240 , 90 ])

            }
        });  
    }
});


module.exports = db