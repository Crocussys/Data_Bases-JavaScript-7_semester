var http = require("http");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("students.db");
http.createServer(function (request, response) {
 response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
 response.write(
 "<!DOCTYPE html>\n" +
 "<html>\n" +
 " <head>\n" +
 " <meta charset='utf-8'>\n" +
 " </head>\n" +
 " <body>\n"
 );
 db.all("SELECT * FROM Student", function(err, rows) {
    if(err) {
    response.write("<div style='font-size: 30px; color:red'>" + err + "</div>\n");
    } else {
    response.write("<table>\n");
   
    for(var i = 0; i < rows.length; i++) {
    var row = rows[i];
    response.write("<tr><td>" + row.name + "</td><td>" + row.grp + "</td><td>" + row.address + "</td><td>" + row.age + "</td></tr>\n");
    }
   
    response.write("</table>\n");
    }
   
    response.end(
        " </body>\n" +
        "</html>\n"
        );
        });
       }).listen(3000);
       console.log("Server running at http://localhost:3000/");