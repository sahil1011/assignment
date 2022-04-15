
const Sequelize = require('sequelize');
var sequelize = new Sequelize(
    'd1iphh7vkjs4eu',
    'sjojpgpljlhwwr',
    '62d12457c249b630146b8bbb1e16060ef5ee5709919d05fe6dfe8ee43a0336b1',
    {
        host: 'ec2-3-217-251-77.compute-1.amazonaws.com',
        dialect: 'postgres',
        port: 5432,
        dialectOptions:
            { ssl: { rejectUnauthorized: false } },
        query: { raw: true }
    });
var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});
var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});
Course.hasMany(Student, { foreignKey: 'course' });
var initalize = () => {
    return new Promise(
        (resolve, reject) => {
            sequelize.sync()
                .then(() => resolve())
                .catch((error) => reject("unable to sync the database"))
        })
};
var getAllStudents = () => {
    return new Promise(
        (resolve, reject) => {
            Student.findAll()
                .then((data) => {
                    resolve(data);})
                .catch((error)=>reject(error))
        })
};
var getStudentsByCourse = (course) => {
    return new Promise(
        (resolve, reject) => {
            Student.findAll()
                .then((data) => resolve(data.filter(student => student.course == course)))
                .catch((error)=>reject("no results returned"))
        })
};
var getStudentByNum = (num) => {
    return new Promise(
        (resolve, reject) => {
            Student.findAll()
                .then((data) =>{
               selectStudent =data.filter(student => student.studentNum == num);
                resolve(selectStudent);})
                .catch((error)=>reject("no results returned"))
        })
};
var getCourses = () => {
    return new Promise(
        (resolve, reject) => {
            Course.findAll()
                .then((data) =>{
                    resolve(data);})
                .catch((error)=>reject("no results returned"))
        })
};
var getCourseById = (id) => {
    return new Promise(
        (resolve, reject) => {
            Course.findAll()
                .then((data) => resolve(data.filter(course => course.courseId == id)))
                .catch((error)=>reject("no results returned"))
        })
};
var addStudent = (studentData) => {
    return new Promise(
        (resolve, reject) => {
            Student.create(checkData(studentData))
                .then((studentData) => resolve("success!"))
                .catch((error)=> reject("unable to create student"))
        })
};
var updateStudent = (studentData) => {
    return new Promise(
        (resolve, reject) => {
            Student.update(checkData(studentData), { where: {studentNum : studentData.studentNum }})
                .then((studentData) => resolve("success!"))
                .catch((error) => reject("unable to update student"))
        })
};
var addCourse = (course) => {
    return new Promise(
        (resolve, reject) => {
            Course.create(checkData(course))
                .then((course) => resolve("success!"))
                .catch((error) => reject("unable to create course"))
        })
};
var updateCourse = (course) => {
    return new Promise(
        (resolve, reject) => {
            Course.update(checkData(course),{where : { courseId : course.courseId }})
                .then((course) => resolve("success!"))
                .catch((error) => reject(error))
        })
};
var deleteCourseById = (courseId) => {
    return new Promise(
        (resolve, reject) => {
           Course.destroy({ where: {courseId: courseId }})
                .then((course) => resolve("success!"))
                .catch((error) => reject(error))
        });
};
var deleteStudentByNum = (num) => {
    return new Promise(
        (resolve, reject) => {
            Student.destroy({ where: { studentNum : num } })
                .then((studentNum) => resolve("success!"))
                .catch((error) => reject("unable to delete student"))
        });
};
var checkData = (studentData) => {
    studentData.TA = (studentData.TA) ? true : false;
    Object.entries(studentData).forEach(item => studentData.item = (studentData.item === "" 
    || studentData.item == "") ? null : studentData.item)
    return studentData;
}
module.exports = {
    initalize, getAllStudents, getCourses, getStudentsByCourse, 
    getStudentByNum, addStudent, getCourseById, updateStudent,
    addCourse,updateCourse,deleteCourseById,deleteStudentByNum
};
