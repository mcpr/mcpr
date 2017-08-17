$(document).ready(function () {
    $('img').addClass('responsive-img');
    $('.button-collapse').sideNav();
    $('.collapsible').collapsible();
});

function addImgClass() {
    var images = document.getElementsByTagName('img');
    var i;
    console.log(images);

    for (i = 0; i < images.length; i++) {
        images[i].className += ' responsive-img';
    }
}