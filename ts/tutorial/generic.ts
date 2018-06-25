class Repository<T> {
    private data: T[];
    constructor(public url: string) {
    }
    public push(t: T) {
        this.data.push(t);
    }
}
const repos: Repository<number> = new Repository<number>("a");
repos.push(12);
