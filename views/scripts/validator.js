$(document).ready(function () {
    $(".name").on('input', function() {
        var input = $(this);
        nameReg = /^([A-Za-z ])+$/;
        if(!nameReg.test(input)){
            alert("Names must contain only letters");
            console.log("bad");
            return false;
        };
    });

    $(".fname").on('input', function() {
        var input = $(this);
        nameReg = /([A-Za-z])/;
        if(!nameReg.test(input)){
            alert("Names must contain only letters");
            console.log('bad');
            return false;
        };
    });

    $(".lname").on('input', function() {
        var input = $(this);
        nameReg = /^([A-Za-z])+$/;
        if(!nameReg.test(input)){
            //error
        };
    });

    $(".email").on('input', function() {
        var input = $(this);
        emailReg = /^([w-.]+@([w-]+.)+[w-]{2,4})?$/;
        if(!emailReg.test(input)){
            //error
        };
    });

    $(".phone").on('input', function() {
        var input = $(this);
        intRegex = /[0-9 -()+]+$/;
        if((phone.length < 6) || (!intRegex.test(input))) {
            //error
        };
    });

    $(".zip").on('input', function() {
        var input = $(this);
        zipRegex = /^[0-9]+$/;
        if(zipRegex.test(input)) {
            //error
        };
    });
});