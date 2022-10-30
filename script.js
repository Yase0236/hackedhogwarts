"use strict";

//starting the page up
document.addEventListener("DOMContentLoaded", init);

//all my variables
let allStudents = [];

let searchArray = [];

let expelledArray = [];
let squadArray = [];
let prefectArray = [];

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
  gender: "",
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
  document.querySelectorAll("[data-action='search']").forEach((option) => option.addEventListener("input", selectSearch));
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
  const gender = elm.gender;

  newObj.firstName = firstLetterUpperCase(splittedName[0]);
  newObj.middleName = splittedName.length === 3 && !splittedName[1].includes('"') ? splittedName[1] : "".substring(1, 0).toUpperCase();
  newObj.lastName = splittedName.length > 1 ? firstLetterUpperCase(splittedName.slice(-1)[0]) : " ";
  newObj.nickName = splittedName.length === 3 && splittedName[1].includes('"') ? firstLetterUpperCase(splittedName[1].replaceAll('"', "")) : "";
  newObj.house = firstLetterUpperCase(elm.house.replaceAll(" ", "").toLowerCase());
  newObj.studentImage = `${newObj.lastName.toLowerCase()}_${newObj.firstName.charAt(0).toLowerCase()}.png`;
  newObj.gender = gender.substring(1, 0).toUpperCase() + gender.substring(1).toLowerCase();

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
  // if (!student.house) console.log(student);
  if (student.house) clone.querySelector('[data-field="house"] img').src = `images/${student.house}.png`;
  // console.log(student.blood);
  if (student.blood) clone.querySelector('[data-field="blood"] img').src = `images/${student.blood}.png`;

  if (student.firstName === "Leanne") {
    clone.querySelector('[data-field="image"] img').src = `images/anonymus.png`;
  } else if (student.firstName === "Padma") {
    clone.querySelector('[data-field="image"] img').src = `images/patil_padma.png`;
  } else if (student.firstName === "Parvati") {
    clone.querySelector('[data-field="image"] img').src = `images/patil_parvati.png`;
  } else {
    clone.querySelector('[data-field="image"] img').src = `images/${student.studentImage}`;
  }
  // modal
  clone.querySelector(".student_card").addEventListener("click", () => {
    document.querySelector(".modal").classList.remove("hide");
    document.querySelector(".modal_firstname").textContent = student.firstName;
    document.querySelector(".modal_middlename").textContent = student.middleName;
    document.querySelector(".modal_lastname").textContent = student.lastName;
    document.querySelector(".modal_nickname").textContent = student.nickName;
    document.querySelector(".modal_gender").textContent = student.gender;
    document.querySelector(".modal_image").src = `images/${student.studentImage}`;

    if (student.firstName === "Leanne") {
      document.querySelector(".modal_image").src = `images/anonymus.png`;
    } else if (student.firstName === "Padma") {
      document.querySelector(".modal_image").src = `images/patil_padma.png`;
    } else if (student.firstName === "Parvati") {
      document.querySelector(".modal_image").src = `images/patil_parvati.png`;
    } else {
      document.querySelector(".modal_image").src = `images/${student.studentImage}`;
    }

    document.querySelector(".house_crest").src = `images/${student.house}.png`;
    document.querySelector(".closeButton").addEventListener("click", () => {
      document.querySelector(".modal").classList.add("hide");
    });
  });

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

// filtering students

function selectFilter(event) {
  settings.filterValue = event.target.dataset.filter;
  setFilter();
  console.table(setFilter());
  settings.displayedArray = setFilter();
  displayList();
}

function setFilter() {
  let filteredStudents = allStudents.filter(filtered);

  if (document.querySelector("#filter").textContent !== "filter " && document.querySelector("#filter").textContent !== "filter ") {
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

//search bar

function selectSearch(event) {
  console.log("Hello");
  let search = event.target.value;
  // let searchedStudents = allStudents.filter(searchTerm);

  searchArray = allStudents.filter(searchTerm);

  function searchTerm(student) {
    if (student.lastName && student.firstName.toLowerCase().includes(search)) {
      return true;
    } else if (student.firstName.toLowerCase().includes(search) || student.lastName.toLowerCase().includes(search)) {
      return true;
    } else return false;
  }
  // console.log(searchArray);
  // searchArray.forEach((stud) => {
  //   displayStudent(stud);
  // });
  settings.displayedArray = searchArray;
  displayList();
}
