/********************************************************************************* *  WEB700 – Assignment 03 
 * *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part  
 * *  of this assignment has been copied manually or electronically from any other source  
 * *  (including 3rd party web sites) or distributed to other students. 
 * *  *  Name: sahil arora Student ID: 150165215 Date: 2632/2022 
 * * ********************************************************************************/


var HTTP_PORT = process.env.PORT || 8080;
var express = require('express');
var app = express();
var path = require('path');
var collegeData = require("./modules/collegeData");
var exphbs = require('express-handlebars');
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        select: function (selected, options) {
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& selected="selected"');
        }
    }
}));

app.set("view engine", ".hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute =
        "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.get("/", (req, res) => {
    res.render('home');
});
app.get("/about", (req, res) => {
    res.render('about');
});
app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});
app.get("/students/add", (req, res) => {
    res.render('addStudent');
});
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(
            data => {
                res.redirect("/students");
            })
        .catch(
            error => {
                res.json({ message: "no results" });
            });
});
app.get('/students', function (req, res) {

    if (req.query.course == null) {
        collegeData.getAllStudents()
            .then(
                data => {
                    res.render("students", { students: data });
                })
            .catch(
                error => {
                    res.render("students", { message: "no results" });
                });
    }
    else {
        collegeData.getStudentsByCourse(req.query.course)
            .then(
                data => {
                    res.render("students", { students: data });
                })
            .catch(
                error => {
                    res.render("students", { message: "no results" });
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
                res.json({ message: "no results" });
            });
})
app.get('/courses', function (req, res) {
    collegeData.getCourses()
        .then(
            data => {
                res.render("courses", { courses: data });
            })
        .catch(
            error => {
                res.render("courses", { message: "no results" });
            });
})
app.get('/course/:id', function (req, res) {
    collegeData.getCourseById(req.params.id)
        .then(
            data => {
                res.render("course", { course: data });
            })
        .catch(
            error => {
                res.render("course", { message: "no results" });
            });
})
app.get('/student/:num', function (req, res) {
    console.log(req.params.num);
    collegeData.getStudentByNum(req.params.num)
        .then(
            data => {
                res.render("student", { student: data })
            })
        .catch(
            error => {
                res.json({ message: "no results" });
            });
})
app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(
            data => {
                res.redirect("/students");
            })
        .catch(
            error => {
                res.json({ message: "no results" });
            });
});
app.get('*', function (req, res) {
    res.status(400).send("Page Not Found")
});

app.listen(HTTP_PORT, () => {
    collegeData.initalize().then();
});