let nav = document.getElementById("topbar");
let cover = document.getElementById("cover");
let toc = document.getElementById("table-of-contents");

let mainImgs = document.querySelectorAll("section.lot .left img");
let lotSections = document.querySelectorAll("section.lot");
let bookmarks = document.querySelectorAll(".bookmark-container");
let highlightTexts = document.querySelectorAll("section.lot .center-column p")
let leftSections = document.querySelectorAll(".lot > .left");
let sections = document.querySelectorAll("section");

let currentSection = 0;

// let notesPrompt = document.getElementById("notes-prompt");

let scrollHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);


let mouseIsDown = false;

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
let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
showHideNav(scrollTop);

showCurrentImage();

document.addEventListener("scroll", function(){
    scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;

// NAV COME IN
    showHideNav(scrollTop);

// TOOLTIPS
    if(scrollTop > window.innerHeight*2 && document.querySelector(".lot").getBoundingClientRect().top > window.innerHeight/2){
        document.getElementById("hamburgerCallout").classList.add("visible");
    } else {
        document.getElementById("hamburgerCallout").classList.remove("visible");
    }

// MARKER ON SCROLL
    if (scrollTop > window.innerHeight*3){
        document.getElementById("marker").style.top = interpolate(scrollTop, window.innerHeight*3, scrollHeight, 0, 100) + "%";
    }

// IMAGE FADE ON SCROLL
    showCurrentImage();

// HIDE NOTES BUTTON IF ACTIVE
    if (document.querySelector(".notes-prompt.np-right") != null){
        let npRightContainer = document.querySelector(".notes-prompt.np-right").parentElement.getBoundingClientRect();
        if (npRightContainer.top > window.innerHeight || npRightContainer.bottom < 0){
            document.querySelector(".notes-prompt.np-right").classList.remove("np-right");
        }
    }
    if (document.querySelector(".notes-prompt.np-left") != null){
        let npLeftContainer = document.querySelector(".notes-prompt.np-left").parentElement.getBoundingClientRect();
        if (npLeftContainer.top > window.innerHeight || npLeftContainer.bottom < 0){
            document.querySelector(".notes-prompt.np-left").classList.remove("np-left");
        }
    }

// CHANGE URL ON TOP
    for (let l of leftSections){
        if (l.classList.contains("active")){
            let newHash = '#' + l.parentElement.id;
            if(history.pushState) {
                history.pushState(null, null, newHash);
            } else {
                location.hash = newHash;
            }
        }
    }


})


let imgZoom = false;

// ZOOM IMAGE
for (let ls of leftSections){
    ls.addEventListener("mousedown", function(e){
        imgZoom = !imgZoom;
        if (imgZoom){zoomImg(e, ls);} 
        else {unzoomImg(ls);}
    })
    ls.addEventListener("mousemove", function(e){
        if (imgZoom){zoomImg(e, ls);}
    })
    ls.addEventListener("mouseout", function(e){
        imgZoom = false;
        unzoomImg(ls);
    });
}

function zoomImg(e, ls){
    let img = ls.querySelector("img");
    ls.classList.add("zoom");
    let xPos = interpolate(e.clientX, img.getBoundingClientRect().left, img.getBoundingClientRect().right,0,100)
    let yPos = interpolate(e.clientY, img.getBoundingClientRect().top, img.getBoundingClientRect().bottom,0,100)
    img.style.objectPosition = xPos + "% " + yPos + "%";
}

function unzoomImg(ls){
    ls.classList.remove("zoom");
    ls.querySelector("img").style.objectPosition = "center";
}

// NOTES PROMPT MOVE
for (let lot of lotSections){
    lot.addEventListener("mousemove", function(e){
        let centerCol = lot.querySelector(".center-column");
        let notesPrompt = lot.querySelector(".notes-prompt");

        // vertical position
        if (e.clientY < centerCol.getBoundingClientRect().bottom && e.clientY > centerCol.getBoundingClientRect().top){
            notesPrompt.style.top = e.clientY + "px";
        } else {
            notesPrompt.style.top = "-100px";
        }

        // horizontal position
        if (e.clientX < centerCol.getBoundingClientRect().left && e.clientX > lot.getBoundingClientRect().left + lot.getBoundingClientRect().width/2){
            notesPrompt.classList.add("np-left");
            notesPrompt.classList.remove("np-right");
        } else if (e.clientX > centerCol.getBoundingClientRect().right){
            notesPrompt.classList.add("np-right");
            notesPrompt.classList.remove("np-left");
        } else {
            notesPrompt.classList.remove("np-right", "np-left");
        }
    })

}

// NOTES PROMPT CLICK
let notesPrompts = document.querySelectorAll(".notes-prompt");
for (let np of notesPrompts){
    np.addEventListener("click", function(e){
        // figure out which margin to add it in
        let targetMargin;
        if (np.classList.contains("np-right")) {
            targetMargin = np.parentElement.querySelector(".notes-right")
        } else if (np.classList.contains("np-left")){
            targetMargin = np.parentElement.querySelector(".notes-left")
        }

        // calculate percent top of textarea based on cursor xPos
        let elTop = np.parentElement.getBoundingClientRect().top * -1;
        let elHeight = np.parentElement.getBoundingClientRect().height;
        let pct = (elTop + e.clientY)*100/elHeight;
        let t = document.createElement("TEXTAREA");
        t.classList.add("notes", "small-type");
        t.style.top = pct + "%";
        targetMargin.appendChild(t);
        t.focus();
        resizeAllTextareas();
        np.classList.remove("np-left", "np-right");

        //  hide button when typing
        // t.onblur=function(){np.style.display="block"}
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

for (let s of sections){
    console.log(s.id, s.offsetTop);
}


// KEY TO NEXT SECTION
document.addEventListener("keydown", function(e){
    document.documentElement.style.scrollBehavior= "auto";
    if (e.key == "ArrowRight"){
        currentSection++;
        jump(sections[currentSection].id)
    }
    if (e.key == "ArrowLeft"){
        currentSection--;
        jump(sections[currentSection].id)
    }
})

function showHideNav(st){
    if (st > 50){nav.classList.add("visible")}
    else {nav.classList.remove("visible")}
}

function showCurrentImage(){
    for (let l of leftSections){
        let bottom = l.getBoundingClientRect().bottom;
        let top = l.getBoundingClientRect().top;
        if (top <= window.innerHeight - window.innerHeight/2 && bottom >= window.innerHeight/2){
            l.classList.add("active")
        } else {
            l.classList.remove("active")
        }
    }
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
// toc.addEventListener("mousemove", function(e){
//     if (document.querySelector(".dot-container.hover") != null){document.querySelector(".dot-container.hover").classList.remove("hover")}
//     let elems = [];
//     for (let d of tocDots){
//         let dCenterX = d.querySelector(".dot").getBoundingClientRect().left + d.querySelector(".dot").getBoundingClientRect().width/2;
//         let dCenterY = d.querySelector(".dot").getBoundingClientRect().top + d.querySelector(".dot").getBoundingClientRect().height/2;
//         if (distance(dCenterX, dCenterY, e.clientX, e.clientY) < 50){
//             elems.push(d);
//         } 
//     }
//     elems[0].classList.add("hover");
// })


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

function jump(h){
    var url = location.href;               //Save down the URL without hash.
    location.href = "#"+h;                 //Go to the target element.
    history.replaceState(null,null,url);   //Don't like hashes. Changing it back.
}


function distance(x1, y1, x2, y2){
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}