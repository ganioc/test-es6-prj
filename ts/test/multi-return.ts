function rec(a: number) {
    if (a === 10) {
        return;
    }
    rec(a + 1);
    console.log(a);
}
rec(0);
function ret(): number[] {
    return [3, 4];
}