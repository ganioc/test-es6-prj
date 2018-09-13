'use strict';

console.log('hi');

class Circle {
    constructor(radius) {
        this._radius = radius;
    }
    get radius() {
        return this._radius;
    }
    set radius(r) {
        this._radius = r;
    }
    draw() {
        console.log('draw a circle with radius:', this._radius);
    }
    static drawRoot() {
        console.log('draw root:');
    }
}

let circle = new Circle(10);
circle.radius = 20;
circle.draw();
circle.radius = 50;
circle.draw();
Circle.drawRoot();

function* generator() {
    yield 1;
    yield 2;
    yield 3;
}
let gen = generator();

console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);

console.log('e'.repeat(10));

let promise = Promise.reject(56);

promise.then(function (data) {
    console.log("Succeed :", data);
}, function (err) {
    console.log("error:", err);
    throw new Error(err);
}).catch(function (err) {
    console.log("catch:", err);
});


