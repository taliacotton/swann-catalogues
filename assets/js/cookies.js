// let usingCookies = true;

// let cookieBanner = document.getElementById("cookieBanner");
// let lots = document.querySelectorAll("section.lot");



// function setCookie(cname,cvalue) {
// //   var d = new Date();
// //   d.setTime(d.getTime() + (exdays*24*60*60*1000));
// //   var expires = "expires=" + d.toGMTString();
//     if (usingCookies){
//         document.cookie = cname + "=" + cvalue + "; max-age=94608000;path=/";
//     }
// }

// function getCookie(cname) {
//   var name = cname + "=";
//   var decodedCookie = decodeURIComponent(document.cookie);
//   var ca = decodedCookie.split(';');
//   for(var i = 0; i < ca.length; i++) {
//     var c = ca[i];
//     while (c.charAt(0) == ' ') {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return false;
// }

// function checkCookie() {
//   var permission=getCookie("permission");
//   if (permission) {
//     cookieBanner.style.display = "none";
//   } 
// //   else {
// //      user = prompt("Please enter your name:","");
// //      if (user != "" && user != null) {
// //        setCookie("username", user, 30);
// //      }
// //   }
// }


// function acceptCookies(){
//     cookieBanner.style.bottom = "-300px";
//     setCookie("permission", true)
// }

// function declineCookies(){
//     usingCookies = false;
// }

