interface If1 {
    name: string;
    num: number;
}
interface If2 {
    name2: string;
    name: string;
    num: number;
}
let if1: If1 = { name: 'john', num: 1 };
let if2: If2 = if1 as If2;
console.log(if2.name);
