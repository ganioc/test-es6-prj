const b: boolean = false;
const weight: number = 123;
const str: string = 'hello';
// 数组
const arr: number[] = [1, 34, 45];
// 枚举
enum myEnum { Red, Green, Blue }
let myObject: any;
type myArray = Array<string | number>;
const arr2: myArray = ['s', 1];
// function type
let func1: () => number;
func1 = () => {
    console.log('hi');
    return 1;
};
