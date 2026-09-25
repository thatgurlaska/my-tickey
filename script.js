// ----------------------------------
// PAGES
// ----------------------------------

const homePage = document.getElementById("homePage");
const crochetPage = document.getElementById("crochetPage");
const newProjectPage = document.getElementById("newProjectPage");
const activeProjectPage = document.getElementById("activeProjectPage");
const editProjectPage = document.getElementById("editProjectPage");
const instructionPage = document.getElementById("instructionPage");
const editInstructionPage = document.getElementById("editInstructionPage");


// ----------------------------------
// BUTTONS
// ----------------------------------

const crochetButton = document.getElementById("crochetButton");
const backButton = document.getElementById("backButton");

const newProjectButton = document.getElementById("newProjectButton");
const cancelProjectButton = document.getElementById("cancelProjectButton");
const createProjectButton = document.getElementById("createProjectButton");

const projectBackButton = document.getElementById("projectBackButton");

const selectRows = document.getElementById("selectRows");
const selectRounds = document.getElementById("selectRounds");

const minusButton = document.getElementById("minusButton");
const plusButton = document.getElementById("plusButton");

const editProjectButton = document.getElementById("editProjectButton");

const cancelEditButton = document.getElementById("cancelEditButton");
const saveEditButton = document.getElementById("saveEditButton");
const deleteProjectButton = document.getElementById("deleteProjectButton");

const editRows = document.getElementById("editRows");
const editRounds = document.getElementById("editRounds");

const addInstructionButton =
    document.getElementById("addInstructionButton");

const cancelInstructionButton =
    document.getElementById("cancelInstructionButton");

const saveInstructionButton =
    document.getElementById("saveInstructionButton");

const doneInstructionButton =
    document.getElementById("doneInstructionButton");

const singleInstructionButton =
    document.getElementById("singleInstructionButton");

const rangeInstructionButton =
    document.getElementById("rangeInstructionButton");

const cancelOverwriteButton =
    document.getElementById("cancelOverwriteButton");

const confirmOverwriteButton =
    document.getElementById("confirmOverwriteButton");


// EDIT INSTRUCTION BUTTONS

const cancelEditInstructionButton =
    document.getElementById("cancelEditInstructionButton");

const editSingleInstructionButton =
    document.getElementById("editSingleInstructionButton");

const editRangeInstructionButton =
    document.getElementById("editRangeInstructionButton");

const saveEditInstructionButton =
    document.getElementById("saveEditInstructionButton");

const deleteInstructionButton =
    document.getElementById("deleteInstructionButton");


// ----------------------------------
// ELEMENTS
// ----------------------------------

const projectList = document.getElementById("projectList");

const projectName = document.getElementById("projectName");

const activeProjectName =
    document.getElementById("activeProjectName");

const activeProjectType =
    document.getElementById("activeProjectType");

const counterLabel =
    document.getElementById("counterLabel");

const counter =
    document.getElementById("counter");

const editProjectName =
    document.getElementById("editProjectName");

const patternList =
    document.getElementById("patternList");

const currentInstructionRange =
    document.getElementById("currentInstructionRange");

const currentInstructionText =
    document.getElementById("currentInstructionText");

const repeatDots =
    document.getElementById("repeatDots");

const singleNumberArea =
    document.getElementById("singleNumberArea");

const rangeNumberArea =
    document.getElementById("rangeNumberArea");

const singleNumber =
    document.getElementById("singleNumber");

const rangeStart =
    document.getElementById("rangeStart");

const rangeEnd =
    document.getElementById("rangeEnd");

const instructionText =
    document.getElementById("instructionText");

const singleNumberLabel =
    document.getElementById("singleNumberLabel");

const rangeStartLabel =
    document.getElementById("rangeStartLabel");

const rangeEndLabel =
    document.getElementById("rangeEndLabel");

const overwriteOverlay =
    document.getElementById("overwriteOverlay");


// EDIT INSTRUCTION ELEMENTS

const editSingleNumberArea =
    document.getElementById("editSingleNumberArea");

const editRangeNumberArea =
    document.getElementById("editRangeNumberArea");

const editSingleNumber =
    document.getElementById("editSingleNumber");

const editRangeStart =
    document.getElementById("editRangeStart");

const editRangeEnd =
    document.getElementById("editRangeEnd");

const editInstructionText =
    document.getElementById("editInstructionText");

const editSingleNumberLabel =
    document.getElementById("editSingleNumberLabel");

const editRangeStartLabel =
    document.getElementById("editRangeStartLabel");

const editRangeEndLabel =
    document.getElementById("editRangeEndLabel");


// ----------------------------------
// DATA
// ----------------------------------

let projects =
    JSON.parse(localStorage.getItem("crochetProjects")) || [];

let selectedProjectType = "rows";
let editProjectType = "rows";

let instructionMode = "single";
let editInstructionMode = "single";

let activeProjectIndex = null;
let activeInstructionIndex = null;

let pendingInstruction = null;
let pendingAction = null;


// ----------------------------------
// UPDATE OLD PROJECT DATA
// ----------------------------------

projects.forEach(function (project) {

    if (!project.pattern) {
        project.pattern = [];
    }


    project.pattern.forEach(function (instruction) {

        if (instruction.start === undefined) {
            instruction.start = instruction.number;
        }

        if (instruction.end === undefined) {
            instruction.end = instruction.number;
        }

    });

});

saveProjects();


// ----------------------------------
// PAGE NAVIGATION
// ----------------------------------

function showPage(page) {

    homePage.classList.add("hidden");
    crochetPage.classList.add("hidden");
    newProjectPage.classList.add("hidden");
    activeProjectPage.classList.add("hidden");
    editProjectPage.classList.add("hidden");
    instructionPage.classList.add("hidden");
    editInstructionPage.classList.add("hidden");

    page.classList.remove("hidden");

}


// ----------------------------------
// MAIN NAVIGATION
// ----------------------------------

crochetButton.addEventListener("click", function () {

    renderProjects();
    showPage(crochetPage);

});


backButton.addEventListener("click", function () {

    showPage(homePage);

});


newProjectButton.addEventListener("click", function () {

    projectName.value = "";

    selectedProjectType = "rows";

    selectRows.classList.add("active");
    selectRounds.classList.remove("active");

    showPage(newProjectPage);

});


cancelProjectButton.addEventListener("click", function () {

    renderProjects();
    showPage(crochetPage);

});


projectBackButton.addEventListener("click", function () {

    renderProjects();
    showPage(crochetPage);

});


// ----------------------------------
// NEW PROJECT TYPE
// ----------------------------------

selectRows.addEventListener("click", function () {

    selectedProjectType = "rows";

    selectRows.classList.add("active");
    selectRounds.classList.remove("active");

});


selectRounds.addEventListener("click", function () {

    selectedProjectType = "rounds";

    selectRounds.classList.add("active");
    selectRows.classList.remove("active");

});


// ----------------------------------
// CREATE PROJECT
// ----------------------------------

createProjectButton.addEventListener("click", function () {

    const name =
        projectName.value.trim();


    if (name === "") {

        alert("Please enter a project name.");
        return;

    }


    projects.push({

        name: name,
        type: selectedProjectType,
        count: 1,
        pattern: []

    });


    saveProjects();
    renderProjects();
    showPage(crochetPage);

});


// ----------------------------------
// SAVE PROJECTS
// ----------------------------------

function saveProjects() {

    localStorage.setItem(
        "crochetProjects",
        JSON.stringify(projects)
    );

}


// ----------------------------------
// PROJECT LIST
// ----------------------------------

function renderProjects() {

    projectList.innerHTML = "";


    if (projects.length === 0) {

        projectList.innerHTML =
            "<p>No projects yet. Create your first one!</p>";

        return;

    }


    projects.forEach(function (project, index) {

        const button =
            document.createElement("button");

        button.classList.add("project-list-card");


        const title =
            document.createElement("h2");

        title.textContent =
            project.name;


        const progress =
            document.createElement("p");

        const typeText =
            project.type === "rows"
                ? "Row"
                : "Round";

        progress.textContent =
            `${typeText} ${project.count}`;


        button.appendChild(title);
        button.appendChild(progress);


        button.addEventListener("click", function () {

            openProject(index);

        });


        projectList.appendChild(button);

    });

}


// ----------------------------------
// OPEN PROJECT
// ----------------------------------

function openProject(index) {

    activeProjectIndex = index;

    const project =
        projects[index];


    activeProjectName.textContent =
        project.name;


    if (project.type === "rows") {

        activeProjectType.textContent =
            "Worked in rows";

        counterLabel.textContent =
            "Current row";

    } else {

        activeProjectType.textContent =
            "Worked in rounds";

        counterLabel.textContent =
            "Current round";

    }


    updateProjectDisplay();
    showPage(activeProjectPage);

}


// ----------------------------------
// UPDATE PROJECT DISPLAY
// ----------------------------------

function updateProjectDisplay() {

    if (activeProjectIndex === null) {
        return;
    }


    const project =
        projects[activeProjectIndex];


    counter.textContent =
        project.count;


    renderCurrentInstruction();
    renderPattern();

}


// ----------------------------------
// COUNTER
// ----------------------------------

plusButton.addEventListener("click", function () {

    if (activeProjectIndex === null) {
        return;
    }


    projects[activeProjectIndex].count++;

    saveProjects();
    updateProjectDisplay();

});


minusButton.addEventListener("click", function () {

    if (activeProjectIndex === null) {
        return;
    }


    if (projects[activeProjectIndex].count > 1) {

        projects[activeProjectIndex].count--;

    }


    saveProjects();
    updateProjectDisplay();

});


// ----------------------------------
// FIND CURRENT INSTRUCTION
// ----------------------------------

function getCurrentInstruction(project) {

    return project.pattern.find(function (instruction) {

        return (
            project.count >= instruction.start &&
            project.count <= instruction.end
        );

    });

}


// ----------------------------------
// CURRENT INSTRUCTION
// ----------------------------------

function renderCurrentInstruction() {

    const project =
        projects[activeProjectIndex];

    const instruction =
        getCurrentInstruction(project);


    repeatDots.innerHTML = "";


    if (!instruction) {

        currentInstructionRange.textContent =
            "No instruction";

        currentInstructionText.textContent =
            project.type === "rows"
                ? "No instruction for this row."
                : "No instruction for this round.";

        return;

    }


    const singleName =
        project.type === "rows"
            ? "Row"
            : "Round";

    const pluralName =
        project.type === "rows"
            ? "Rows"
            : "Rounds";


    if (instruction.start === instruction.end) {

        currentInstructionRange.textContent =
            `${singleName} ${instruction.start}`;

    } else {

        currentInstructionRange.textContent =
            `${pluralName} ${instruction.start}–${instruction.end}`;

    }


    currentInstructionText.textContent =
        instruction.text;


    if (instruction.end > instruction.start) {

        const total =
            instruction.end - instruction.start + 1;

        const currentPosition =
            project.count - instruction.start + 1;


        for (let i = 1; i <= total; i++) {

            const dot =
                document.createElement("span");

            dot.classList.add("repeat-dot");


            if (i <= currentPosition) {

                dot.classList.add("filled");
                dot.textContent = "●";

            } else {

                dot.classList.add("empty");
                dot.textContent = "○";

            }


            repeatDots.appendChild(dot);

        }

    }

}


// ----------------------------------
// PATTERN LIST
// ----------------------------------

function renderPattern() {

    patternList.innerHTML = "";


    if (activeProjectIndex === null) {
        return;
    }


    const project =
        projects[activeProjectIndex];


    if (project.pattern.length === 0) {

        patternList.innerHTML =
            "<p>No instructions yet.</p>";

        return;

    }


    const sortedPattern =
        project.pattern
            .map(function (instruction, index) {

                return {
                    instruction: instruction,
                    originalIndex: index
                };

            })
            .sort(function (a, b) {

                return a.instruction.start - b.instruction.start;

            });


    sortedPattern.forEach(function (entry) {

        const instruction =
            entry.instruction;

        const item =
            document.createElement("div");

        item.classList.add("pattern-item");


        if (
            project.count >= instruction.start &&
            project.count <= instruction.end
        ) {

            item.classList.add("current");

        }


        const singleName =
            project.type === "rows"
                ? "Row"
                : "Round";

        const pluralName =
            project.type === "rows"
                ? "Rows"
                : "Rounds";


        const number =
            document.createElement("div");

        number.classList.add("pattern-number");


        if (instruction.start === instruction.end) {

            number.textContent =
                `${singleName} ${instruction.start}`;

        } else {

            number.textContent =
                `${pluralName} ${instruction.start}–${instruction.end}`;

        }


        const text =
            document.createElement("p");

        text.classList.add("pattern-text");

        text.textContent =
            instruction.text;


        item.appendChild(number);
        item.appendChild(text);


        item.addEventListener("click", function () {

            openEditInstruction(entry.originalIndex);

        });


        patternList.appendChild(item);

    });

}


// ----------------------------------
// INSTRUCTION FORM HELPERS
// ----------------------------------

function clearInstructionText() {

    instructionText.value = "";

}


function setInstructionMode(mode) {

    instructionMode = mode;


    if (mode === "single") {

        singleInstructionButton.classList.add("active");
        rangeInstructionButton.classList.remove("active");

        singleNumberArea.classList.remove("hidden");
        rangeNumberArea.classList.add("hidden");

    } else {

        rangeInstructionButton.classList.add("active");
        singleInstructionButton.classList.remove("active");

        rangeNumberArea.classList.remove("hidden");
        singleNumberArea.classList.add("hidden");

    }

}


// ----------------------------------
// OPEN ADD INSTRUCTIONS
// ----------------------------------

addInstructionButton.addEventListener("click", function () {

    if (activeProjectIndex === null) {
        return;
    }


    const project =
        projects[activeProjectIndex];


    pendingInstruction = null;
    pendingAction = null;

    clearInstructionText();

    setInstructionMode("single");


    singleNumber.value =
        project.count;

    rangeStart.value =
        project.count;

    rangeEnd.value =
        project.count + 1;


    updateInstructionLabels();

    showPage(instructionPage);

});


// ----------------------------------
// UPDATE LABELS
// ----------------------------------

function updateInstructionLabels() {

    const project =
        projects[activeProjectIndex];


    if (project.type === "rows") {

        singleNumberLabel.textContent = "Row";
        rangeStartLabel.textContent = "Start row";
        rangeEndLabel.textContent = "End row";

        editSingleNumberLabel.textContent = "Row";
        editRangeStartLabel.textContent = "Start row";
        editRangeEndLabel.textContent = "End row";

    } else {

        singleNumberLabel.textContent = "Round";
        rangeStartLabel.textContent = "Start round";
        rangeEndLabel.textContent = "End round";

        editSingleNumberLabel.textContent = "Round";
        editRangeStartLabel.textContent = "Start round";
        editRangeEndLabel.textContent = "End round";

    }

}


// ----------------------------------
// SINGLE / RANGE
// ----------------------------------

singleInstructionButton.addEventListener("click", function () {

    setInstructionMode("single");

});


rangeInstructionButton.addEventListener("click", function () {

    const currentNumber =
        Number(singleNumber.value) || 1;


    rangeStart.value =
        currentNumber;

    rangeEnd.value =
        currentNumber + 1;


    setInstructionMode("range");

});


// ----------------------------------
// BACK / DONE
// ----------------------------------

cancelInstructionButton.addEventListener("click", function () {

    pendingInstruction = null;
    pendingAction = null;

    clearInstructionText();

    openProject(activeProjectIndex);

});


doneInstructionButton.addEventListener("click", function () {

    pendingInstruction = null;
    pendingAction = null;

    clearInstructionText();

    openProject(activeProjectIndex);

});


// ----------------------------------
// SAVE & NEXT
// ----------------------------------

saveInstructionButton.addEventListener("click", function () {

    const newInstruction =
        readNewInstructionForm();


    if (!newInstruction) {
        return;
    }


    const project =
        projects[activeProjectIndex];


    if (hasOverlap(project, newInstruction)) {

        pendingInstruction =
            newInstruction;

        pendingAction =
            "add";

        overwriteOverlay.classList.remove("hidden");

        return;

    }


    project.pattern.push(newInstruction);

    sortPattern(project);

    saveProjects();

    prepareNextInstruction(newInstruction.end);

});


// ----------------------------------
// READ NEW INSTRUCTION FORM
// ----------------------------------

function readNewInstructionForm() {

    const text =
        instructionText.value.trim();


    if (text === "") {

        alert("Please enter an instruction.");

        return null;

    }


    let start;
    let end;


    if (instructionMode === "single") {

        start =
            Number(singleNumber.value);

        end =
            start;

    } else {

        start =
            Number(rangeStart.value);

        end =
            Number(rangeEnd.value);

    }


    if (!validInstructionNumbers(start, end)) {
        return null;
    }


    return {

        start: start,
        end: end,
        text: text

    };

}


// ----------------------------------
// PREPARE NEXT INSTRUCTION
// ----------------------------------

function prepareNextInstruction(previousEnd) {

    const nextNumber =
        previousEnd + 1;


    setInstructionMode("single");


    singleNumber.value =
        nextNumber;

    rangeStart.value =
        nextNumber;

    rangeEnd.value =
        nextNumber + 1;


    clearInstructionText();

    pendingInstruction = null;
    pendingAction = null;


    instructionText.focus();

}


// ----------------------------------
// OPEN EDIT INSTRUCTION
// ----------------------------------

function openEditInstruction(index) {

    activeInstructionIndex =
        index;


    const project =
        projects[activeProjectIndex];

    const instruction =
        project.pattern[index];


    updateInstructionLabels();


    editInstructionText.value =
        instruction.text;


    editSingleNumber.value =
        instruction.start;

    editRangeStart.value =
        instruction.start;

    editRangeEnd.value =
        instruction.end;


    if (instruction.start === instruction.end) {

        setEditInstructionMode("single");

    } else {

        setEditInstructionMode("range");

    }


    showPage(editInstructionPage);

}


// ----------------------------------
// EDIT INSTRUCTION MODE
// ----------------------------------

function setEditInstructionMode(mode) {

    editInstructionMode =
        mode;


    if (mode === "single") {

        editSingleInstructionButton.classList.add("active");
        editRangeInstructionButton.classList.remove("active");

        editSingleNumberArea.classList.remove("hidden");
        editRangeNumberArea.classList.add("hidden");

    } else {

        editRangeInstructionButton.classList.add("active");
        editSingleInstructionButton.classList.remove("active");

        editRangeNumberArea.classList.remove("hidden");
        editSingleNumberArea.classList.add("hidden");

    }

}


editSingleInstructionButton.addEventListener("click", function () {

    setEditInstructionMode("single");

});


editRangeInstructionButton.addEventListener("click", function () {

    const currentNumber =
        Number(editSingleNumber.value) || 1;


    editRangeStart.value =
        currentNumber;


    if (
        Number(editRangeEnd.value) <= currentNumber
    ) {

        editRangeEnd.value =
            currentNumber + 1;

    }


    setEditInstructionMode("range");

});


// ----------------------------------
// CANCEL EDIT INSTRUCTION
// ----------------------------------

cancelEditInstructionButton.addEventListener("click", function () {

    activeInstructionIndex = null;

    pendingInstruction = null;
    pendingAction = null;

    openProject(activeProjectIndex);

});


// ----------------------------------
// SAVE EDITED INSTRUCTION
// ----------------------------------

saveEditInstructionButton.addEventListener("click", function () {

    if (activeInstructionIndex === null) {
        return;
    }


    const editedInstruction =
        readEditInstructionForm();


    if (!editedInstruction) {
        return;
    }


    const project =
        projects[activeProjectIndex];


    const overlaps =
        project.pattern.some(function (instruction, index) {

            if (index === activeInstructionIndex) {

                return false;

            }


            return (
                editedInstruction.start <= instruction.end &&
                editedInstruction.end >= instruction.start
            );

        });


    if (overlaps) {

        pendingInstruction =
            editedInstruction;

        pendingAction =
            "edit";

        overwriteOverlay.classList.remove("hidden");

        return;

    }


    project.pattern[activeInstructionIndex] =
        editedInstruction;


    sortPattern(project);

    saveProjects();


    activeInstructionIndex = null;


    openProject(activeProjectIndex);

});


// ----------------------------------
// READ EDIT FORM
// ----------------------------------

function readEditInstructionForm() {

    const text =
        editInstructionText.value.trim();


    if (text === "") {

        alert("Please enter an instruction.");

        return null;

    }


    let start;
    let end;


    if (editInstructionMode === "single") {

        start =
            Number(editSingleNumber.value);

        end =
            start;

    } else {

        start =
            Number(editRangeStart.value);

        end =
            Number(editRangeEnd.value);

    }


    if (!validInstructionNumbers(start, end)) {
        return null;
    }


    return {

        start: start,
        end: end,
        text: text

    };

}


// ----------------------------------
// VALIDATE NUMBERS
// ----------------------------------

function validInstructionNumbers(start, end) {

    if (
        !Number.isInteger(start) ||
        !Number.isInteger(end) ||
        start < 1 ||
        end < 1
    ) {

        alert("Please enter valid numbers.");

        return false;

    }


    if (end < start) {

        alert("The end cannot be before the start.");

        return false;

    }


    return true;

}


// ----------------------------------
// DELETE INSTRUCTION
// ----------------------------------

deleteInstructionButton.addEventListener("click", function () {

    if (activeInstructionIndex === null) {
        return;
    }


    const confirmed =
        confirm(
            "Delete this instruction?\n\nThis cannot be undone."
        );


    if (!confirmed) {
        return;
    }


    const project =
        projects[activeProjectIndex];


    project.pattern.splice(
        activeInstructionIndex,
        1
    );


    activeInstructionIndex = null;


    saveProjects();

    openProject(activeProjectIndex);

});


// ----------------------------------
// CHECK OVERLAP
// ----------------------------------

function hasOverlap(project, newInstruction) {

    return project.pattern.some(function (instruction) {

        return (
            newInstruction.start <= instruction.end &&
            newInstruction.end >= instruction.start
        );

    });

}


// ----------------------------------
// OVERWRITE DIALOG
// ----------------------------------

cancelOverwriteButton.addEventListener("click", function () {

    pendingInstruction = null;
    pendingAction = null;

    overwriteOverlay.classList.add("hidden");

});


confirmOverwriteButton.addEventListener("click", function () {

    if (!pendingInstruction) {
        return;
    }


    const savedInstruction = {

        start: pendingInstruction.start,
        end: pendingInstruction.end,
        text: pendingInstruction.text

    };


    if (pendingAction === "add") {

        overwriteInstruction(
            savedInstruction,
            null
        );


        saveProjects();

        overwriteOverlay.classList.add("hidden");


        prepareNextInstruction(
            savedInstruction.end
        );

        return;

    }


    if (pendingAction === "edit") {

        overwriteInstruction(
            savedInstruction,
            activeInstructionIndex
        );


        saveProjects();

        overwriteOverlay.classList.add("hidden");


        activeInstructionIndex = null;
        pendingInstruction = null;
        pendingAction = null;


        openProject(activeProjectIndex);

    }

});


// ----------------------------------
// SMART OVERWRITE
// ----------------------------------

function overwriteInstruction(
    newInstruction,
    ignoredInstructionIndex
) {

    const project =
        projects[activeProjectIndex];

    const updatedPattern = [];


    project.pattern.forEach(function (
        oldInstruction,
        index
    ) {

        // When editing, remove the original
        // instruction from the pattern first.

        if (index === ignoredInstructionIndex) {

            return;

        }


        const overlaps =
            newInstruction.start <= oldInstruction.end &&
            newInstruction.end >= oldInstruction.start;


        if (!overlaps) {

            updatedPattern.push(
                oldInstruction
            );

            return;

        }


        // Keep the part before the overwrite.

        if (
            oldInstruction.start <
            newInstruction.start
        ) {

            updatedPattern.push({

                start:
                    oldInstruction.start,

                end:
                    newInstruction.start - 1,

                text:
                    oldInstruction.text

            });

        }


        // Keep the part after the overwrite.

        if (
            oldInstruction.end >
            newInstruction.end
        ) {

            updatedPattern.push({

                start:
                    newInstruction.end + 1,

                end:
                    oldInstruction.end,

                text:
                    oldInstruction.text

            });

        }

    });


    updatedPattern.push({

        start: newInstruction.start,
        end: newInstruction.end,
        text: newInstruction.text

    });


    project.pattern =
        updatedPattern;


    sortPattern(project);

}


// ----------------------------------
// SORT PATTERN
// ----------------------------------

function sortPattern(project) {

    project.pattern.sort(function (a, b) {

        if (a.start !== b.start) {

            return a.start - b.start;

        }

        return a.end - b.end;

    });

}


// ----------------------------------
// OPEN EDIT PROJECT
// ----------------------------------

editProjectButton.addEventListener("click", function () {

    if (activeProjectIndex === null) {
        return;
    }


    const project =
        projects[activeProjectIndex];


    editProjectName.value =
        project.name;

    editProjectType =
        project.type;


    updateEditTypeButtons();

    showPage(editProjectPage);

});


// ----------------------------------
// EDIT PROJECT TYPE
// ----------------------------------

editRows.addEventListener("click", function () {

    editProjectType = "rows";

    updateEditTypeButtons();

});


editRounds.addEventListener("click", function () {

    editProjectType = "rounds";

    updateEditTypeButtons();

});


function updateEditTypeButtons() {

    if (editProjectType === "rows") {

        editRows.classList.add("active");
        editRounds.classList.remove("active");

    } else {

        editRounds.classList.add("active");
        editRows.classList.remove("active");

    }

}


// ----------------------------------
// CANCEL EDIT PROJECT
// ----------------------------------

cancelEditButton.addEventListener("click", function () {

    openProject(activeProjectIndex);

});


// ----------------------------------
// SAVE EDIT PROJECT
// ----------------------------------

saveEditButton.addEventListener("click", function () {

    const newName =
        editProjectName.value.trim();


    if (newName === "") {

        alert("Please enter a project name.");

        return;

    }


    projects[activeProjectIndex].name =
        newName;

    projects[activeProjectIndex].type =
        editProjectType;


    saveProjects();

    openProject(activeProjectIndex);

});


// ----------------------------------
// DELETE PROJECT
// ----------------------------------

deleteProjectButton.addEventListener("click", function () {

    if (activeProjectIndex === null) {
        return;
    }


    const project =
        projects[activeProjectIndex];


    const confirmed =
        confirm(
            `Delete "${project.name}"?\n\nThis cannot be undone.`
        );


    if (!confirmed) {
        return;
    }


    projects.splice(
        activeProjectIndex,
        1
    );


    activeProjectIndex = null;


    saveProjects();
    renderProjects();

    showPage(crochetPage);

});


// ----------------------------------
// INITIAL SETUP
// ----------------------------------

renderProjects();