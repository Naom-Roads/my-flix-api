// Controls JS elements for views in html 


// NavBar


function overview() {
let overview = document.getElementById("overview");

if (overview.style.display === "none") {
    overview.style.display = "block";
} else {
    overview.style.display = "none"; 
}
}

let buttonOne = document.getElementById("overview-button");
buttonOne.addEventListener('click', function () {
    apiCalls() 

}); 



function apiCalls() {
    let table = document.getElementById("apicalls");
    let overview = document.getElementById("overview");
    
    if (table.style.display === "none") {
        table.style.display = "table";
        overview.style.display = "none";
    } else {
        table.style.display = "none";
        overview.style.display = "block"
    }
}

let buttonTwo = document.getElementById("button-apicalls");
buttonTwo.addEventListener('click', function () {
    apiCalls() 

   
});



