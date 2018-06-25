class Student {
    private fullname: string;
    constructor(name: string) {
        this.fullname = name;
    }
    public greet(name?: string): string {
        if (name) {
            return 'Hi ' + name;
        } else {
            return 'Hi ' + this.fullname;
        }
    }
}
const stu: Student = new Student('john');
stu.greet();

export { Student };
