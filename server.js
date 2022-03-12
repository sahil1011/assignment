 /********************************************************************************* *  WEB700 – Assignment 03 
  * *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part  
  * *  of this assignment has been copied manually or electronically from any other source  
  * *  (including 3rd party web sites) or distributed to other students. 
  * *  *  Name: sahil arora Student ID: 150165215 Date: 18/2/2022 
  * * ********************************************************************************/  


var HTTP_PORT = process.env.PORT || 8080;
var express = require('express');
var app = express();
var path = require('path');
var collegeData = require("./modules/collegeData");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/home.html'));
});
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html'));
});
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/htmlDemo.html'));
});
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/addStudent.html'));
});
app.post("/students/add", (req, res) => {
    console.log("Students1");
    collegeData.addStudent(req.body)
        .then(
            data => { 
                res.redirect("/students");
            })
        .catch(
            error => {
                res.json({message:"no results"});
            });
});
app.get('/students/:course?', function (req, res) {
    if(req.params.course==null){
    collegeData.getAllStudents()
        .then(
            data => { 
               res.json(data);
            })
        .catch(
            error => {
                res.json({message:"no results"});
            });
    }
    else{
        collegeData.getStudentsByCourse(req.params.course)
        .then(
            data => {
               res.json(data);
            })
        .catch(
            error => {
                res.json({message:"no results"});
            });
    }
})
app.get('/tas', function (req, res) {
        collegeData.getTAs()
        .then(
            data => { 
               res.json(data);
            })
        .catch(
            error => {
                res.json({message:"no results"});
            });
})
app.get('/courses', function (req, res) {
        collegeData.getCourses()
        .then(
            data => { 
               res.json(data);
            })
        .catch(
            error => {
                res.json({message:"no results"});
            });
})
app.get('/student/:num', function (req, res) {
    console.log(req.params.num);
    collegeData.getStudentByNum(req.params.num)
    .then(
        data => {
           res.json(data);
        })
    .catch(
        error => {
            res.json({message:"no results"});
        });
})

app.get('*', function(req, res){
    res.status(400).send("Page Not Found")
  });

app.listen(HTTP_PORT, () => { 
    collegeData.initalize().then();
 });