"use strict";

//starting the page up
document.addEventListener("DOMContentLoaded", init);

//all my variables
let allStudents = [];
let pureBlood = [];
let halfBlood = [];
let muggle = [];

const studentObj = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  house: "",
  blood: "",
  expelled: false,
  squad: false,
  prefect: false,
};

const jsonURL = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodURL = "https://petlatkea.dk/2021/hogwarts/families.json";

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};
//starting off the page
function init() {
  registerButtons();
  loadBlood();
  loadJSON();
}

//Register Buttons
function registerButtons() {
  console.log("registerBtns");
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  // document.querySelectorAll("[data-action='sort']").forEach((th) => th.addEventListener("click", selectSorting));
}

async function loadJSON() {
  console.log("loadJSON");

  const response = await fetch(jsonURL);
  const jsonData = await response.json();

  prepareStudents(jsonData);
}

async function loadBlood() {
  console.log("loadBlood");

  const response = await fetch(bloodURL);
  const bloodData = await response.json();
  prepareBlood(bloodData);
}

//Prepare students
function prepareStudents(jsonData) {
  allStudents = jsonData.map(prepareObject);

  displayList(allStudents, pureBlood, halfBlood);
  // allStudents.forEach(displayList);
}
function prepareObject(elm) {
  const newObj = Object.create(studentObj);

  const cleanedUpName = elm.fullname.replaceAll("-", " ").trim().toLowerCase();
  const splittedName = cleanedUpName.split(" ");

  newObj.firstName = firstLetterUpperCase(splittedName[0]);
  newObj.middleName = splittedName.length === 3 && !splittedName[1].includes('"') ? splittedName[1] : "";
  newObj.lastName = splittedName.length > 1 ? firstLetterUpperCase(splittedName.slice(-1)[0]) : " ";
  newObj.nickName = splittedName.length === 3 && splittedName[1].includes('"') ? firstLetterUpperCase(splittedName[1].replaceAll('"', "")) : "";
  newObj.house = firstLetterUpperCase(elm.house.replaceAll(" ", "").toLowerCase());
  newObj.studentImage = `${newObj.lastName.toLowerCase()}_${newObj.firstName.charAt(0).toLowerCase()}.png`;

  return newObj;
}

function firstLetterUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayList(student) {
  student.forEach(determineBloodStatus);
  student.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document.querySelector("#studentTemplate").content.cloneNode(true);

  clone.querySelector('[data-field="firstName"]').textContent = student.firstName;
  clone.querySelector('[data-field="lastName"]').textContent = student.lastName;
  clone.querySelector('[data-field="house"]').textContent = student.house;
  clone.querySelector('[data-field="image"] img').src = `images/${student.studentImage}`;
  clone.querySelector('[data-field="blood"] img').src = `images/${student.blood}.png`;

  document.querySelector("#studentList").appendChild(clone);
}
//fixing blood status
function prepareBlood(bloodData) {
  pureBlood = bloodData.pure;
  halfBlood = bloodData.half;
}

function determineBloodStatus(student) {
  // console.log(pureBlood);
  // console.log(halfBlood);
  if (pureBlood.includes(student.lastName)) {
    student.blood = "pureblood";
  }
  if (pureBlood.includes(student.lastName) && halfBlood.includes(student.lastName)) {
    student.blood = "halfblood";
  }
  if (halfBlood.includes(student.lastName)) {
    student.blood = "halfblood";
  }
  if (!pureBlood.includes(student.lastName) && !halfBlood.includes(student.lastName)) {
    student.blood = "muggleblood";
  }

  console.log(student.blood);
}

//fixing house crests
//fixing images for leanne, padma, parvati

//Filtering

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filter = filter;
  buildList();
}

function filterList(filteredList) {
  // filteredList = allStudents;
  if (settings.filter === "Ravenclaw") {
    //Create a filteredlist of ravenclaw
    filteredList = filteredList.filter(isRavenclaw);
  } else if (settings.filter === "Hufflepuff") {
    //Create a filteredlist of hufflepuff
    filteredList = filteredList.filter(isHufflepuff);
  } else if (settings.filter === "Slytherin") {
    //Create a filteredlist of slytherin
    filteredList = filteredList.filter(isSlytherin);
  } else {
    settings.filter === "Gryffindor";
    //Create a filteredlist of gryffindor
    filteredList = filteredList.filter(isGryffindor);
  }

  return filteredList;
}

function isRavenclaw(students) {
  return students.type === "Ravenclaw";
}

function isHufflepuff(students) {
  return students.type === "Hufflepuff";
}
function isSlytherin(students) {
  return students.type === "Slytherin";
}
function isGryffindor(students) {
  return students.type === "Gryffindor";
}
