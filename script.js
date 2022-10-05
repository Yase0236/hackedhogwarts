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
  sortBy: "firstName",
  sortDir: "asc",
  filterValue: "",
  displayedArray: [],
};
//starting off the page
function init() {
  registerButtons();
  loadBlood();
  loadJSON();
}

//Register Buttons
function registerButtons() {
  // console.log("registerBtns");
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((p) => p.addEventListener("click", selectSort));
}

async function loadJSON() {
  // console.log("loadJSON");

  const response = await fetch(jsonURL);
  const jsonData = await response.json();

  prepareStudents(jsonData);
}

async function loadBlood() {
  // console.log("loadBlood");

  const response = await fetch(bloodURL);
  const bloodData = await response.json();
  prepareBlood(bloodData);
}

//Prepare students
function prepareStudents(jsonData) {
  allStudents = jsonData.map(prepareObject);
  settings.displayedArray = allStudents;
  displayList();
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

function displayList() {
  document.querySelector("#studentList").innerHTML = "";
  settings.displayedArray.forEach(determineBloodStatus);
  settings.displayedArray.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document.querySelector("#studentTemplate").content.cloneNode(true);

  clone.querySelector('[data-field="firstName"]').textContent = student.firstName;
  clone.querySelector('[data-field="lastName"]').textContent = student.lastName;
  clone.querySelector('[data-field="house"] img').src = `images/${student.house}.png`;
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
  // console.log(student.blood);
}

//fixing house crests

function prepareHouse(jsonData) {
  gryffindor = jsonData.gryffindor;
  slytherin = jsonData.slytherin;
  hufflepuff = jsonData.hufflepuff;
  ravenclaw = jsonData.ravenclaw;
}

function determineHouse(student) {
  if (gryffindor.includes(student.house)) {
    student.house = "gryffindor";
  }
  if (ravenclaw.includes(student.house)) {
    student.house = "ravenclaw";
  }
  if (hufflepuff.includes(student.house)) {
    student.house = "hufflepuff";
  }
  if (slytherin.includes(student.house)) {
    student.house = "slytherin";
  }
  // console.log(student.house);
}

// fixing images for leanne, padma, parvati

// Filtering students

function selectFilter(event) {
  settings.filterValue = event.target.dataset.filter;
  document.querySelector("#filter span").textContent = filter;
  setFilter();
  console.table(setFilter());
  settings.displayedArray = setFilter();
  displayList();
}

function setFilter() {
  let filteredStudents = allStudents.filter(filtered);
  if (document.querySelector("#filter span").textContent !== "filter " && document.querySelector("#filter span").textContent !== "filter ") {
  }
  return filteredStudents;
}
function filtered(student) {
  if (student.house === settings.filterValue) {
    return true;
  } else if (settings.filterValue === "All houses") {
    return true;
  } else {
    return false;
  }
}
function buildList() {
  const filteredList = filtered(filteredStudents);
  return filteredList;
}

// Sorting students
function selectSort(event) {
  // console.log(event.target.dataset.sortDirection);
  settings.sortBy = event.target.dataset.sort;
  settings.sortDir = event.target.dataset.sortDirection;

  // toggle direction
  if (settings.sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`User selected ${settings.sortBy} - ${settings.sortDir}`);
  sortList();
}

function sortList() {
  let sortedList = allStudents;

  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    console.log(studentA, studentA[settings.sortBy]);
    if (studentA[settings.sortBy] > studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  displayList(sortedList);
}
