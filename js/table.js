/**
 * Toggle the visiblity of the network table element.
 * Activation: Button on page.
 */
function showNetworkTable() {
  // get the network table pop-up element
  var x = document.getElementById("networkTablePopup");
  // and toggle its visiblity
  x.classList.toggle("visible");
}