"use strict";

//starting the page up
document.addEventListener("DOMContentLoaded", loadJSON);

//all my variables
let studentlist;
let allStudents = [];
// let prefectStudents = [];
// let expelledStudents = [];
// let squadStudents = [];

const jsonFile = "https://petlatkea.dk/2021/hogwarts/students.json";
// const template = document.getElementById("studentTemplate").content;

const studentObj = {
  firstName: "",
  middleName: "null",
  lastName: "null",
  nickName: "",
  imageSrc: "",
  house: "",
  bloodStatus: "",
  expelled: false,
  squad: false,
  prefect: false,
  hacker: false,
};

const theHacker = {
  firstName: "Jasmin",
  middleName: "",
  nickName: "",
  lastName: "Ersan",
  Photo: "",
  house: "Hufflepuff",
  bloodStatus: "Muggle",
  prefect: false,
  expelled: false,
  inSquad: false,
  hacker: true,
};

function start() {
  //should there be more elements here? (expell, squad- and prefect button/hack)
  loadJSON();
}

//loading the json file
async function loadJSON() {
  const jsonFile = await fetch("students.json");
  // const jsonBlood = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");

  let studentlistJSON = await jsonFile.json();
  createStudentList(studentlistJSON);
}

// cleaning json data
function createStudentList(studentlistJSON) {
  studentlist = studentlistJSON.map(mapIt);

  //old array needs to be deleted (just used as a test)
  console.log("old", studentlistJSON);
  console.log("new", studentlist);

  showStudentList(studentlist);
}
// creating elements and fixing issues with cap, pictures and missing names

//page needs to be refreshed twice for the student images to load perfectly :(
function mapIt(elm) {
  const newObj = Object.create(studentObj);

  const cleanedUpName = elm.fullname.replaceAll("-", " ").trim().toLowerCase();
  const splittedName = cleanedUpName.split(" ");

  newObj.firstName = firstLetterUpperCase(splittedName[0]);
  newObj.middleName = splittedName.length === 3 && !splittedName[1].includes('"') ? splittedName[1] : "";
  newObj.lastName = splittedName.length > 1 ? firstLetterUpperCase(splittedName.slice(-1)[0]) : "Unknown";
  newObj.nickName = splittedName.length === 3 && splittedName[1].includes('"') ? firstLetterUpperCase(splittedName[1].replaceAll('"', "")) : "";
  newObj.house = firstLetterUpperCase(elm.house.replaceAll(" ", "").toLowerCase());
  newObj.studentImage = getStudentImage(splittedName);

  return newObj;
}
//fixing issues with the Patils names and pictures (since the pictures wont load)
function getStudentImage(splittedName) {
  if (splittedName.slice(-1)[0].toLowerCase() === "patil") {
    return splittedName.slice(-1)[0].toLowerCase() + "_" + splittedName[0] + ".png";
  } else {
    return splittedName.slice(-1)[0].toLowerCase() + "_" + splittedName[0].charAt(0) + ".png";
  }
}

function checkImageExists(img) {
  let image = new Image();

  let url_image = "images/" + img;
  image.src = url_image;
  if (image.width == 0) {
    return false;
  } else {
    return true;
  }
}
//using inner.html to set students image and names and showing the student list
function showStudentList(listOfStudents) {
  let createList = document.querySelector("#studentList");
  const templateStart = "<table>";
  let templateContent = "";
  const templateEnd = "</table>";
  listOfStudents.forEach((element) => {
    const studentImage = checkImageExists(element.studentImage) ? element.studentImage : "anonymus.png";
    templateContent += `
    <tr>
      <td data-field="${element.imageSrc}">
        <img src="images/${studentImage}" alt="student image" />
      </td>
      <td data-field="${element.firstName}">${element.firstName + " " + element.lastName}</td>
      <td data-field="${element.icons}">
        <img src="images/squad.webp" class="hide" alt="Squad logo" />
        <img src="images/prefects.webp" class="hide" alt="Prefect logo" />
      </td>
    </tr>
    `;
  });

  createList.innerHTML = `
  ${templateStart} + ${templateContent} + ${templateEnd}`;
}

// Utils

function firstLetterUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
