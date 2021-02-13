// const observer = lozad(); // lazy loads elements with default selector as '.lozad'
// observer.observe();
// var lazyLoadInstance = new LazyLoad({
//   // Your custom settings go here
// });

const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

// lozad('.lozad', {
//     loaded: function(el) {
//         // Custom implementation on a loaded element
//         el.classList.add('loaded');
//     }
// });

let usingCookies = true;

let nav = document.getElementById("topbar");
let cover = document.getElementById("cover");
let toc = document.getElementById("table-of-contents");
let sb = document.getElementById("searchbar");

let stripe = document.querySelector("#cover .stripe");
let stripeWidth = stripe.getBoundingClientRect().width;

let mainImgs = document.querySelectorAll("section.lot .left img");
let lotSections = document.querySelectorAll("section.lot");
let bookmarks = document.querySelectorAll(".bookmark-container");
let highlightTexts = document.querySelectorAll("section.lot .center-column p")
let leftSections = document.querySelectorAll(".lot > .left");
let rightSections = document.querySelectorAll(".lot > .right");
let sections = document.querySelectorAll("section");
let cookieBanner = document.getElementById("cookieBanner");

let mobileThumbs = document.querySelectorAll(".mobile-thumb");

let currentSection = 0;
let breakpoint = 726;


// COOKIES

// define which lots are bookmarked
var bookmarked = [];
if(getCookie("bookmarked")) {
    bookmarked = JSON.parse(getCookie("bookmarked"));
};

// apply bookmarks from cookie
// Classlist of Null?
for (let lotId of bookmarked){
    if (document.getElementById(lotId)){
        document.getElementById(lotId).classList.add("lot-bookmarked");
    }
    for (let lot of document.querySelectorAll(".sidebar--lots li")){
        if (lotId == lot.getAttribute("data-id")){
            lot.classList.add("bookmarked");
        }
    }
}

// define notes object
let notes = [];
if(getCookie("notes")) {
    notes = JSON.parse(getCookie("notes"));
};

// apply notes from cookie
for (let note of notes){
    createNote(note.side, note.top, note.content, note.lot);
}


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
    // if (img.complete) {
    //         img.parentElement.style.backgroundColor ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
    // } else {
        img.addEventListener('load', function() {
            img.parentElement.style.backgroundColor ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
        });
    // }
}


//PAGE LOADER
// document.addEventListener('DOMContentLoaded', function() {

// document.body.classList.remove("loading");


document.body.classList.remove("loading");

window.addEventListener('load', function() {
    setTimeout(function(){
        for (let thumb of document.querySelectorAll(".thumbnail-lockup")) {
            thumb.classList.add("loaded");
            if (thumb.getBoundingClientRect().bottom > window.innerHeight){
                thumb.classList.add("bottom");
            }
        }
    },500)
});

// }, false);

// setInterval(function(){
//     if (stripeWidth < window.innerWidth){
//         stripeWidth++;
//         stripe.style.width = stripeWidth + "px";
//     }
// },100)


// TRIGGER SEARCH BAR
function triggerSearch(){
    sb.classList.add("visible");
    sb.focus();
}
function search(){
    let searchterm = sb.value;
    window.find(sb.value);
}
function closeSearch(){
    sb.classList.remove("visible");
}

// TRIGGER PRINT MODAL
function triggerPrintModal(){
    document.getElementById("printModal").classList.toggle("visible");
}

// PRINT COMMAND
function printBook(){     
    window.print();
}


// MOBILE: THUMBNAIL FULLSCREEN
for (let thumb of mobileThumbs){
    thumb.addEventListener("click", function(){
        let image = thumb.parentElement.parentElement.parentElement.querySelector(".left > img");
        openFullscreen(image);
    })
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
    if (document.getElementById("hamburgerCallout").classList.contains("visible")){
        document.getElementById("hamburgerCallout").classList.remove("visible");
        document.getElementById("hamburgerCallout").style.display="none";
    }  
}


// MARKER ON SCROLL
// if (scrollTop >= document.querySelector(".lots").offsetTop){
//     document.getElementById("marker").style.top = interpolate(scrollTop, document.querySelector(".lots").offsetTop, scrollHeight, 0, 100) + "%";
// }

// IMAGE APPEAR ON SCROLL
    showCurrentImage();

// HIDE NOTES BUTTON IF ACTIVE (????)
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
            currentSection = parseInt(l.parentElement.id.substring(3)) + 3;
            if(history.pushState) {
                history.pushState(null, null, newHash);
            } else {
                location.hash = newHash;
            }

// MARKER
           document.querySelector(".sidebar--lots li[data-id='"+l.parentElement.id+"']").classList.add("current"); 

        } else {
            document.querySelector(".sidebar--lots li[data-id='"+l.parentElement.id+"']").classList.remove("current"); 
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
    // console.log(img.src)
    // img.src = "https://res.cloudinary.com/dcryyrd42/image/upload/f_auto,q_70,h_" + window.innerHeight + img.getAttribute("data-img");
    img.setAttribute("sizes","1200px");
    ls.classList.add("zoom");
    // let xPos = interpolate(e.clientX, 39, 39 + (window.innerWidth - 39)/2, 0, -74.3);
    // let yPos = interpolate(e.clientY, 39, window.innerHeight, 0, -35);
    // img.style.transform = "translateX("+xPos+"%) translateY("+yPos+"%)";
    let xPos = interpolate(e.clientX, 39, 39 + (window.innerWidth - 39)/2, 0, 100);
    let yPos = interpolate(e.clientY, 39, window.innerHeight, 0, 100);
    // img.style.left = xPos+"px";
    // img.style.top = yPos+"px";
    img.style.objectPosition = xPos + "% " + yPos + "%";
    // img.style.bottom = yPos + "%";
    // img.style.left = xPos + "%";
}

function unzoomImg(ls){
    ls.classList.remove("zoom");
    ls.querySelector("img").style.objectPosition = "center";
    ls.querySelector("img").setAttribute("sizes","(min-width: 726px) 50vw, 100vw");
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

        

        t.addEventListener("blur", function(){
            // console.log("BLURRED");

            let obj = 
                {   content: t.value, 
                    top: pct, 
                    side: targetMargin.classList[0],
                    lot: targetMargin.parentElement.parentElement.parentElement.id}
            notes.push(obj);
            // console.log(notes);
            setCookie("notes",JSON.stringify(notes));

            // document.cookie = "notes=" + JSON.stringify({foo: 'bar', baz: 'poo'});
        })
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
        let parent = bm.parentElement.parentElement;
        parent.classList.toggle("lot-bookmarked");
        document.querySelector(".sidebar--lots li[data-id='"+parent.id+"']").classList.toggle("bookmarked");

        // SAVE A COOKIE
        if (parent.classList.contains("lot-bookmarked")){
            bookmarked.push(parent.id);
        } else {
            // if (bookmarked.indexOf(parent.id) > -1) {
            //     array.splice(index, 1);
            // }
            bookmarked = bookmarked.filter(e => e !== parent.id);
        }
        setCookie("bookmarked",JSON.stringify(bookmarked))
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


// KEY TO NEXT SECTION
document.addEventListener("keydown", function(e){
    document.documentElement.style.scrollBehavior= "auto";
    if (e.key == "ArrowRight"){
        currentSection++;
        // console.log(currentSection);
        jump(sections[currentSection].id)
    }
    if (e.key == "ArrowLeft"){
        currentSection--;
        jump(sections[currentSection].id)
    }
})

function showHideNav(st){
    if (st > 50){nav.classList.add("visible")}
    else {nav.classList.remove("visible");sb.classList.remove("visible");}
}

function showCurrentImage(){
    if (window.innerWidth > breakpoint){
        for (let l of leftSections){
            let bottom = l.getBoundingClientRect().bottom;
            let top = l.getBoundingClientRect().top;
            if (top <= window.innerHeight - window.innerHeight/2 && bottom >= window.innerHeight/2){
                l.classList.add("active")
                l.parentElement.classList.add("lot-loaded");
            } else {
                l.classList.remove("active")
            }
        }
    } else {
        for (let r of rightSections){
            let bottom = r.getBoundingClientRect().bottom;
            let top = r.getBoundingClientRect().top;
            if (top <= 30 && bottom >= window.innerHeight/2){
                r.classList.add("active")
            } else {
                r.classList.remove("active")
            }
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
    if (year != ""){
        years.push(year);
    }
}
let minYear = Math.floor(Math.min(...years)/5)*5;
let maxYear = Math.ceil(Math.max(...years)/5)*5;
if (document.getElementById("toc-dates") != null){
document.getElementById("toc-dates").innerHTML = `<p>${minYear}</p>
                                                  <p>${Math.floor(minYear + (maxYear - minYear)/6)}</p>
                                                  <p>${Math.floor(minYear+(maxYear - minYear)/6*2)}</p>
                                                  <p>${Math.floor(minYear+(maxYear - minYear)/6*3)}</p>
                                                  <p>${Math.floor(maxYear-(maxYear - minYear)/6)}</p>
                                                  <p>${maxYear}</p>`
}
for (let d of tocDots){
    let container = d.querySelector(".dot-container-inner");
    let left = interpolate(d.getAttribute("data-year"), Math.min(...years), Math.max(...years), 0, 100);
    container.style.left = left + "%";
    d.querySelector(".line").style.width = "calc(" + left + "% + var(--toolbar-height) + 12px)";

    let img = d.querySelector('img');
    let dot = d.querySelector('.dot');

    if (img.getBoundingClientRect().left >= window.innerWidth-200){
        d.querySelector(".thumbnail-lockup").style.position="fixed";
        d.querySelector(".thumbnail-lockup").style.right="0px";
    }

    // Make sure image is finished loading
    // if (img.complete) {
    //         dot.style.background ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
    // } else {
        img.addEventListener('load', function() {
            dot.style.background ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
        });
    // }
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

function shareLot(elem){
    document.getElementById("url_to_copy").innerHTML=window.location.href;
    document.getElementById("url_to_copy").select();
    document.execCommand("copy");
    console.log(document.getElementById("url_to_copy").innerHTML);
    elem.innerHTML = "Link copied!"
}

function jump(h){
    // var url = location.href;               //Save down the URL without hash.
    location.href = "#"+h;                 //Go to the target element.
    // history.replaceState(null,null,url);   //Don't like hashes. Changing it back.
}


function distance(x1, y1, x2, y2){
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}

// From https://www.w3schools.com/howto/howto_js_fullscreen.asp
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}


function createNote(sideClass, topVal,innerContent, lotId){
    let t = document.createElement("TEXTAREA");
    t.classList.add("notes", "small-type");
    t.style.top = topVal + "%";
    if (document.querySelector("#" + lotId + " ." + sideClass) != null){
        document.querySelector("#" + lotId + " ." + sideClass).appendChild(t);
    }
    t.value = innerContent;
}

function testPassword(){
    console.log(document.getElementById("pw").value)
    if (document.getElementById("pw").value == "104East25th"){
        document.body.classList.remove("visible-false");
        if (document.querySelector(".password-modal input[type='checkbox']").checked){
            setCookie("access", true);
        }
    } else {
        document.getElementById("pw").style.animation = "shake 0.5s";
        document.getElementById("pw").style.border = "1px solid red";
    }
}




// COOKIES


function setCookie(cname,cvalue) {
//   var d = new Date();
//   d.setTime(d.getTime() + (exdays*24*60*60*1000));
//   var expires = "expires=" + d.toGMTString();
    if (usingCookies){
        document.cookie = cname + "=" + cvalue + "; max-age=94608000;path=/";
    }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
}

function checkCookie() {
  var permission=getCookie("permission");
  if (permission) {
    cookieBanner.style.display = "none";
  } 
  var access=getCookie("access");
  if (!access) {
    document.body.classList.add("visible-false");
  } 
//   else {
//      user = prompt("Please enter your name:","");
//      if (user != "" && user != null) {
//        setCookie("username", user, 30);
//      }
//   }
}


function acceptCookies(){
    cookieBanner.style.bottom = "-300px";
    setCookie("permission", true)
}

function declineCookies(){
    usingCookies = false;
}



//Window scroll to hide data viz in background
window.addEventListener('scroll', showHideElements );

function showHideElements(){ 
   var scrollEl = document.querySelectorAll('[data-scroll-watch]');
   scrollEl.forEach(el => {
      // get element
      let bounds = el.getBoundingClientRect();
      var dots = document.querySelector(el.dataset.hide);
      
      console.log(el.dataset.hide, dots)
      // if bounds hits top of screen hide it
      if ( bounds.bottom <= 0) {
         dots.classList.add('hide-vis');
      } else {
         dots.classList.remove('hide-vis');
      }

   });

}