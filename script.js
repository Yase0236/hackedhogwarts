"use strict";

//starting the page up
document.addEventListener("DOMContentLoaded", init);

//==================all my variables==================
let allStudents = [];

let searchArray = [];
let expelledArray = [];
let squadArray = [];
let prefectArray = [];

let systemHacked = false;

let pureBlood = [];
let halfBlood = [];
let muggle = [];

const houses = {
  gryffindor: [],
  ravenclaw: [],
  hufflepuff: [],
  slytherin: [],
};

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
//==================starting off the page==================
function init() {
  registerButtons();
  loadBlood();
  loadJSON();
}

//==================Register Buttons==================
function registerButtons() {
  // console.log("registerBtns");
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((p) => p.addEventListener("click", selectSort));
  document.querySelectorAll("[data-action='search']").forEach((option) => option.addEventListener("input", selectSearch));
  document.querySelector(".hidden_button").addEventListener("click", hackTheSystem);

  document.querySelector(".all_students").addEventListener("click", displayList);
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

//==================Prepare students==================
function prepareStudents(jsonData) {
  allStudents = jsonData.map(prepareObject);
  allStudents.forEach((stud) => {
    houses[stud.house.toLowerCase()].push(stud);
  });
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
  } else if (student.firstName === "Jasmin") {
    clone.querySelector('[data-field="image"] img').src = `images/ersan_j.png`;
  } else {
    clone.querySelector('[data-field="image"] img').src = `images/${student.studentImage}`;
  }
  //==================modal==================
  clone.querySelector(".student_card").addEventListener("click", () => {
    document.querySelector(".modal").classList.remove("hide");
    if (student.expelled) {
      document.querySelector(".expell_animation").classList.remove("hide");
    } else document.querySelector(".expell_animation").classList.add("hide");

    if (student.prefect) {
      document.querySelector(".prefect_image").classList.remove("hidden");
    } else document.querySelector(".prefect_image").classList.add("hidden");

    if (student.squad) {
      document.querySelector(".squad_image").classList.remove("hidden");
    } else document.querySelector(".squad_image").classList.add("hidden");

    // From here, it should be specific
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
      document.querySelector(".prefect_button").removeEventListener("click", makeStudentPrefect);
      document.querySelector(".squad_button").removeEventListener("click", makeSquad);
      informationUpdate();
      filtered();
    });

    //=================expell animation on modal=================
    document.querySelector(".expell_button").addEventListener("click", () => {
      if (student.firstName === "Jasmin") {
        student.expelled = false;
        alert("You cannot expell this student!!! lol");
      } else if (student.expelled === false) {
        student.expelled = true;
        document.querySelector(".expell_animation").classList.remove("hide");
        expelledArray.push(student);

        allStudents.splice(allStudents.indexOf(student), 1);
        console.log(expelledArray);
      }
    });

    //=================prefect appearing on modal=================
    document.querySelector(".prefect_button").addEventListener("click", makeStudentPrefect);

    function makeStudentPrefect() {
      const selectedStudent = student;
      const prefects = allStudents.filter((student) => student.prefect);
      const prefectOptions = prefects.filter((student) => student.house === selectedStudent.house);

      if (prefectOptions.length >= 2) {
        deleteAorB(prefectOptions[0], prefectOptions[1]);
      } else {
        makePrefect(selectedStudent);
      }

      function deleteAorB(otherA, otherB) {
        document.querySelector("#remove_aorb").classList.remove("hide");
        document.querySelector("#remove_aorb .close").addEventListener("click", closeDialog);
        document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

        //Show names on buttons
        document.querySelector("[data-field=prefectA]").textContent = otherA.firstName;
        document.querySelector("[data-field=prefectB]").textContent = otherB.firstName;

        function closeDialog() {
          document.querySelector("#remove_aorb").classList.add("hide");
          document.querySelector("#remove_aorb .close").removeEventListener("click", closeDialog);
          document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
          document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
        }

        function clickRemoveA() {
          //if removeA:
          removePrefect(otherA);
          makePrefect(selectedStudent);
          // buildList();
          closeDialog();
        }

        function clickRemoveB() {
          //else - if removeB
          removePrefect(otherB);
          makePrefect(selectedStudent);
          // buildList();
          closeDialog();
        }
      }

      function removePrefect(selectedStudent) {
        selectedStudent.prefect = false;

        prefectArray.splice(prefectArray.indexOf(student), 1);
        document.querySelector(".prefect_image").classList.add("hidden");
      }
      function makePrefect(selectedStudent) {
        selectedStudent.prefect = true;

        document.querySelector(".prefect_image").classList.remove("hidden");
        prefectArray.push(student);
      }
    }

    //=================squad appearing on modal=================
    document.querySelector(".squad_button").addEventListener("click", makeSquad);

    function makeSquad() {
      if (systemHacked === true) {
        if (student.squad === false) {
          if ((student.house === "Slytherin" && student.blood === "pureblood") || student.blood === "pureblood") {
            student.squad = true;
            document.querySelector(".squad_image").classList.remove("hidden");
            squadArray.push(student);
            console.log(squadArray);

            setTimeout(function () {
              student.squad = false;
              squadArray.splice(squadArray.indexOf(student), 1);
              console.log(squadArray);
              document.querySelector(".squad_image").classList.add("hidden");
              return;
            }, 1000);
          }
          return;
        } else if (student.squad === true) {
          student.squad = false;
          squadArray.splice(squadArray.indexOf(student), 1);
          console.log(squadArray);
          document.querySelector(".squad_image").classList.add("hidden");
          return;
        }
      } else if (systemHacked === false) {
        if (student.squad === false) {
          if ((student.house === "Slytherin" && student.blood === "pureblood") || student.blood === "pureblood") {
            student.squad = true;
            document.querySelector(".squad_image").classList.remove("hidden");
            squadArray.push(student);
            console.log(squadArray);
          }
          return;
        } else {
          student.squad = false;
          squadArray.splice(squadArray.indexOf(student), 1);
          console.log(squadArray);
          document.querySelector(".squad_image").classList.add("hidden");
          return;
        }
      }
    }
  });

  function informationUpdate() {
    document.querySelector("#total_students").textContent = allStudents.length;
    document.querySelector("#gryffindor_students").textContent = houses.gryffindor.length;
    document.querySelector("#ravenclaw_students").textContent = houses.ravenclaw.length;
    document.querySelector("#slytherin_students").textContent = houses.slytherin.length;
    document.querySelector("#hufflepuff_students").textContent = houses.hufflepuff.length;

    document.querySelector("#expelled_students").textContent = expelledArray.length;
    document.querySelector("#squad_students").textContent = squadArray.length;
    document.querySelector("#prefect_students").textContent = prefectArray.length;
  }
  informationUpdate();
  document.querySelector("#studentList").appendChild(clone);
}
//==================fixing blood status==================
function prepareBlood(bloodData) {
  pureBlood = bloodData.pure;
  halfBlood = bloodData.half;
}

function determineBloodStatus(student) {
  let myRand;
  if (systemHacked === true) {
    if (halfBlood.includes(student.lastName) || (!pureBlood.includes(student.lastName) && !halfBlood.includes(student.lastName))) {
      student.blood = "pureblood";
    } else if (pureBlood.includes(student.lastName)) {
      myRand = Math.floor(Math.random() * 2) + 1;
      if (myRand === 1) {
        student.blood = "halfblood";
      } else if (myRand === 2) {
        student.blood = "muggleblood";
      }
    }
  } else if (systemHacked === false) {
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
  }
}

//==================fixing house crests==================

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
}

//==================filtering students==================

function selectFilter(event) {
  settings.filterValue = event.target.dataset.filter;
  settings.filterType = event.target.dataset.type;

  console.log(settings.filterValue);
  setFilter(event);
  settings.displayedArray = setFilter(event);
  displayList();
}

function setFilter(event) {
  let filteredStudents;

  if (event.target.dataset.filter === "*") {
    filteredStudents = allStudents.filter((stud) => {
      if (!stud.expelled) return stud;
    });
  } else {
    if (event.target.dataset.filter !== `Expelled`) {
      filteredStudents = allStudents.filter(filtered);
    } else {
      filteredStudents = expelledArray.filter(filtered);
    }
  }
  return filteredStudents;
}
function filtered(student) {
  console.log(student);
  // if filtering by house do this
  if (settings.filterType === "house") {
    if (student.house === settings.filterValue) {
      return true;
    } else if (settings.filterValue === "All houses") {
      return true;
    } else {
      return false;
    }
  }
  // if filtering by expelled do this
  if (settings.filterType === "expelled") {
    if (student.expelled) {
      return true;
    } else {
      return false;
    }
  }
  //if filtering by squad
  if (settings.filterType === "squad") {
    if (student.squad) {
      return true;
    } else {
      return false;
    }
  }
  // if filtering by prefects
  if (settings.filterType === "prefect") {
    if (student.prefect) {
      return true;
    } else {
      return false;
    }
  }
}
function buildList() {
  const filteredList = filtered(filteredStudents);
  return filteredList;
}

//==================Sorting students==================
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

//==================search bar==================

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

//==================hacking==================

function hackStyling() {
  document.querySelector("body").classList.add("hacked");
  document.querySelector("#background").classList.add("hackedBackground");
}
function insertNewStudent() {
  const me = {
    firstName: "Jasmin",
    middleName: "",
    lastName: "Ersan",
    nickName: "Min.e",
    house: "Hufflepuff",
    blood: "Muggle",
    gender: "Girl",
    studentImage: "",
    expelled: false,
    squad: false,
    prefect: false,
  };
  allStudents.push(me);
}
function hackTheSystem() {
  systemHacked = true;
  console.log("systemHacked");
  hackStyling();
  insertNewStudent();

  setTimeout(function () {
    alert("You've been hacked!!!!!!");
  }, 0);

  displayList();
}
