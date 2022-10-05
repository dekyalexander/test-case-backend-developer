//use mysql database
const mysql = require("mysql");

//konfigurasi koneksi
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "deky17",
  database: "db_infra_solusi_indonesia",
});

//connect ke database
conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected...");
});

// route api crud
let http = require("http");
let url = require("url");
let qs = require("querystring");
let port = 8000;
http
  .createServer(function (req, res) {
    let q = url.parse(req.url, true);

    let id = q.query.id;
    res.setHeader("Content-Type", "application/json");

    if (q.pathname == "/read" && req.method === "GET") {
      if (id === undefined) {
        //list crud
        let sql = "SELECT * FROM tbl_crud";
        conn.query(sql, (err, result) => {
          if (err) throw err;

          res.end(JSON.stringify(result));
        });
      } else if (id > 0) {
        //get one crud
        let sql = "SELECT * FROM tbl_crud where id = " + id;

        conn.query(sql, (err, result) => {
          if (err) throw err;

          var crud = result[0];
          res.end(JSON.stringify(crud));
        });
      }
    } else if (q.pathname == "/create" && req.method === "POST") {
      //save crud
      var body = "";
      req.on("data", function (data) {
        body += data;
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) req.connection.destroy();
      });

      req.on("end", function () {
        var postData = qs.parse(body);
        let nik = postData.nik;
        let nama_lengkap = postData.nama_lengkap;
        let tempat_lahir = postData.tempat_lahir;
        let tanggal_lahir = postData.tanggal_lahir;
        let sql = `insert into tbl_crud (nik, nama_lengkap, tempat_lahir, tanggal_lahir) values ( '${nik}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}' )`;
        conn.query(sql, (err, result) => {
          if (err) throw err;

          if (result.affectedRows == 1) {
            res.end(JSON.stringify({ message: "success" }));
          } else {
            res.end(JSON.stringify({ message: "gagal" }));
          }
        });
      });
    } else if (q.pathname == "/update" && req.method === "PUT") {
      //update crud
      var body = "";
      req.on("data", function (data) {
        body += data;
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) req.connection.destroy();
      });

      req.on("end", function () {
        var postData = qs.parse(body);
        let nik = postData.nik;
        let nama_lengkap = postData.nama_lengkap;
        let tempat_lahir = postData.tempat_lahir;
        let tanggal_lahir = postData.tanggal_lahir;
        let sql = `UPDATE  tbl_crud set nik = '${nik}', nama_lengkap = '${nama_lengkap}', tempat_lahir = '${tempat_lahir}', tanggal_lahir = '${tanggal_lahir}' where id = ${id}`;
        conn.query(sql, (err, result) => {
          if (err) throw err;

          if (result.affectedRows == 1) {
            res.end(JSON.stringify({ message: "success" }));
          } else {
            res.end(JSON.stringify({ message: "gagal" }));
          }
        });
      });
    } else if (q.pathname == "/delete" && req.method === "DELETE") {
      //delete crud
      let sql = `DELETE FROM tbl_crud where id = ${id}`;
      conn.query(sql, (err, result) => {
        if (err) throw err;

        if (result.affectedRows == 1) {
          res.end(JSON.stringify({ message: "success" }));
        } else {
          res.end(JSON.stringify({ message: "gagal" }));
        }
      });
    } else {
      res.end();
    }
  })
  .listen(port);
console.log("server is running on http://localhost:" + port);
