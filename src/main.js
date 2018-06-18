var x;
x = "First Name";
console.log(x);
console.log(typeof x);
var strArr;
strArr = ['a', 'b', 'c', 'd', 'e'];
console.log(strArr.join('-'));
var funcMy;
funcMy = (arg) => {
    console.log(arg);
    return 'This is My Func';
};
funcMy('A fish');
class Character {
    constructor(firstName, secondName) {
        this.fullName = firstName + ' ' + secondName;
    }
    greet(name) {
        if (name) {
            return 'Hi,' + name + '. I am ' + this.fullName;
        }
        else {
            return 'I am ' + this.fullName;
        }
    }
}
var charac = new Character('John', 'Smith');
console.log(charac.greet('Joe'));
class Logger {
    log(arg) {
        console.log(arg);
    }
}
var custLogger = new Logger();
custLogger.log('Hi logger');
var userIf = {
    name: 'normal user',
    password: '234567'
};
console.log(userIf);
function add(...num) {
    var result = 0;
    for (var i = 0; i < num.length; i++) {
        result += num[i];
    }
    return result;
}
console.log(add(1, 3, 4, 51, 1));
