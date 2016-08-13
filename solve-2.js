var rect = require('./rectangle-2');

function solveRect(l, b) {
    console.log("Soving for rectangle with l=", l, " b=",b);

    rect(l, b, function (err, rectangle) {
        if (err){
            console.log(err);
        }
        else {
            console.log("Area of rectangle is: ",rectangle.area());
            console.log("Perimeter of rectangle is: ",rectangle.perimeter());
        }
    });
}

solveRect(2, 5);
solveRect(3, 4);
solveRect(-5, 4);