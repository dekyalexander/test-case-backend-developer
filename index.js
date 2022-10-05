//use path module
const path = require("path");
//use express module
const express = require("express");
//use hbs view engine
const hbs = require("hbs");
//use bodyParser middleware
const bodyParser = require("body-parser");
//use mysql database
const mysql = require("mysql");
const app = express();

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

//set views file
app.set("views", path.join(__dirname, "views"));
//set view engine
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public sebagai static folder untuk static file
app.use("/assets", express.static(__dirname + "/public"));

//route untuk homepage
app.get("/", (req, res) => {
  let sql = "SELECT * FROM tbl_crud";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.render("crud", {
      results: results,
    });
  });
});

//route untuk insert data
app.post("/save", (req, res) => {
  let data = {
    nik: req.body.nik,
    nama_lengkap: req.body.nama_lengkap,
    tempat_lahir: req.body.tempat_lahir,
    tanggal_lahir: req.body.tanggal_lahir,
  };
  let sql = "INSERT INTO tbl_crud SET ?";
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//route untuk update data
app.post("/update", (req, res) => {
  let sql =
    "UPDATE tbl_crud SET nik='" +
    req.body.nik +
    "', nama_lengkap='" +
    req.body.nama_lengkap +
    "',tempat_lahir='" +
    req.body.tempat_lahir +
    "', tanggal_lahir='" +
    req.body.tanggal_lahir +
    "' WHERE id=" +
    req.body.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//route untuk delete data
app.post("/delete", (req, res) => {
  let sql = "DELETE FROM tbl_crud WHERE id=" + req.body.id + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//server listening
app.listen(8000, () => {
  console.log("Server is running at port 8000");
});
