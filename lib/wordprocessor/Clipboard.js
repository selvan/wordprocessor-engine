class Clipboard {
    constructor() {
        this._content=null;
    }

    set content(_content) {
        this._content = _content;
    }

    get content() {
        return this._content;
    }
}

let _instance = new Clipboard();
module.exports = _instance;