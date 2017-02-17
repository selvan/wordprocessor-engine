import ContentNode from "./ContentNode"

class ContentAsRefNode extends ContentNode {

    constructor(id) {
        super(id);
        if(!this.refLink) {
            this.refLink = `${new Date().getTime()}_${this.uuid}`;
        }
    }

    set refLink(_refLink) {
        this._refLink = _refLink;
    }

    get refLink() {
        return this._refLink;
    }

    serializableMeta(callcack) {
        let meta = super.serializableMeta(callcack);
        meta.refLink = this.refLink;
        return meta;
    }

    get uuid() {
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        return uuid;
    }

    deserializeData(deserializer, dataAndMeta) {
        let meta = dataAndMeta.meta;
        let refLink = meta.refLink;
        this.refLink = refLink;
    }
}

module.exports = ContentAsRefNode;
