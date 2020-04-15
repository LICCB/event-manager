
/*Partials*/
var headerTitle = "L.I.C. Community Boathouse";
var headerSubtitle = "Event Manager";
var footer = "Long Island City Community Boathouse &copy; 2020";
var email = "someone@example.com";
var contact = 'Contact Information: ';

/*Tooltips*/



/*Elements for partials*/
document.getElementById("headerTitle").innerHTML = window.headerTitle;
document.getElementById("headerSubtitle").innerHTML = window.headerSubtitle;
document.getElementById("footer").innerHTML = window.footer;
document.getElementById("contact").innerHTML = window.contact;
document.getElementById("email").innerHTML = window.email;
var mailto = "mailto:";
document.getElementById("email").href = mailto.concat(email);

/*Elements for tooltips*/
