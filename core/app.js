// ============================================================
// MY TICKEY — APP CORE
// Loads feature HTML and handles shared page navigation
// ============================================================


// ------------------------------------------------------------
// HTML FRAGMENT LOADER
// ------------------------------------------------------------

async function loadFragment(path) {

    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(
            `Could not load ${path}`
        );
    }

    return await response.text();
}


// ------------------------------------------------------------
// PAGE NAVIGATION
// ------------------------------------------------------------

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(
            (element) => {

                element.classList.add(
                    "hidden"
                );

            }
        );


    if (page) {

        page.classList.remove(
            "hidden"
        );

    }


    window.scrollTo(0, 0);
}


// ------------------------------------------------------------
// LOAD APP
// ------------------------------------------------------------

async function loadApp() {

    const app =
        document.getElementById("app");


    try {

        const [
            homeHTML,
            todoHTML,
            crochetHTML
        ] = await Promise.all([

            loadFragment("home/home.html"),
            loadFragment("todo/todo.html"),
            loadFragment("crochet/crochet.html")

        ]);


        app.innerHTML =
            homeHTML +
            todoHTML +
            crochetHTML;


        // Feature scripts are loaded only after
        // their HTML exists in the document.

        await loadScript(
            "crochet/crochet.js"
        );

        await loadScript(
            "todo/todo.js"
        );


    } catch (error) {

        console.error(
            "Could not load My TICKEY:",
            error
        );


        app.innerHTML = `
            <div class="project-card">
                <h1>Something went wrong.</h1>
                <p>My TICKEY could not load its files.</p>
            </div>
        `;

    }

}


// ------------------------------------------------------------
// SCRIPT LOADER
// ------------------------------------------------------------

function loadScript(path) {

    return new Promise(
        function (resolve, reject) {

            const script =
                document.createElement("script");


            script.src = path;


            script.onload =
                function () {

                    resolve();

                };


            script.onerror =
                function () {

                    reject(
                        new Error(
                            `Could not load ${path}`
                        )
                    );

                };


            document.body.appendChild(
                script
            );

        }
    );

}


// ------------------------------------------------------------
// START
// ------------------------------------------------------------

loadApp();