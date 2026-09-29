// ============================================================
// MY TICKEY — TO-DO v2.3
// Day planner + persistent history + disposable quick lists
// ============================================================

const $ = (id) => document.getElementById(id);


// ============================================================
// ELEMENTS — MAIN TO-DO
// ============================================================

const todoButton = $("todoButton");
const todoPage = $("todoPage");
const todoBackButton = $("todoBackButton");

const previousTodoDayButton = $("previousTodoDayButton");
const nextTodoDayButton = $("nextTodoDayButton");

const todoDayWeekday = $("todoDayWeekday");
const todoDayDate = $("todoDayDate");

const todoTodayList = $("todoTodayList");
const todoTomorrowList = $("todoTomorrowList");

const newTodoTaskButton = $("newTodoTaskButton");


// ============================================================
// ELEMENTS — NEW TASK
// ============================================================

const newTodoTaskPage = $("newTodoTaskPage");

const cancelTodoTaskButton = $("cancelTodoTaskButton");
const todoTaskText = $("todoTaskText");
const createTodoTaskButton = $("createTodoTaskButton");


// ============================================================
// ELEMENTS — EDIT TASK
// ============================================================

const editTodoTaskPage = $("editTodoTaskPage");

const cancelEditTodoTaskButton = $("cancelEditTodoTaskButton");
const editTodoTaskText = $("editTodoTaskText");
const saveEditTodoTaskButton = $("saveEditTodoTaskButton");
const deleteTodoTaskButton = $("deleteTodoTaskButton");


// ============================================================
// ELEMENTS — QUICK LISTS
// ============================================================

const todoListOverview = $("todoListOverview");
const newTodoListButton = $("newTodoListButton");

const newTodoListPage = $("newTodoListPage");
const cancelTodoListButton = $("cancelTodoListButton");
const todoListName = $("todoListName");
const createTodoListButton = $("createTodoListButton");

const activeTodoListPage = $("activeTodoListPage");
const todoListBackButton = $("todoListBackButton");
const activeTodoListName = $("activeTodoListName");
const activeTodoListSummary = $("activeTodoListSummary");
const editTodoListButton = $("editTodoListButton");

const todoTaskList = $("todoTaskList");

const quickListItemText = $("quickListItemText");
const addQuickListItemButton = $("addQuickListItemButton");


// ============================================================
// ELEMENTS — OLD EDIT LIST PAGE
// Kept only so the current HTML does not break.
// The actual list workflow no longer uses editing.
// ============================================================

const editTodoListPage = $("editTodoListPage");

const cancelEditTodoListButton = $("cancelEditTodoListButton");
const editTodoListName = $("editTodoListName");
const saveEditTodoListButton = $("saveEditTodoListButton");
const deleteTodoListButton = $("deleteTodoListButton");


// Quick lists are disposable.
// No rename/edit workflow anymore.

if (editTodoListButton) {
    editTodoListButton.classList.add("hidden");
}


// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEY = "myTickeyTodoV2";
const LEGACY_KEY = "todoLists";

let state = loadState();

let selectedDay = startOfDay(new Date());

let taskBeingEdited = null;
let activeQuickListId = null;


// ============================================================
// DATE HELPERS
// ============================================================

function startOfDay(date) {

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

}


function dateKey(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function todayKey() {

    return dateKey(
        startOfDay(new Date())
    );

}


function dateFromKey(key) {

    const [year, month, day] =
        key.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day
    );

}


function addDays(date, amount) {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() + amount
    );

    return startOfDay(result);

}


function prettyDay(date) {

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    )
        .format(date)
        .replace(",", " ·");

}


function weekdayLabel(date) {

    const today =
        startOfDay(new Date());

    const key =
        dateKey(date);

    if (key === dateKey(today)) {
        return "TODAY";
    }

    if (
        key ===
        dateKey(addDays(today, 1))
    ) {
        return "TOMORROW";
    }

    if (
        key ===
        dateKey(addDays(today, -1))
    ) {
        return "YESTERDAY";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            weekday: "long"
        }
    )
        .format(date)
        .toUpperCase();

}


function shortDay(key) {

    if (!key) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            weekday: "short"
        }
    )
        .format(dateFromKey(key))
        .toUpperCase();

}


// ============================================================
// ID HELPER
// ============================================================

function uid(prefix) {

    return (
        `${prefix}-` +
        `${Date.now()}-` +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );

}


// ============================================================
// STORAGE
// ============================================================

function loadState() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                )
            );

        if (
            saved &&
            Array.isArray(saved.tasks) &&
            Array.isArray(saved.lists)
        ) {

            normalizeState(saved);

            return saved;

        }

    } catch (_) {}


    const freshState = {
        tasks: [],
        lists: []
    };


    // Gentle migration from the older To-do version.
    // The old storage itself is not deleted.

    try {

        const oldLists =
            JSON.parse(
                localStorage.getItem(
                    LEGACY_KEY
                )
            );

        if (Array.isArray(oldLists)) {

            oldLists.forEach(
                (oldList) => {

                    if (
                        !oldList ||
                        !oldList.name
                    ) {
                        return;
                    }


                    freshState.lists.push({

                        id: uid("list"),

                        name:
                            String(
                                oldList.name
                            ),

                        items:
                            Array.isArray(
                                oldList.items
                            )
                                ? oldList.items
                                    .map(
                                        (item) => ({

                                            id:
                                                uid(
                                                    "item"
                                                ),

                                            text:
                                                typeof item ===
                                                "string"
                                                    ? item
                                                    : String(
                                                        item.text ||
                                                        ""
                                                    )

                                        })
                                    )
                                    .filter(
                                        (item) =>
                                            item.text.trim()
                                    )
                                : []

                    });

                }
            );

        }

    } catch (_) {}


    return freshState;

}


function normalizeState(savedState) {

    savedState.tasks.forEach(
        (task) => {

            if (!task.id) {
                task.id = uid("task");
            }

            if (!task.status) {
                task.status = "open";
            }

            if (!task.date) {
                task.date = todayKey();
            }

            if (
                task.status === "waiting" &&
                !task.waitingSince
            ) {
                task.waitingSince =
                    task.date;
            }

            task.important =
                Boolean(task.important);

            task.unclear =
                Boolean(task.unclear);

            task.timeSensitive =
                Boolean(
                    task.timeSensitive
                );

        }
    );


    savedState.lists.forEach(
        (list) => {

            if (!list.id) {
                list.id = uid("list");
            }

            if (!Array.isArray(list.items)) {
                list.items = [];
            }

            list.items.forEach(
                (item) => {

                    if (!item.id) {
                        item.id =
                            uid("item");
                    }

                }
            );

        }
    );

}


function saveState() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

}


// ============================================================
// SAFE TEXT
// ============================================================

function escapeText(text) {

    const span =
        document.createElement("span");

    span.textContent = text;

    return span.innerHTML;

}


// ============================================================
// EMPTY STATE
// ============================================================

function emptyLine(text) {

    const element =
        document.createElement("div");

    element.className =
        "todo-empty-state";

    element.textContent = text;

    return element;

}


// ============================================================
// TASK HISTORY LOGIC
// ============================================================

function getTaskStateForDay(
    task,
    dayKey
) {

    // Task does not exist before its planned date.

    if (dayKey < task.date) {
        return null;
    }


    // --------------------------------------------------------
    // DONE HISTORY
    // --------------------------------------------------------

    if (task.completedDate) {

        // On the day it was completed,
        // it remains visible as Done.

        if (
            dayKey ===
            task.completedDate
        ) {
            return "done";
        }


        // After completion it disappears.

        if (
            dayKey >
            task.completedDate
        ) {
            return null;
        }

    }


    // --------------------------------------------------------
    // CANCELLED HISTORY
    // --------------------------------------------------------

    if (task.cancelledDate) {

        // On the day it was cancelled,
        // it remains visible as Cancelled.

        if (
            dayKey ===
            task.cancelledDate
        ) {
            return "cancelled";
        }


        // After cancellation it disappears.

        if (
            dayKey >
            task.cancelledDate
        ) {
            return null;
        }

    }


    // --------------------------------------------------------
    // WAITING HISTORY
    // --------------------------------------------------------

    if (task.waitingSince) {

        const waitingEnd =
            task.waitingUntil ||
            null;


        if (
            dayKey >= task.waitingSince &&
            (
                !waitingEnd ||
                dayKey < waitingEnd
            )
        ) {
            return "waiting";
        }

    }


    // --------------------------------------------------------
    // COMPATIBILITY WITH OLDER SAVED TASKS
    // --------------------------------------------------------

    if (
        task.status === "done" &&
        !task.completedDate
    ) {

        if (dayKey === task.date) {
            return "done";
        }

        return null;

    }


    if (
        task.status === "cancelled" &&
        !task.cancelledDate
    ) {

        if (dayKey === task.date) {
            return "cancelled";
        }

        return null;

    }


    // --------------------------------------------------------
    // ORIGINAL PLANNED DAY
    // --------------------------------------------------------

    if (dayKey === task.date) {

        if (
            task.status === "waiting"
        ) {
            return "waiting";
        }

        return "open";

    }


    // --------------------------------------------------------
    // OPEN TASK FROM AN EARLIER DAY = OVERDUE
    // --------------------------------------------------------

    if (
        dayKey > task.date &&
        task.status === "open"
    ) {
        return "overdue";
    }


    return null;

}


// ============================================================
// RENDER EVERYTHING
// ============================================================

function renderAll() {

    renderDay();
    renderQuickLists();

}


// ============================================================
// DAY VIEW
// ============================================================

function renderDay() {

    if (
        !todoTodayList ||
        !todoTomorrowList
    ) {
        return;
    }


    const selectedKey =
        dateKey(selectedDay);

    const tomorrowDate =
        addDays(
            selectedDay,
            1
        );

    const tomorrowKey =
        dateKey(tomorrowDate);


    todoDayWeekday.textContent =
        weekdayLabel(selectedDay);

    todoDayDate.textContent =
        prettyDay(selectedDay);


    const selectedTasks =
        getTasksForDay(
            selectedKey
        );

    const tomorrowTasks =
        getTasksForDay(
            tomorrowKey
        );


    todoTodayList.innerHTML = "";
    todoTomorrowList.innerHTML = "";


    if (
        selectedTasks.length === 0
    ) {

        todoTodayList.appendChild(
            emptyLine(
                "Nothing here. Suspiciously peaceful."
            )
        );

    } else {

        selectedTasks.forEach(
            (entry) => {

                todoTodayList.appendChild(
                    taskRow(
                        entry.task,
                        selectedKey,
                        entry.displayState
                    )
                );

            }
        );

    }


    if (
        tomorrowTasks.length === 0
    ) {

        todoTomorrowList.appendChild(
            emptyLine(
                "Nothing planned."
            )
        );

    } else {

        tomorrowTasks.forEach(
            (entry) => {

                todoTomorrowList.appendChild(
                    taskRow(
                        entry.task,
                        tomorrowKey,
                        entry.displayState
                    )
                );

            }
        );

    }

}


// ============================================================
// GET TASKS FOR A DAY
// ============================================================

function getTasksForDay(dayKey) {

    const result = [];


    state.tasks.forEach(
        (task) => {

            const displayState =
                getTaskStateForDay(
                    task,
                    dayKey
                );


            if (!displayState) {
                return;
            }


            result.push({
                task,
                displayState
            });

        }
    );


    result.sort(
        (a, b) =>
            taskSort(
                a.displayState,
                b.displayState
            )
    );


    return result;

}


// ============================================================
// TASK SORTING
// ============================================================

function taskSort(a, b) {

    const order = {
        overdue: 0,
        open: 1,
        waiting: 2,
        done: 3,
        cancelled: 4
    };


    return (
        (order[a] ?? 99) -
        (order[b] ?? 99)
    );

}


// ============================================================
// TASK ROW
// ============================================================

function taskRow(
    task,
    viewingKey,
    displayState
) {

    const row =
        document.createElement("div");

    row.className =
        "todo-task-card todo-v2-task-row";

    row.dataset.status =
        displayState;


    // --------------------------------------------------------
    // STATUS BUTTON
    // --------------------------------------------------------

    const toggle =
        document.createElement("button");

    toggle.type = "button";

    toggle.className =
        "todo-status-symbol";


    if (displayState === "done") {

        toggle.textContent = "✓";

    } else if (
        displayState === "cancelled"
    ) {

        toggle.textContent = "⊘";

    } else if (
        displayState === "waiting"
    ) {

        toggle.textContent = "↻";

    } else {

        toggle.textContent = "☐";

    }


    // Tapping the checkbox completes the task
    // on the day currently being viewed.
    //
    // This is important for Overdue and Waiting:
    // if you finish it today, it stays in TODAY as Done.

    toggle.addEventListener(
        "click",
        () => {

            if (
                displayState === "done"
            ) {

                reopenTask(
                    task,
                    viewingKey
                );

            } else {

                finishTask(
                    task,
                    viewingKey
                );

            }


            saveState();
            renderDay();

        }
    );


    // --------------------------------------------------------
    // TASK CONTENT
    // --------------------------------------------------------

    const main =
        document.createElement("div");

    main.className =
        "todo-task-main";


    const text =
        document.createElement("div");

    text.className =
        "todo-task-text";

    text.textContent =
        task.text;


    main.appendChild(text);


    // --------------------------------------------------------
    // STATUS META
    // --------------------------------------------------------

    const metaParts = [];


    if (
        displayState === "waiting"
    ) {

        metaParts.push(
            `WAITING SINCE ${
                shortDay(
                    task.waitingSince ||
                    task.date
                )
            }`
        );

    }


    if (
        displayState === "overdue"
    ) {

        metaParts.push(
            `OVERDUE · ${
                shortDay(task.date)
            }`
        );

    }


    if (
        displayState === "done"
    ) {

        metaParts.push(
            "DONE"
        );

    }


    if (
        displayState === "cancelled"
    ) {

        metaParts.push(
            "CANCELLED"
        );

    }


    if (metaParts.length) {

        const meta =
            document.createElement("div");

        meta.className =
            "todo-task-meta";

        meta.textContent =
            metaParts.join(" · ");

        main.appendChild(meta);

    }


    // --------------------------------------------------------
    // COMPACT MARKERS
    //
    // No IMPORTANT / UNCLEAR / TIME-SENSITIVE text here.
    // Only the symbols are visible in the task.
    // Full names remain inside the dropdown.
    // --------------------------------------------------------

    if (
        task.important ||
        task.unclear ||
        task.timeSensitive
    ) {

        const markers =
            document.createElement("div");

        markers.className =
            "todo-task-markers";


        if (task.important) {

            const marker =
                document.createElement("span");

            marker.className =
                "todo-marker todo-marker-important";

            marker.textContent = "!";

            markers.appendChild(marker);

        }


        if (task.unclear) {

            const marker =
                document.createElement("span");

            marker.className =
                "todo-marker todo-marker-unclear";

            marker.textContent = "?";

            markers.appendChild(marker);

        }


        if (task.timeSensitive) {

            const marker =
                document.createElement("span");

            marker.className =
                "todo-marker todo-marker-time";

            marker.textContent = "⏱";

            markers.appendChild(marker);

        }


        main.appendChild(markers);

    }


    // --------------------------------------------------------
    // THREE-DOT MENU
    // --------------------------------------------------------

    const wrap =
        document.createElement("div");

    wrap.className =
        "todo-quick-menu-wrap";


    const dots =
        document.createElement("button");

    dots.type = "button";

    dots.className =
        "todo-quick-menu-button";

    dots.textContent = "⋯";

    dots.setAttribute(
        "aria-label",
        "Task options"
    );


    const menu =
        document.createElement("div");

    menu.className =
        "todo-quick-menu hidden";


    // DONE / OPEN

    addMenuItem(

        menu,

        displayState === "done"
            ? "☐ Open"
            : "✓ Done",

        () => {

            if (
                displayState === "done"
            ) {

                reopenTask(
                    task,
                    viewingKey
                );

            } else {

                finishTask(
                    task,
                    viewingKey
                );

            }


            saveState();
            renderDay();

        }

    );


    // TOMORROW

    if (
        displayState !== "done" &&
        displayState !== "cancelled"
    ) {

        addMenuItem(

            menu,

            "→ Tomorrow",

            () => {

                moveTaskToTomorrow(
                    task,
                    viewingKey
                );

                saveState();
                renderDay();

            }

        );

    }


    // WAITING

    if (
        displayState !== "done" &&
        displayState !== "cancelled"
    ) {

        addMenuItem(

            menu,

            displayState === "waiting"
                ? "☐ Stop waiting"
                : "↻ Waiting",

            () => {

                if (
                    displayState ===
                    "waiting"
                ) {

                    stopWaiting(
                        task,
                        viewingKey
                    );

                } else {

                    startWaiting(
                        task,
                        viewingKey
                    );

                }


                saveState();
                renderDay();

            }

        );

    }


    // CANCELLED

    if (
        displayState !== "cancelled"
    ) {

        addMenuItem(

            menu,

            "⊘ Cancelled",

            () => {

                cancelTask(
                    task,
                    viewingKey
                );

                saveState();
                renderDay();

            }

        );

    }


    addMenuDivider(menu);


    // IMPORTANT

    addMenuItem(

        menu,

        task.important
            ? "Remove ! Important"
            : "! Important",

        () => {

            task.important =
                !task.important;

            saveState();
            renderDay();

        }

    );


    // UNCLEAR

    addMenuItem(

        menu,

        task.unclear
            ? "Remove ? Unclear"
            : "? Unclear",

        () => {

            task.unclear =
                !task.unclear;

            saveState();
            renderDay();

        }

    );


    // TIME-SENSITIVE

    addMenuItem(

        menu,

        task.timeSensitive
            ? "Remove ⏱ Time-sensitive"
            : "⏱ Time-sensitive",

        () => {

            task.timeSensitive =
                !task.timeSensitive;

            saveState();
            renderDay();

        }

    );


    addMenuDivider(menu);


    // EDIT TASK
    // Kept for tasks because changing a typo is useful.

    addMenuItem(

        menu,

        "Edit",

        () => {

            openTaskEditor(
                task.id
            );

        }

    );


    // DELETE TASK

    addMenuItem(

        menu,

        "Delete",

        () => {

            state.tasks =
                state.tasks.filter(
                    (entry) =>
                        entry.id !==
                        task.id
                );


            saveState();
            renderDay();

        },

        true

    );


    // --------------------------------------------------------
    // OPEN / CLOSE MENU
    // --------------------------------------------------------

    dots.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();


            document
                .querySelectorAll(
                    ".todo-quick-menu"
                )
                .forEach(
                    (otherMenu) => {

                        if (
                            otherMenu !==
                            menu
                        ) {

                            otherMenu.classList.add(
                                "hidden"
                            );

                        }

                    }
                );


            menu.classList.toggle(
                "hidden"
            );

        }
    );


    wrap.append(
        dots,
        menu
    );


    row.append(
        toggle,
        main,
        wrap
    );


    return row;

}


// ============================================================
// TASK ACTIONS
// ============================================================

function finishTask(
    task,
    viewingKey
) {

    const resolutionDate =
        viewingKey ||
        todayKey();


    // If it was waiting, preserve the waiting history
    // until the day it was completed.

    if (
        task.waitingSince &&
        !task.waitingUntil
    ) {

        task.waitingUntil =
            resolutionDate;

    }


    task.status =
        "done";

    task.completedDate =
        resolutionDate;

    task.cancelledDate =
        null;

}


function cancelTask(
    task,
    viewingKey
) {

    const resolutionDate =
        viewingKey ||
        todayKey();


    // Preserve previous waiting history.

    if (
        task.waitingSince &&
        !task.waitingUntil
    ) {

        task.waitingUntil =
            resolutionDate;

    }


    task.status =
        "cancelled";

    task.cancelledDate =
        resolutionDate;

    task.completedDate =
        null;

}


function reopenTask(
    task,
    viewingKey
) {

    task.status =
        "open";

    task.completedDate =
        null;

    task.cancelledDate =
        null;


    // Reopening a completed task makes the viewed day
    // its new active day. Otherwise an old overdue task
    // could immediately jump backwards again.

    task.date =
        viewingKey ||
        todayKey();


    if (
        task.waitingSince &&
        !task.waitingUntil
    ) {

        task.waitingUntil =
            viewingKey ||
            todayKey();

    }

}


function startWaiting(
    task,
    viewingKey
) {

    task.status =
        "waiting";


    // The first waiting day stays fixed.
    // Tomorrow, the day after tomorrow, etc.
    // will still show WAITING SINCE this day.

    if (
        !task.waitingSince ||
        task.waitingUntil
    ) {

        task.waitingSince =
            viewingKey;

    }


    task.waitingUntil =
        null;

    task.completedDate =
        null;

    task.cancelledDate =
        null;

}


function stopWaiting(
    task,
    viewingKey
) {

    task.status =
        "open";

    task.waitingUntil =
        viewingKey;


    // Once waiting ends, it becomes an ordinary
    // open task on the current viewed day.

    task.date =
        viewingKey;

}


function moveTaskToTomorrow(
    task,
    viewingKey
) {

    const tomorrow =
        dateKey(
            addDays(
                dateFromKey(
                    viewingKey
                ),
                1
            )
        );


    // If it was waiting, close that waiting period.

    if (
        task.waitingSince &&
        !task.waitingUntil
    ) {

        task.waitingUntil =
            viewingKey;

    }


    task.date =
        tomorrow;

    task.status =
        "open";

    task.completedDate =
        null;

    task.cancelledDate =
        null;


    // Important:
    // "Moved" is NOT a status.
    // Tomorrow simply becomes the task's new date.

}


// ============================================================
// MENU HELPERS
// ============================================================

function addMenuItem(
    menu,
    label,
    action,
    danger = false
) {

    const button =
        document.createElement(
            "button"
        );

    button.type =
        "button";

    button.className =
        `todo-quick-menu-item${
            danger
                ? " todo-quick-menu-danger"
                : ""
        }`;

    button.textContent =
        label;


    button.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            menu.classList.add(
                "hidden"
            );

            action();

        }
    );


    menu.appendChild(
        button
    );

}


function addMenuDivider(menu) {

    const divider =
        document.createElement(
            "div"
        );

    divider.className =
        "todo-quick-menu-divider";

    menu.appendChild(
        divider
    );

}


// Close menus when tapping elsewhere.

document.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                ".todo-quick-menu"
            )
            .forEach(
                (menu) => {

                    menu.classList.add(
                        "hidden"
                    );

                }
            );

    }
);


// ============================================================
// TASK EDITOR
// ============================================================

function openTaskEditor(id) {

    const task =
        state.tasks.find(
            (entry) =>
                entry.id === id
        );


    if (!task) {
        return;
    }


    taskBeingEdited =
        id;

    editTodoTaskText.value =
        task.text;


    showPage(
        editTodoTaskPage
    );


    editTodoTaskText.focus();

}


// ============================================================
// QUICK LIST OVERVIEW
// ============================================================

function renderQuickLists() {

    if (!todoListOverview) {
        return;
    }


    todoListOverview.innerHTML =
        "";


    if (!state.lists.length) {

        todoListOverview.appendChild(
            emptyLine(
                "No lists yet."
            )
        );

        return;

    }


    state.lists.forEach(
        (list) => {

            const card =
                document.createElement(
                    "button"
                );

            card.type =
                "button";

            card.className =
                "todo-list-card";


            card.innerHTML = `
                <div class="todo-list-info">

                    <div class="todo-list-name">
                        ${escapeText(list.name)}
                    </div>

                    <div class="todo-list-summary">
                        ${list.items.length}
                        ${
                            list.items.length === 1
                                ? "item"
                                : "items"
                        }
                    </div>

                </div>

                <div class="todo-list-arrow">
                    →
                </div>
            `;


            card.addEventListener(
                "click",
                () => {

                    openQuickList(
                        list.id
                    );

                }
            );


            todoListOverview.appendChild(
                card
            );

        }
    );

}


// ============================================================
// OPEN QUICK LIST
// ============================================================

function openQuickList(id) {

    const list =
        state.lists.find(
            (entry) =>
                entry.id === id
        );


    if (!list) {
        return;
    }


    activeQuickListId =
        id;


    renderActiveQuickList();


    showPage(
        activeTodoListPage
    );

}


// ============================================================
// RENDER ACTIVE QUICK LIST
// ============================================================

function renderActiveQuickList() {

    const list =
        state.lists.find(
            (entry) =>
                entry.id ===
                activeQuickListId
        );


    if (!list) {
        return;
    }


    activeTodoListName.textContent =
        list.name;


    activeTodoListSummary.textContent =
        `${list.items.length} ${
            list.items.length === 1
                ? "item"
                : "items"
        }`;


    // --------------------------------------------------------
    // DIRECT DELETE LIST BUTTON
    // --------------------------------------------------------

    let directDeleteButton =
        activeTodoListPage.querySelector(
            "#directDeleteTodoListButton"
        );


    if (!directDeleteButton) {

        directDeleteButton =
            document.createElement(
                "button"
            );

        directDeleteButton.id =
            "directDeleteTodoListButton";

        directDeleteButton.type =
            "button";

        directDeleteButton.className =
            "danger-button";

        directDeleteButton.textContent =
            "Delete List";


        directDeleteButton.addEventListener(
            "click",
            () => {

                state.lists =
                    state.lists.filter(
                        (entry) =>
                            entry.id !==
                            activeQuickListId
                    );


                activeQuickListId =
                    null;


                saveState();
                renderQuickLists();


                showPage(
                    todoPage
                );

            }
        );


        activeTodoListPage.appendChild(
            directDeleteButton
        );

    }


    // --------------------------------------------------------
    // ITEMS
    // --------------------------------------------------------

    todoTaskList.innerHTML =
        "";


    if (!list.items.length) {

        todoTaskList.appendChild(
            emptyLine(
                "All clear."
            )
        );

        return;

    }


    list.items.forEach(
        (item) => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "todo-task-card todo-checklist-card";


            const check =
                document.createElement(
                    "button"
                );

            check.type =
                "button";

            check.className =
                "todo-status-symbol";

            check.textContent =
                "☐";


            check.setAttribute(
                "aria-label",
                `Remove ${item.text}`
            );


            // List items are intentionally disposable.
            //
            // Cat food in cart?
            // Click.
            // Poof.
            // Gone.
            // No audit committee required.

            check.addEventListener(
                "click",
                () => {

                    list.items =
                        list.items.filter(
                            (entry) =>
                                entry.id !==
                                item.id
                        );


                    saveState();

                    renderActiveQuickList();
                    renderQuickLists();

                }
            );


            const text =
                document.createElement(
                    "div"
                );

            text.className =
                "todo-task-main todo-task-text";

            text.textContent =
                item.text;


            row.append(
                check,
                text
            );


            todoTaskList.appendChild(
                row
            );

        }
    );

}


// ============================================================
// OPEN TO-DO
// ============================================================

if (todoButton) {

    todoButton.addEventListener(
        "click",
        () => {

            selectedDay =
                startOfDay(
                    new Date()
                );


            renderAll();


            showPage(
                todoPage
            );

        }
    );

}


// ============================================================
// BACK HOME
// ============================================================

if (todoBackButton) {

    todoBackButton.addEventListener(
        "click",
        () => {

            showPage(
                $("homePage")
            );

        }
    );

}


// ============================================================
// PREVIOUS DAY
// ============================================================

if (previousTodoDayButton) {

    previousTodoDayButton.addEventListener(
        "click",
        () => {

            selectedDay =
                addDays(
                    selectedDay,
                    -1
                );


            renderDay();

        }
    );

}


// ============================================================
// NEXT DAY
// ============================================================

if (nextTodoDayButton) {

    nextTodoDayButton.addEventListener(
        "click",
        () => {

            selectedDay =
                addDays(
                    selectedDay,
                    1
                );


            renderDay();

        }
    );

}


// ============================================================
// NEW TASK
// ============================================================

if (newTodoTaskButton) {

    newTodoTaskButton.addEventListener(
        "click",
        () => {

            todoTaskText.value =
                "";


            showPage(
                newTodoTaskPage
            );


            todoTaskText.focus();

        }
    );

}


// ============================================================
// CANCEL NEW TASK
// ============================================================

if (cancelTodoTaskButton) {

    cancelTodoTaskButton.addEventListener(
        "click",
        () => {

            showPage(
                todoPage
            );

        }
    );

}


// ============================================================
// CREATE TASK
// ============================================================

if (createTodoTaskButton) {

    createTodoTaskButton.addEventListener(
        "click",
        () => {

            const text =
                todoTaskText
                    .value
                    .trim()
                    .slice(0, 50);


            if (!text) {

                todoTaskText.focus();

                return;

            }


            state.tasks.push({

                id:
                    uid("task"),

                text:
                    text,

                date:
                    dateKey(
                        selectedDay
                    ),

                status:
                    "open",

                completedDate:
                    null,

                cancelledDate:
                    null,

                waitingSince:
                    null,

                waitingUntil:
                    null,

                important:
                    false,

                unclear:
                    false,

                timeSensitive:
                    false

            });


            saveState();

            renderDay();


            showPage(
                todoPage
            );

        }
    );

}


if (todoTaskText) {

    todoTaskText.maxLength =
        50;


    todoTaskText.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                createTodoTaskButton.click();

            }

        }
    );

}


// ============================================================
// EDIT TASK
// ============================================================

if (cancelEditTodoTaskButton) {

    cancelEditTodoTaskButton.addEventListener(
        "click",
        () => {

            taskBeingEdited =
                null;


            showPage(
                todoPage
            );

        }
    );

}


if (saveEditTodoTaskButton) {

    saveEditTodoTaskButton.addEventListener(
        "click",
        () => {

            const task =
                state.tasks.find(
                    (entry) =>
                        entry.id ===
                        taskBeingEdited
                );


            if (!task) {
                return;
            }


            const text =
                editTodoTaskText
                    .value
                    .trim()
                    .slice(0, 50);


            if (!text) {

                editTodoTaskText.focus();

                return;

            }


            task.text =
                text;


            saveState();

            taskBeingEdited =
                null;


            renderDay();


            showPage(
                todoPage
            );

        }
    );

}


if (editTodoTaskText) {

    editTodoTaskText.maxLength =
        50;

}


// ============================================================
// DELETE TASK
// ============================================================

if (deleteTodoTaskButton) {

    deleteTodoTaskButton.addEventListener(
        "click",
        () => {

            state.tasks =
                state.tasks.filter(
                    (entry) =>
                        entry.id !==
                        taskBeingEdited
                );


            saveState();

            taskBeingEdited =
                null;


            renderDay();


            showPage(
                todoPage
            );

        }
    );

}


// ============================================================
// NEW QUICK LIST
// ============================================================

if (newTodoListButton) {

    newTodoListButton.addEventListener(
        "click",
        () => {

            todoListName.value =
                "";


            showPage(
                newTodoListPage
            );


            todoListName.focus();

        }
    );

}


// ============================================================
// CANCEL NEW QUICK LIST
// ============================================================

if (cancelTodoListButton) {

    cancelTodoListButton.addEventListener(
        "click",
        () => {

            showPage(
                todoPage
            );

        }
    );

}


// ============================================================
// CREATE QUICK LIST
// ============================================================

if (createTodoListButton) {

    createTodoListButton.addEventListener(
        "click",
        () => {

            const name =
                todoListName
                    .value
                    .trim()
                    .slice(0, 40);


            if (!name) {

                todoListName.focus();

                return;

            }


            state.lists.push({

                id:
                    uid("list"),

                name:
                    name,

                items:
                    []

            });


            saveState();

            renderQuickLists();


            showPage(
                todoPage
            );

        }
    );

}


if (todoListName) {

    todoListName.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                createTodoListButton.click();

            }

        }
    );

}


// ============================================================
// BACK FROM QUICK LIST
// ============================================================

if (todoListBackButton) {

    todoListBackButton.addEventListener(
        "click",
        () => {

            activeQuickListId =
                null;


            renderQuickLists();


            showPage(
                todoPage
            );

        }
    );

}


// ============================================================
// ADD QUICK LIST ITEM
// ============================================================

if (addQuickListItemButton) {

    addQuickListItemButton.addEventListener(
        "click",
        () => {

            const list =
                state.lists.find(
                    (entry) =>
                        entry.id ===
                        activeQuickListId
                );


            if (!list) {
                return;
            }


            const text =
                quickListItemText
                    .value
                    .trim()
                    .slice(0, 50);


            if (!text) {

                quickListItemText.focus();

                return;

            }


            list.items.push({

                id:
                    uid("item"),

                text:
                    text

            });


            quickListItemText.value =
                "";


            saveState();

            renderActiveQuickList();
            renderQuickLists();

            quickListItemText.focus();

        }
    );

}


if (quickListItemText) {

    quickListItemText.maxLength =
        50;


    quickListItemText.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                addQuickListItemButton.click();

            }

        }
    );

}


// ============================================================
// OLD LIST EDIT CONTROLS
//
// These are intentionally not used anymore.
// We leave safe handlers here because the old HTML still contains
// the page, but normal navigation never opens it.
// ============================================================

if (cancelEditTodoListButton) {

    cancelEditTodoListButton.addEventListener(
        "click",
        () => {

            if (activeQuickListId) {

                showPage(
                    activeTodoListPage
                );

            } else {

                showPage(
                    todoPage
                );

            }

        }
    );

}


if (saveEditTodoListButton) {

    saveEditTodoListButton.addEventListener(
        "click",
        () => {

            showPage(
                activeTodoListPage
            );

        }
    );

}


if (deleteTodoListButton) {

    deleteTodoListButton.addEventListener(
        "click",
        () => {

            if (!activeQuickListId) {

                showPage(
                    todoPage
                );

                return;

            }


            state.lists =
                state.lists.filter(
                    (entry) =>
                        entry.id !==
                        activeQuickListId
                );


            activeQuickListId =
                null;


            saveState();
            renderQuickLists();


            showPage(
                todoPage
            );

        }
    );

}


// ============================================================
// INITIAL RENDER
// ============================================================

renderAll();
