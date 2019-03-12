const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "msg"
});
connection.connect();

app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  if(req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
  else next();
});

app.use(express.static("./static"));
// {code: 0, error: ''}
// 添加失败， code: 100
// 删除失败， code: 101

app.get("/msg", function(req, res) {
  let sql = "select * from msg order by created_at desc";
  connection.query(sql, function(err, results, fields) {
    if (err) {
      res.json([]);
      return;
    }
     res.json(results);
    console.log(typeof results);
    
  });
});
app.delete("/msg", function(req, res) {
  let id = req.query.id;
  let sql = `delete from msg where id = '${id}'`;
  connection.query(sql, function(err, results, fields) {
    if (err) {
      //
      res.json({
        code: 101,
        error: err
      });
      return;
    }
    res.json({
      code: 0
    });
  });
});
app.post("/msg", function(req, res) {
  var username = req.body.username;
  var content = req.body.content;
  console.log("post /msg", username, content);
  var sql = `insert into msg(username, content) values ('${username}', '${content}')`;
  connection.query(sql, function(err) {
    if (err) {
      //
      res.json({
        code: 100,
        error: err
      });
      return;
    }
    res.json({
      code: 0
    });
  });
});
//找到当前id下的数据
// app.get("/msg/getOne", function(req, res) {
//   let id = req.query.id;//获取得到的要编辑对象的id
//   let sql = `select * from msg where id=${id}`;
//   connection.query(sql, function(err, results, fields) {
//     if (err) {
//       res.json([]);
//       return;
//     }
//     res.json(results);
//   });
// });

//改
app.put("/msg", function(req, res) {
  let name = req.body.username;
  let content = req.body.content;
  let id = req.body.id;
  let sql = `UPDATE msg SET username = '${name}', content = '${content}' where id = '${id}'`;
  console.log(sql);
  connection.query(sql, function(err) {
    if (err) {
      res.json({
        code: 102,
        error: err
      });
      return;
    }
    res.json({
      code: 0
    });
  });
});

app.listen(3000);
