/********************************************************************************* *  WEB700 – Assignment 06
 * *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part  
 * *  of this assignment has been copied manually or electronically from any other source  
 * *  (including 3rd party web sites) or distributed to other students. 
 * *  *  Name: sahil arora Student ID: 150165215 Date: 08/04/2022 
 * *  Online (Heroku) Link: https://web700-sahil.herokuapp.com/
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
    collegeData.getCourses().then((data) =>
        res.render("addStudent", { courses: data })).catch(error =>
            res.render("addStudent", { courses: [] }))
}
);
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
app.get("/courses/add", (req, res) => {
    res.render('addCourse');
});
app.post("/courses/add", (req, res) => {
    collegeData.addCourse(req.body)
        .then(
            data => {
                res.redirect("/courses");
            })
        .catch(
            error => {
                res.json({ message: "no results" });
            });
});
app.get('/students', function (req, res) {
    if (req.query.course == null) {
        collegeData.getAllStudents().then(
                data => {
                    if (data.length > 0) {
                        res.render("students", { students: data });
                    } else {
                        res.render("students", { message: "no results" });
                    }
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
                    if (data.length > 0) {
                        res.render("students", { students: data });
                    } else {
                        res.render("students", { message: "no results" });
                    }
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
                if (data.length > 0) {
                    res.render("courses", { courses: data });
                } else {

                    res.render("courses", { message: "no results" });
                }
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
                if (data) {
                    res.render("course", { course: data });
                } else {
                    res.status(404).send("Course Not Found")
                }
            })
        .catch(
            error => {
                res.render("course", { message: "no results" });
            });
})
app.get('/student/delete/:studentNum', function (req, res) {
    collegeData.deleteStudentByNum(req.params.studentNum)
        .then(
            () => {
                res.redirect("/students");
            })
        .catch(
            error => {
                res.status(500).send("Unable to Remove Student / Student not found)" );
            });
})
app.get('/course/delete/:id', function (req, res) {
    collegeData.deleteCourseById(req.params.id)
        .then(
            () => {
                res.redirect("/courses");
            })
        .catch(
            error => {
                res.status(404).send("no course to delete");
            });
})
app.get("/student/:studentNum", (req, res) => {
    // initialize an empty object to store the values  
    let viewData = {}; 
    collegeData.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"       
        } else {
            viewData.student = null; // set student to null if none were returned       
        }
    }).catch(() => {
        viewData.student = null;
        // set student to null if there was an error     
    }).then(collegeData.getCourses)
        .then((data) => {
            viewData.courses = data;
            // store course data in the "viewData" object as "courses"       
            // loop through viewData.courses and once we have found the courseId that matches   
            // the student's "course" value, add a "selected" property to the matching    
            // viewData.courses object         
            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student[0].course) {
                    viewData.courses[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.courses = [];
            // set courses to empty if there was an error    
        }).then(() => {
            if (viewData.student == null) {
                // if no student - return an error       
                res.status(404).send("Student Not Found");
            } else {
                res.render("student", { viewData: viewData });
                // render the "student" view      
            }
        });
});
app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(
            data => {
                res.redirect("/students");
            })
        .catch(
            error => {
                res.json({ message: "Error updating student" });
            });
});
app.post("/course/update", (req, res) => {
    collegeData.updateCourse(req.body)
        .then(
            data => {
                res.redirect("/courses");
            })
        .catch(
            error => {
                res.json({ message: error });
            });
});
app.get('*', function (req, res) {
    res.status(400).send("Page Not Found")
});

app.listen(HTTP_PORT, () => {
    collegeData.initalize().then();
});