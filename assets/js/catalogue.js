// const observer = lozad(); // lazy loads elements with default selector as '.lozad'
// observer.observe();
// var lazyLoadInstance = new LazyLoad({
//   // Your custom settings go here
// });

// const observer = lozad(); // lazy loads elements with default selector as '.lozad'
// observer.observe();

// console.log(window)
// window.lazySizes.init          = false;
// window.lazySizes.lazyClass     = 'lozad';
window.lazySizes.minSize       = '200w';
window.lazySizes.expand        = 450;
window.lazySizes.expFactor     = 1.3;
// window.lazySizes.init          = true;
// lazySizes.init();

var emitter = new TinyEmitter();
var colorThief = new ColorThief();


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

// let stripe = document.querySelector("#cover .stripe");
// let stripeWidth = stripe.getBoundingClientRect().width; // CAUSES RENDER BLOCKING

let mainImgs = document.querySelectorAll("section.lot .left img");
let lotSections = document.querySelectorAll("section.lot");
let bookmarks = document.querySelectorAll(".bookmark-container");
let highlightTexts = document.querySelectorAll("section.lot .center-column p")
let leftSections = document.querySelectorAll(".lot > .left");
let leftSectionsZoom = document.querySelectorAll(".lot > .left:not(.has-slideshow)");
let leftSectionsSlideshowZoom = document.querySelectorAll(".lot > .left.has-slideshow");
let rightSections = document.querySelectorAll(".lot > .right");
let sections = document.querySelectorAll("section");
let cookieBanner = document.getElementById("cookieBanner");

let displayedElems = document.querySelectorAll(".display-true");
let lastElement = displayedElems[displayedElems.length -1];

let slideshows = document.querySelectorAll(".js-slideshow");

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
function applyBookmarks() {
    for (let lotId of bookmarked){
        if (document.getElementById(lotId)){
            document.getElementById(lotId).classList.add("lot-bookmarked");
        }
        for (let lot of document.querySelectorAll(".sidebar--lots li")){
            if (lotId == lot.getAttribute("data-id")){
                lot.classList.add("bookmarked");
            }
        }
        //Table of contents square label
        for(let dot of document.querySelectorAll("#table-of-contents #toc-dots .dot-container[href='#"+lotId+"']")){
            dot.querySelector(".dot").classList.add("square");
        }
        //Print modal quantity of bookmarked lots
        document.getElementById("bookmarkedCount").innerHTML = `(${bookmarked.length})`
    }
}

// define notes object
let notes = [];
if(getCookie("notes")) {
    notes = JSON.parse(getCookie("notes"));
};

let highlights = [];
if(getCookie("highlights")) {
    highlights = JSON.parse(getCookie("highlights"));
};

// // apply notes from cookie
// for (let note of notes){
//     createNote(note.side, note.top, note.content, note.lot);
// }

// UNUSED - VERY HEAVY IN THE REENDERING PHASE
// let scrollHeight = Math.max(
//   document.body.scrollHeight, document.documentElement.scrollHeight,
//   document.body.offsetHeight, document.documentElement.offsetHeight,
//   document.body.clientHeight, document.documentElement.clientHeight
// );

let mouseIsDown = false;

// COLOR THEIF
document.addEventListener('lazyloaded', function (ev) {
   if(ev.target.classList.contains('color-theif')){
       let img = ev.target;
       let color = colorThief.getColor(img);
       if (img.classList.contains('toc-img')){
        img.parentElement.previousElementSibling.style.backgroundColor ="rgb("+color[0]+","+color[1]+","+color[2]+")";
       } else {
        img.parentElement.style.backgroundColor ="rgb("+color[0]+","+color[1]+","+color[2]+")";
       }
   }
})

// const colorImages = document.querySelectorAll('.color-theif');
// for (let img of colorImages){
//     // Make sure image is finished loading
//     // if (img.complete) {
//     //         img.parentElement.style.backgroundColor ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
//     // } else {
//         img.addEventListener('load', function() {
//             img.parentElement.style.backgroundColor ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
//         });
//     // }
// }


//PAGE LOADER
// document.addEventListener('DOMContentLoaded', function() {

// document.body.classList.remove("loading");


document.body.classList.remove("loading");

function applyThumbnails(){
    const thumbnails = document.querySelectorAll(".thumbnail-lockup")
    for (let thumb of thumbnails) {
        const boundingRect = thumb.getBoundingClientRect()
        if (boundingRect.bottom > window.innerHeight){
            thumb.classList.add("bottom");
        }
        if (boundingRect.right > window.innerWidth){
            thumb.classList.add("right");
        }
        thumb.classList.add('loaded')
    }
}

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
    document.body.classList.remove("print-recommended");
    document.body.classList.remove("print-bookmarked");
}

// PRINT COMMAND
function printBook(){
    // print select pages
    let pagesToPrint = document.querySelector('input[name = "radio"]:checked').value;
    if (pagesToPrint == "bookmarked"){
        document.body.classList.add("print-bookmarked");
    } else if (pagesToPrint == "recommended"){
        document.body.classList.add("print-recommended");
    } else {
        document.body.classList.remove("print-recommended");
        document.body.classList.remove("print-bookmarked");
    }
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
let scrollTop = 0
function applyNav() {
    scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
    showHideNav(scrollTop);
}

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
  if (document.querySelector("#lot3") != null){
    if(scrollTop > window.innerHeight*3 && document.querySelector("#lot3").getBoundingClientRect().top > window.innerHeight/2){
        document.getElementById("arrowsCallout").classList.add("visible");
    } else {
        if (document.getElementById("arrowsCallout").classList.contains("visible")){
            document.getElementById("arrowsCallout").classList.remove("visible");
            document.getElementById("arrowsCallout").style.display="none";
        }
    }
  }


    // LOAD MORE LOTS when you get to the bottom
    let lastElementTop = lastElement.getBoundingClientRect().top;

    if (lastElementTop < window.innerHeight/2){
        let nextNode = lastElement.nextElementSibling;
        if (nextNode != null){
            for (let i=0;i<25;i++){
                nextNode.classList.remove("display-none");
                nextNode.classList.add("display-true");
                nextNode = nextNode.nextElementSibling;

                displayedElems = document.querySelectorAll(".display-true");
                lastElement = displayedElems[displayedElems.length -1];
                lastElementTop = lastElement.getBoundingClientRect().top;
            }
        }
    }

    // if (lastElement.getBoundingClientRect().top )

   //show sections
   document.querySelectorAll('section').forEach(function (section){
      var bounds = section.getBoundingClientRect();
      if (
         bounds.top <= window.innerHeight * 3 &&
         bounds.bottom >= window.innerHeight / -3
      ) {
         section.classList.add('visible')
      }else{
         section.classList.remove('visible')
      }
      
   })
   // MARKER ON SCROLL
   // if (scrollTop >= document.querySelector(".lots").offsetTop){
   //     document.getElementById("marker").style.top = interpolate(scrollTop, document.querySelector(".lots").offsetTop, scrollHeight, 0, 100) + "%";
   // }

   // IMAGE APPEAR ON SCROLL
   showCurrentImage();

   // HIDE NOTES PROMPT IF TEXTAREA IS ACTIVE
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
        //  console.log(currentSection);
         if(history.replaceState) {
            history.replaceState(null, null, newHash);
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

var currentHash = function() {
  return location.hash.replace(/^#/, '')
}
// function to load a lot when you visit a sidebar link
window.addEventListener('hashchange', function(e) {
    e.preventDefault();
    let hash = currentHash();
    let elem = document.getElementById(hash);
    // console.log(hash);
    elem.classList.remove("display-none");
    elem.classList.add("display-true");
    // console.log(elem);
    // console.log("#" + hash);
    location.href = "#"+hash;
    currentSection = hash;
    setTimeout(function(){
        elem.scrollIntoView();
    },300)
});


// function loadLot(lotID){
//     console.log("working");
//     document.getElementById(lotID).classList.remove("display-none");
//     document.getElementById(lotID).classList.add("display-true");
//     location.href = "#"+lotID;
// }


let imgZoom = false;

// ZOOM IMAGE
function applyZoomImage() {
    for (let ls of leftSectionsZoom){
        ls.addEventListener("click", function(e){
        if (window.innerWidth < breakpoint) return false;
            imgZoom = !imgZoom;
            if (imgZoom) {
                zoomImg(e, ls);
                // zoomChangeSrc(ls);
            } else {
                unzoomImg(ls);
            }
        })
        ls.addEventListener("mousemove", function(e){
            if (imgZoom){zoomImg(e, ls);}
        })
        ls.addEventListener("mouseout", function(e){
            imgZoom = false;
            unzoomImg(ls);
        });
    }
}

//NOTE: should be deleted if ticket is closed
// function zoomChangeSrc(ls){
//     let img = ls.querySelector("img");
//     let rTop = ls.parentElement.querySelector('.right').getBoundingClientRect().top;
//     let src = "https://res.cloudinary.com/dcryyrd42/image/upload/f_auto,q_50,h_" + window.innerHeight + img.getAttribute("data-img");

//     img.removeAttribute('srcset')
//     img.removeAttribute('sizes')
//     img.src = src;
//     window.scrollTo(0, rTop + window.scrollY) ;
// }

function zoomImg(e, ls){
    let img = ls.querySelector("img");
    let rTop = ls.parentElement.querySelector('.right').getBoundingClientRect().top;

    ls.classList.add("zoom");
    window.scrollTo(0, rTop + window.scrollY) ;
    let xPos = interpolate(e.clientX, 39, 39 + (window.innerWidth - 39)/2, 0, 100);
    let yPos = interpolate(e.clientY, 39, window.innerHeight, 0, 100);

    img.style.objectPosition = xPos + "% " + yPos + "%";
}

function unzoomImg(ls){
    let img = ls.querySelector("img");
    ls.classList.remove("zoom");
    img.style.objectPosition = "center";
    // "(min-width: 726px) 50vw, 100vw"
    img.setAttribute("sizes",'auto');
    img.setAttribute('srcset', img.dataset.srcset)
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

startNote(function(result, np, e) {
    setTimeout(function(){
        np.style.cursor = "inherit";
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
            if (t.innerHTML.length <= 0){}

            let obj =
                {   content: t.value,
                    top: pct,
                    side: targetMargin.classList[0],
                    lot: targetMargin.parentElement.parentElement.parentElement.id}
            notes.push(obj);
            // console.log(notes);
            setCookie("notes",JSON.stringify(notes));

            // document.cookie = "notes=" + JSON.stringify({foo: 'bar', baz: 'poo'});
        }, np)
    }, 500)
});


function startNote(callback){
    for (let notePrompt of notesPrompts){
        notePrompt.addEventListener("click", function(e){
            notePrompt.style.cursor = "wait";
            callback(true, notePrompt, e);
        });
    }
}


// Event listening handler function. Stolen from http://jsfiddle.net/hmelenok/WM6Gq/
var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
} else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}

// apply notes from cookie
function applyNotes() {
    for (let note of notes){
        createNote(note.side, note.top, note.content, note.lot);
    }
}

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

// BOOKMARK CLICK
for (let bm of bookmarks){
    bm.addEventListener("click", function(){
        let parent = bm.parentElement.parentElement;
        parent.classList.toggle("lot-bookmarked");
        document.querySelector(".sidebar--lots li[data-id='"+parent.id+"']").classList.toggle("bookmarked");

        // SAVE A COOKIE
        if (parent.classList.contains("lot-bookmarked")){
            bookmarked.push(parent.id);

            // update the TOC square
            document.querySelector("#table-of-contents #toc-dots .dot-container[href='#"+parent.id+"'] .dot").classList.add("square");

        } else {
            // if (bookmarked.indexOf(parent.id) > -1) {
            //     array.splice(index, 1);
            // }
            bookmarked = bookmarked.filter(e => e !== parent.id);
            document.querySelector("#table-of-contents #toc-dots .dot-container[href='#"+parent.id+"'] .dot").classList.remove("square");
        }
        setCookie("bookmarked",JSON.stringify(bookmarked))
        // update print modal bookmarked count
        document.getElementById("bookmarkedCount").innerHTML = `(${bookmarked.length})`
    })
}

// HIGHLIGHT TEXT MOUSEUP
for (let text of highlightTexts){
    text.addEventListener('mouseup', function(e){
        if(e.target.tagName == "MARK"){
            //delete the highlight
            highlights = highlights.filter(function( obj ) {
                return obj.id !== e.target.id;
            });
           e.target.outerHTML = e.target.innerHTML;
        } else if(window.getSelection().toString().length > 0) {
            //create the highlight
            let element = document.createElement("mark");
            let elemID = "x" + new Date().getTime();
            element.id = elemID;
            window.getSelection().getRangeAt(0).surroundContents(element);
            let startChar = e.target.innerHTML.search(element.innerHTML);

            var child = e.target;
            var parent = child.parentNode;
            // The equivalent of parent.children.indexOf(child)
            var index = Array.prototype.indexOf.call(parent.children, child);

            let highlightObj =
                {   startChar: startChar,
                    totalChar: element.innerHTML.length,
                    lot: e.target.closest(".lot").id,
                    // id: elemID,
                    pIndex: index}

            console.log(highlightObj)
            highlights.push(highlightObj);
            // console.log(highlightObj);

        }
        setCookie("highlights",JSON.stringify(highlights));
        clearSelection();
      //   console.log(highlights);
    })

}


// KEY TO NEXT SECTION
document.addEventListener("keydown", function(e){
    document.documentElement.style.scrollBehavior= "auto";
    if (e.key == "ArrowRight"){
        location.href = "#"+document.querySelector(location.hash).nextElementSibling.id;
    }
    if (e.key == "ArrowLeft"){
        location.href = "#"+document.querySelector(location.hash).previousElementSibling.id;
    }
})

function hasId(element){
    return typeof element.id != 'undefined';
}

function showHideNav(st){
    if (st > 50){nav.classList.add("visible")}
    else {nav.classList.remove("visible");sb.classList.remove("visible");}
}

function showCurrentImage() {
   for (let l of leftSections) {
      let bottom = l.getBoundingClientRect().bottom;
      let top = l.getBoundingClientRect().top;
      if (
         top <= window.innerHeight - window.innerHeight / 2 &&
         bottom >= window.innerHeight / 2
      ) {
         l.classList.add("active");
         l.parentElement.classList.add("lot-loaded");
         emitter.emit("lot-loaded", l);

      } else {
         l.classList.remove("active");
      }
   }

   for (let r of rightSections) {
      let boundingRect = r.getBoundingClientRect();
      let bottom = boundingRect.bottom;
      let top = boundingRect.top;
      if (top <= 30 && bottom >= window.innerHeight / 2) {
         r.classList.add("active");
      } else {
         r.classList.remove("active");
      }
   }
}

function makeLinksExternal(){
    for (let link of document.querySelectorAll(".lot .center-column a")){
        link.setAttribute('target', '_blank');
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
function applyTocDots() {
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
    if (document.getElementById("toc-dates") != null) {
        document.getElementById("toc-dates").innerHTML = `
            <p>${minYear}</p>
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
        if (img) {

        if (img.getBoundingClientRect().left >= window.innerWidth-200){
                d.querySelector(".thumbnail-lockup").style.position="fixed";
                d.querySelector(".thumbnail-lockup").style.right="0px";
            }
            img.addEventListener('load', function() {
                var color = colorThief.getColor(img);
                dot.style.background ="rgb("+color[0]+","+color[1]+","+color[2]+")";
            });
        }

        // Make sure image is finished loading
        // if (img.complete) {
        //         dot.style.background ="rgb("+colorThief.getColor(img)[0]+","+colorThief.getColor(img)[1]+","+colorThief.getColor(img)[2]+")";
        // } else {

        // }
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
            d.parentElement.parentElement.style.visibility = "visible";
        } else {
            d.parentElement.parentElement.style.visibility = "hidden";
        }
    }
}

function shareLot(elem){
    var textarea = document.createElement('textarea');
    textarea.textContent = window.location.href;
    document.body.appendChild(textarea);

    var selection = document.getSelection();
    var range = document.createRange();
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');
    selection.removeAllRanges();

    document.body.removeChild(textarea);
    elem.innerHTML = "Link copied!";
}

// Function used on key down to skip to the next section
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
    t.innerHTML = innerContent;
    t.style.height = t.scrollHeight+'px';
}

function createHighlight(lot, childIndex, startChar, totalChar, markID){
    let m = document.createElement("MARK");
    if (document.querySelector("#" + lot) != null){
        let targetParagraph = document.querySelector("#" + lot).querySelector(".center-column").children.item(childIndex)
        var a = targetParagraph.innerHTML;
        var b = `<mark id="${markID}">`;
        var position = startChar;
        var output = [a.slice(0, position), b, a.slice(position)].join('');

        a = output;
        b = `</mark>`;
        position = startChar + totalChar;
        output = [a.slice(0, position), b, a.slice(position)].join('');

        targetParagraph.innerHTML = output;
    }
}

function testPassword(){
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
        document.cookie = cname + "=" + cvalue + "; max-age=94608000;path=null";
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
  if (!access && !document.body.classList.contains("visible-true")) {
    document.body.classList.add("visible-false");
  } else {
     document.body.classList.remove("visible-false");
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

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// Hide Data Vis once you scroll past it
// Window scroll to hide data viz in background
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
window.addEventListener('scroll', showHideElements);

function showHideElements(){
   var scrollEl = document.querySelectorAll('[data-scroll-watch]');
   scrollEl.forEach(el => {
      // get element
      let bounds = el.getBoundingClientRect();
      var dots = document.querySelector(el.dataset.hide);

      // if bounds hits top of screen hide it
      if ( bounds.bottom <= 0) {
         dots.parentElement.classList.add('hide-vis');
      } else {
         dots.parentElement.classList.remove('hide-vis');
      }

   });

}



// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// Slideshow
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// I am doing this because we have multiple scroll listeners on the window and If I turn this off it will turn off all of them
var allowScrollJack = false

function applySlideshows() {
    slideshows.forEach(function (wrapper) {
        var slideshow = wrapper.querySelector('.slideshow');
        var next = wrapper.querySelector('.js-next');
        var previous = wrapper.querySelector('.js-previous');
        var xOffset = 0;

        // create slide spacing---------------
        emitter.on('lot-loaded', function (lot) {
            resizeSlideshow(slideshow, wrapper);
        })
        // On mouse enter of left side activate slider
        // wrapper.addEventListener('mouseover', function () {
        //    allowScrollJack = true;
        // });

        // Event listner to remove the lock on the page when you mouse out of the LS
        wrapper.addEventListener('mouseleave', function () {
            // allowScrollJack = false;
            document.body.classList.remove('stuck');
        });

        // previous.addEventListener('click', function () {
        //    // scroll to next image
        //    var slideshow = wrapper.querySelector('.slideshow');
        //    var style =  window.getComputedStyle(slideshow)['transform']
        //    var imgWidth = wrapper.offsetWidth;
        //    slideshow.style.transform = 'translate3d(0px, 0,0)';
        //    console.log(style);
        // })
    })
}

window.addEventListener('wheel', function (event) {
   if (!event.target.classList.contains('slideshow-img-container')) return false;
   var slideshow = event.target.parentElement;
   var maxOffset = slideshow.getBoundingClientRect().width - (window.innerWidth/2);
   var right = slideshow.parentElement.parentElement.querySelector('.right');
   // set value
   slideshow.dataset.scroll = Number(slideshow.dataset.scroll) + (event.deltaY * .7);

   // if the slides
   // console.log(slideshow.getBoundingClientRect().top + window.pageYOffset)
   if (slideshow.dataset.scroll <= 0) {
      slideshow.style.transform = 'translate3d(0px, 0,0)'
      slideshow.dataset.scroll = 0
      document.body.classList.remove('stuck');

   } else if(slideshow.dataset.scroll >= maxOffset){
      slideshow.style.transform = 'translate3d(-'+maxOffset+'px, 0,0)'
      slideshow.dataset.scroll = maxOffset
      document.body.classList.remove('stuck');

   } else {
      // event.preventDefault();
      window.scrollTo({
         top: (right.getBoundingClientRect().top + window.pageYOffset),
        //  behavior: 'smooth'
      });
      // debounce(function () { });
      slideshow.style.transform = 'translate3d(-'+slideshow.dataset.scroll+'px, 0,0)'
      document.body.classList.add('stuck');

   }


})

// Resize function for recalculating sliderwidth
window.addEventListener('resize', function () {
   slideshows.forEach(function (wrapper) {
      var slideshow = wrapper.querySelector('.slideshow');
      resizeSlideshow(slideshow, wrapper);
   });
})

function debounce(func, timeout = 300){
   let timer;
   return (...args) => {
     clearTimeout(timer);
     timer = setTimeout(() => { func.apply(this, args); }, timeout);
   };
 }


// Function to call on resize
function resizeSlideshow(slideshow, wrapper){
   var wrapperWidth = 0;
   // create slide spacing---------------
   slideshow.querySelectorAll('.slideshow-img-container').forEach(function () {
      var width = wrapper.offsetWidth  - 60;
      wrapperWidth += width;
   })

   // Set the wrapper width
   slideshow.style.width = wrapperWidth+'px';
}

// ————————————————————————
// Slideshow arrow buttons
// ————————————————————————
function scrollSlideshow(lotId, amt){
    amt = parseInt(amt);
    
    let slideshowElem = document.querySelector("#" + lotId + " .slideshow");
    let slideshowStyle = window.getComputedStyle(slideshowElem)
    let slideshowMatrix = slideshowStyle.transform || slideshowStyle.webkitTransform || slideshowStyle.mozTransform;
    let slideshowWidth = parseInt(slideshowStyle.width);
    
    if (slideshowMatrix == 'none'){
        slideshowElem.style.transform = "translateX("+amt+"px)";
    } else {
        let transformVal = parseInt(slideshowMatrix.match(/matrix.*\((.+)\)/)[1].split(', ')[4]);
        slideshowOffset = transformVal + amt;
        slideshowElem.style.transform = "translateX("+slideshowOffset+"px)";
        if (transformVal < slideshowWidth*-1+400){
            slideshowElem.parentElement.parentElement.querySelector(".slideshow--next-btn").style.display="none";
        } else {
            slideshowElem.parentElement.parentElement.querySelector(".slideshow--next-btn").style.display="block";
        }
        if (transformVal >= 0){
            slideshowElem.parentElement.parentElement.querySelector(".slideshow--prev-btn").style.display="none";
        } else {
            slideshowElem.parentElement.parentElement.querySelector(".slideshow--prev-btn").style.display="block";
        }
    }

    document.body.classList.remove('stuck');
}


// ZOOM IMAGE
// TODO:COMMENT
function applyZoomImage2 () {
    for (let ls of leftSectionsSlideshowZoom){
    var images = ls.querySelectorAll('.slideshow-img-container');

    images.forEach(function (el) {
        el.addEventListener("click", function(e){
            if (window.innerWidth < breakpoint) return false;
            var image = el.querySelector('img');
            var src = 'https://res.cloudinary.com/dcryyrd42/image/upload/f_auto,q_70,h_1200/' + image.dataset.image;
            var zoomContainer = ls.querySelector('.zoom-container');
            zoomContainer.style.backgroundImage = "url('"+src+"')";
            zoomContainer.classList.add('active');
            ls.addEventListener('mousemove', zoomMouseMove.bind(zoomContainer))
        })
    })

    ls.querySelector('.zoom-container').addEventListener('click', function (event) {
        this.classList.remove('active');
        this.style.backgroundImage = "none";
    });
    ls.querySelector('.zoom-container').addEventListener('mouseleave', function (event) {
        this.classList.remove('active');
        this.style.backgroundImage = "none";
    });


    }
}

function zoomMouseMove(e){
   if (!this.classList.contains('active')) return false;
   let xPos = interpolate(e.clientX, 39, 39 + (window.innerWidth - 39)/2, 0, 100);
   let yPos = interpolate(e.clientY, 39, window.innerHeight, 0, 100);

   this.style.backgroundPosition = xPos + "% " + yPos + "%";
   this.classList.add('active');
}

//////////

window.addEventListener('load', resizeAllTextareas)
window.addEventListener('resize', resizeAllTextareas)

setTimeout(applyThumbnails, 500)
applyBookmarks()
applyNav()
showCurrentImage()
setTimeout(applyZoomImage, 500)
applyNotes()
applyTocDots()
setTimeout(checkCookie, 100)
applySlideshows()
setTimeout(applyZoomImage2, 500)
setTimeout(makeLinksExternal, 100)

