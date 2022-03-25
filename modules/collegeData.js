const { Console } = require('console');
const { resolve } = require('path');

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
        student = dataCollection.students.find(student => student.studentNum == num);
        if (student) {
            resolve(student);
        } else {
            reject("no results returned");
        }
    });
}

var updateStudent = (student) =>{
    return new Promise((resolve, reject) => {
    dataCollection.students[
        dataCollection.students.findIndex((studentA) => studentA.id === student.id)]=student;
        resolve();
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
var getCourseById = (id) => {
    course = dataCollection.courses.find(course => course.courseId == id);
    return new Promise((resolve, reject) => {
        if (course) {
            resolve(course);
        }
        reject("query returned 0 results");
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
    getCourses, getStudentsByCourse, getStudentByNum,addStudent,getCourseById,updateStudent};
