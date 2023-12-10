var http = require("http");
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("students.db");
var sendResp = function (res){
    return function (err, rows){
        if (!err){
            var data = new Array();
            for (var i = 0; i < rows.length; i++){
                var row = rows[i];
                data.push({
                    "id": row.id,
                    "name": row.name,
                    "grp": row.grp,
                    "address": row.address,
                    "age": row.age
                });
            }
            res.writeHead(200, {"Content-Type": "multipart/form-data; charset=utf-8"});
            res.end(JSON.stringify({data}));
        }else{
            console.log(err);
            res.writeHead(500, {"Content-Type": "multipart/form-data; charset=utf-8"});
            res.end(err);
        }
    }
}
http.createServer(function (req, res) {
    console.log("request: " + req.url);
    switch(req.url){
        case "/":
            fs.readFile("./lab4.2.html", function(err, content){
                if (!err){
                    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    res.end(content, "utf-8");
                }else{
                    res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"});
                    res.end(err.message, "utf-8");
                    console.log(err);
                }
            });
            break;
        case "/all":
            db.all("SELECT * FROM Student", sendResp(res));
            break;
        case "/search":
            let dt = "%";
            req.on("data", chunk => {
                dt += chunk;
            });
            req.on("end", () => {
                dt += "%";
                var stmt = db.prepare("SELECT * FROM Student WHERE name LIKE ? OR grp LIKE ? OR address LIKE ?");
                stmt.run(dt, dt, dt);
                stmt.all(sendResp(res));
            });
            break;
        default:
            res.writeHead(404, {"Content-Type": "multipart/form-data; charset=utf-8"});
            res.end(JSON.stringify({"error_message": "404 Page not found"}));
    }
}).listen(3000);
console.log("Server running at http://localhost:3000/");