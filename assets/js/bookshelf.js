let catalogueList = document.getElementById("#catalogueList");
let catalogues = document.querySelectorAll("#catalogueList li");
let toolbar = document.querySelector(".toolbar");
// let audio = document.getElementsByTagName("audio")[0];


for (let c of catalogues){
    let size = parseInt(c.getAttribute("data-size"));
    let height = Math.floor(interpolate(size, 0, 500, 37, 170)) + "px";
    c.style.height = height;
    c.style.lineHeight = height;
    // c.onmouseenter = function(){
    //     audio.currentTime = 0;
    //     audio.play();
    // }

    // PAGE TRANSITION, deleted to make transition faster
    // c.querySelector('a').onclick=function(e){
    //     e.preventDefault();
    //     let URL = this.href;
    //     setTimeout( function() { window.location = URL }, 2000 );
    //     triggerPageTransition(this.parentElement);
    // }
}

function toggleMenu(){
    toolbar.classList.toggle("open");
}

function sortTable(category) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("catalogueList");
  switching = true;

  // switch arrow direction
  if (document.querySelector(".toolbar svg.rotated") != null){
    document.querySelector(".toolbar svg.rotated").classList.remove("rotated");
  }
  document.querySelector(".toolbar ." + category + " svg").classList.add("rotated");

//   let selector = "[data-" + category + "]";
//   console.log(selector);
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = document.querySelectorAll("#catalogueList li");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 0; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
        if (category == "department"){
            x = rows[i].querySelectorAll(".department")[0];
            y = rows[i + 1].querySelectorAll(".department")[0];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        } else {
            x = rows[i].getAttribute("data-" + category);
            y = rows[i + 1].getAttribute("data-" + category);
            if (parseInt(x) > parseInt(y)) {
                shouldSwitch = true;
                break;
            }
        }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
   // Close the menu when sorting is complete
   // I added an open check since I am not 100% sure how this will affect desktop
   if (toolbar.classList.contains('open')) {
      toggleMenu();
   }
   
}

function triggerPageTransition(selection){
    // console.log(selection);
    document.body.classList.add("transition");
    selection.classList.add("focus");
    selection.style.top = selection.getBoundingClientRect().top-window.pageYOffset + "px";
    setTimeout(function(){
        selection.style.top = "0px";
        // selection.style.height = "100vh";
        selection.classList.add("focus2");
        // selection.querySelector("a").style.height = "100vh";
        selection.style.lineHeight = "100vh";
        selection.classList.add("expanded");
    },800)
}

function interpolate(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}