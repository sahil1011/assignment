const { Console } = require('console');

class Data {
    constructor(student, course) {
        this.students = student;
        this.courses = course;
    }
}
var initalize = () => {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        //Reading student data from file
        try {
            studentDataFromFile = JSON.parse(fs.readFileSync('data/students.json', 'utf8'));
        } catch (err) {
            reject("unable to read students.json");
        }
        //Reading course data from file
        try {
            courseDataFromFile = JSON.parse(fs.readFileSync('data/courses.json', 'utf8'));
        } catch (err) {
            reject("unable to read courses.json");
        }
        dataCollection = new Data(studentDataFromFile, courseDataFromFile);
        resolve();
    });
}
var getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {
        studentsList = dataCollection.students.filter(student => student.course == course);
        if (studentsList.length > 0) {
            resolve(studentsList);
        } else {
            reject("no results returned");
        }
    });
}
var getStudentByNum = (num) => {
    return new Promise((resolve, reject) => {
        studentsList = dataCollection.students.filter(student => student.studentNum == num);
        console.log(studentsList.length);
        if (studentsList.length > 0) {
            resolve(studentsList);
        } else {
            reject("no results returned");
        }
    });
}

var getAllStudents = () => {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        }
        reject("Unable to access list of Students ,no result returned");
    });
}
var getCourses = () => {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        }
        reject("Unable to access list of courses ,no results returned");
    });
}
var getTAs = () => {
    return new Promise((resolve, reject) => {
        TAList = dataCollection.students.filter(student => student.TA);
        if (TAList.length > 0) {
            resolve(TAList);
        }
        reject("Unable to access list of TAs ,no results returned");
    });
}
var addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        if(studentData.TA == null){
            studentData.TA=false;
        }else{
            studentData.TA=true;
        }
        studentData.studentNum=dataCollection.students.length+1;
        dataCollection.students.push(studentData);
        resolve();
    });
}
module.exports = { initalize, getAllStudents, getTAs, 
    getCourses, getStudentsByCourse, getStudentByNum,addStudent};
