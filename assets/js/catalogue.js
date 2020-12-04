let nav = document.getElementById("topbar");
let cover = document.getElementById("cover");
let toc = document.getElementById("table-of-contents");

let mainImgs = document.querySelectorAll("section.lot .left img");
let lotSections = document.querySelectorAll("section.lot");
let bookmarks = document.querySelectorAll(".bookmark-container");
let highlightTexts = document.querySelectorAll("section.lot .center-column p")

// let notesPrompt = document.getElementById("notes-prompt");

let scrollHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);


let mousedown = false;

// COLOR THEIF
const colorThief = new ColorThief();
const colorImages = document.querySelectorAll('.color-theif');
for (let img of colorImages){
    // Make sure image is finished loading
    if (img.complete) {
            img.parentElement.style.backgroundColor ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
    } else {
        img.addEventListener('load', function() {
            img.parentElement.style.backgroundColor ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
        });
    }
}

// NAV COME IN
showHideNav();
document.addEventListener("scroll", function(){
    let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
    
    console.log(scrollTop, scrollHeight);
    
    showHideNav(scrollTop);
    if(scrollTop > window.innerHeight*2 && scrollTop){
        document.getElementById("hamburgerCallout").classList.add("visible");
    } else {
        document.getElementById("hamburgerCallout").classList.remove("visible");
    }

// MARKER ON SCROLL
    if (scrollTop > window.innerHeight*2){
        document.getElementById("marker").style.top = interpolate(scrollTop, window.innerHeight*2, scrollHeight, 0, 100) + "%";
    }
})



// ZOOM IMAGE
for (let img of mainImgs){
    img.addEventListener("mousemove", function(e){
        img.style.objectFit = "cover";
        let xPos = interpolate(e.clientX, img.getBoundingClientRect().left, img.getBoundingClientRect().right,0,100)
        let yPos = interpolate(e.clientY, img.getBoundingClientRect().top, img.getBoundingClientRect().bottom,0,100)
        img.style.objectPosition = xPos + "% " + yPos + "%";
    })
    img.addEventListener("mouseout", function(e){
        img.style.objectFit = "contain";
        img.style.objectPosition = "center";
    });
}

// NOTES PROMPT MOVE
for (let lot of lotSections){
    lot.addEventListener("mousemove", function(e){
        let centerCol = lot.querySelector(".center-column");
        let notesPrompt = lot.querySelector(".notes-prompt");
        notesPrompt.style.top = e.clientY + "px";
        // if (e.clientX < centerCol.getBoundingClientRect().left + centerCol.getBoundingClientRect().width/2){
        if (e.clientX < centerCol.getBoundingClientRect().left && e.clientX > lot.getBoundingClientRect().left + lot.getBoundingClientRect().width/2){
            notesPrompt.classList.add("np-left");notesPrompt.classList.remove("np-right");
        // } else if (e.clientX > centerCol.getBoundingClientRect().right - centerCol.getBoundingClientRect().width/2){
        } else if (e.clientX > centerCol.getBoundingClientRect().right){
            notesPrompt.classList.add("np-right");notesPrompt.classList.remove("np-left");
        } else {
            notesPrompt.classList.remove("np-right", "np-left");
        }
    })
}

// NOTES PROMPT CLICK
let notesPrompts = document.querySelectorAll(".notes-prompt");
for (let np of notesPrompts){
    np.addEventListener("click", function(e){
        let pct = interpolate(e.clientY, 0, window.innerHeight, 0, 100);
        console.log(np.parentElement.getBoundingClientRect());
        let t = document.createElement("TEXTAREA");
        t.classList.add("notes", "small-type");
        t.style.top = pct + "%";
        np.parentElement.querySelector(".notes-left").appendChild(t);
        t.focus();
        resizeAllTextareas();
    })
}

// Event listening handler function. Stolen from http://jsfiddle.net/hmelenok/WM6Gq/
var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
}
else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}

resizeAllTextareas();


// RESIZE TEXTAREAS. Stolen from http://jsfiddle.net/hmelenok/WM6Gq/
function resizeAllTextareas(){
    let textareas = document.querySelectorAll('textarea');
    for (let text of textareas){
        function resize () {
            text.style.height = 'auto';
            text.style.height = text.scrollHeight+'px';
        }
        /* 0-timeout to get the already changed text */
        function delayedResize () {
            window.setTimeout(resize, 0);
        }
        observe(text, 'change',  resize);
        observe(text, 'cut',     delayedResize);
        observe(text, 'paste',   delayedResize);
        observe(text, 'drop',    delayedResize);
        observe(text, 'keydown', delayedResize);

        resize();
    }
}

// BOOKMARK
for (let bm of bookmarks){
    bm.addEventListener("click", function(){
        // bm.classList.toggle("active");
        bm.parentElement.parentElement.classList.toggle("lot-bookmarked");
    })
}

//HIGHLIGHT TEXT
for (let text of highlightTexts){
    text.addEventListener('mouseup', function(e){
        if(e.target.tagName == "MARK"){
           e.target.outerHTML = e.target.innerHTML
        } else if(window.getSelection().toString().length > 0) {
            let element = document.createElement("mark")
            window.getSelection().getRangeAt(0).surroundContents(element)
        }
        clearSelection();
    })
}
// for (let mark of document.querySelectorAll("mark")){
//     mark.addEventListener("click", function(){
//         mark.outerHTML = mark.innerHTML
//     })
// }

function showHideNav(st){
    if (st > 50){nav.classList.add("visible")}
    else {nav.classList.remove("visible")}
}

function clearSelection(){
 if (window.getSelection) {window.getSelection().removeAllRanges();}
 else if (document.selection) {document.selection.empty();}
}

function interpolate(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


// TABLE OF CONTENTS
let tocDots = document.querySelectorAll(".dot-container");
let years = []
for (let d of tocDots){
    let year = d.getAttribute("data-year");
    years.push(year);
}
for (let d of tocDots){
    let container = d.querySelector(".dot-container-inner");
    let left = interpolate(d.getAttribute("data-year"), Math.min(...years), Math.max(...years), 0, 100);
    container.style.left = left + "%";
    d.querySelector(".line").style.width = "calc(" + left + "% + var(--toolbar-height) + 12px)";

    let img = d.querySelector('img');
    let dot = d.querySelector('.dot');

    // Make sure image is finished loading
    if (img.complete) {
            dot.style.background ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
    } else {
        img.addEventListener('load', function() {
            dot.style.background ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
        });
    }
}

// TOC move vicinity function
toc.addEventListener("mousemove", function(e){
    if (document.querySelector(".dot-container.hover") != null){document.querySelector(".dot-container.hover").classList.remove("hover")}
    let elems = [];
    for (let d of tocDots){
        let dCenterX = d.querySelector(".dot").getBoundingClientRect().left + d.querySelector(".dot").getBoundingClientRect().width/2;
        let dCenterY = d.querySelector(".dot").getBoundingClientRect().top + d.querySelector(".dot").getBoundingClientRect().height/2;
        if (distance(dCenterX, dCenterY, e.clientX, e.clientY) < 50){
            elems.push(d);
        } 
    }
    if (elems.length > 0){elems[0].classList.add("hover")}
})


// TOC filters
function sortTOC(shape){  
    let allDots = toc.querySelectorAll(".dot")
    for (let d of allDots){
        if (d.classList.contains(shape)){
            d.style.visibility = "visible";
        } else {
            d.style.visibility = "hidden";
        }
    }
}


function distance(x1, y1, x2, y2){
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}