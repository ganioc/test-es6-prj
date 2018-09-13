async function anotherAsync() {
    let value = await task3(4);
    console.log('anotherAsync():', value);
}

let task1 = (num) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("task1:", num + 1)
            anotherAsync()
            resolve(num + 1)

        }, 1000);
    });
}
let task2 = (num) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("task2:", num + 1)
            resolve(num + 1)
        }, 1000);
    });
}
let task3 = (num) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("task3:", num + 1)
            resolve(num + 1)
        }, 1000);
    });
}
async function funcWaitFor() {
    var value = await task1(1);
    var value2 = await task2(2);
    var value3 = await task3(3);

    let sum = value + value2 + value3;
    console.log('sum is:', sum);
    return sum;
}
funcWaitFor();

async function asyncFun() {
    let value = await Promise
        .resolve(1)
        .then(x => x * 3)
        .then(x => x + 5)
        .then(x => x + 3);
    return value;
}
asyncFun().then(x => {
    console.log('last :', x)
});
