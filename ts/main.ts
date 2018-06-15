

var x: string | string[];

x = "First Name";

console.log(x);
console.log(typeof x);

type CUST_ARRAY = string[];
var strArr: CUST_ARRAY;
strArr = ['a', 'b', 'c', 'd', 'e'];

console.log(strArr.join('-'));

var funcMy: (arg: string) => string;
funcMy = (arg: string): string => {
    console.log(arg);
    return 'This is My Func';

};
funcMy('A fish');

class Character {
    fullName: string;
    constructor(firstName: string, secondName: string) {
        this.fullName = firstName + ' ' + secondName;
    }
    greet(name?: string): string {
        if (name) {
            return 'Hi,' + name + '. I am ' + this.fullName;
        } else {
            return 'I am ' + this.fullName;
        }
    }
}

var charac = new Character('John', 'Smith');
console.log(charac.greet('Joe'));

interface LoggerInterface {
    log(arg: any): void;
}

class Logger implements LoggerInterface {
    log(arg: any) {
        console.log(arg);
    }
}

var custLogger: Logger = new Logger();
custLogger.log('Hi logger');

interface UserInterface {
    name: string;
    password: string;
}

var userIf: UserInterface = {
    name: 'normal user',
    password: '234567'
};
console.log(userIf);


