// let cursor = document.getElementById("cursor");

// document.addEventListener("mousemove", function(e){
//     cursor.style.top = e.clientY + "px";
//     cursor.style.left = e.clientX + "px";
// });

function interpolate(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}