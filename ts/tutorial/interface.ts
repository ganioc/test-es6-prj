interface IfLogger {
    log(arg: any): void;
}
class Logger implements IfLogger {
    public log(arg) {
        if (typeof console.log === 'function') {
            console.log(arg);
        } else {
            alert(arg);
        }
    }
}
