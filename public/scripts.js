// Controls JS elements for views in html 


// NavBar

function hideOverview() {
    let overview = document.getElementById("overview");
    overview.style.display = "none";
}


function showOverview() {
    let overview = document.getElementById("overview");
    overview.style.display = "block"
}


function overview() {
    let overview = document.getElementById("overview");
    if (overview.style.display === "none") {
        showOverview();
        hideTable();
    } else {
        hideOverview();
    }
}


function showTable() {
    let table = document.getElementById("apicalls");
    table.style.display = "table";
}

function hideTable() {
    let table = document.getElementById("apicalls");
    table.style.display = "none";
}


function apiCalls() {
    let table = document.getElementById("apicalls");
    if (table.style.display === "none") {
        showTable();
        hideOverview();
    } else {
        hideTable();
        showOverview();
    }

}

let buttonOne = document.getElementById("overview-button");
buttonOne.addEventListener('click', function () {
    overview()

});


let buttonTwo = document.getElementById("button-apicalls");
buttonTwo.addEventListener('click', function () {
    apiCalls()

});


  



