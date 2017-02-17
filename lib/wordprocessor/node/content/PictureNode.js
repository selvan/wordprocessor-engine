import ContentAsRefNode from "./ContentAsRefNode"
import PageNode from "./../container/PageNode"
import assign from 'object-assign';
import keyMirror from 'keymirror';

class PictureNode extends ContentAsRefNode {

    static EVENTS = keyMirror({
        UPDATE_PICTURE_DATA: null,
        UPDATE_PICTURE_SIZE: null
    });

    constructor(id) {
        super(id);
        this.width =330;
        this.height =165;
    }

    get width() {
        return this._width;
    }

    set width(_width) {
        this._width=_width;
    }

    get height() {
        return this._height;
    }

    set height(_height) {
        this._height=_height;
    }

    get imgData() {
        return this._imgData;
    }

    set imgData(_imgData) {
        this._imgData=_imgData;
        this.notifyChange({type: PictureNode.EVENTS.UPDATE_PICTURE_DATA, eventSource: this});
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.notifyChange({type: PictureNode.EVENTS.UPDATE_PICTURE_SIZE, eventSource: this});
    }

    canBeAChildTo(toBeParentNode) {
        if(toBeParentNode instanceof PageNode) {
            return true;
        }
        return false;
    }

    serialize(collector) {
        let _meta_and_data = super.serialize(collector);
        if(!collector.pictures) {
            collector.pictures = {};
        }

        collector.pictures[_meta_and_data.meta.refLink] = assign({}, _meta_and_data);
        _meta_and_data.data = {};
        return _meta_and_data;
    }

    serializableData() {
        return {
            width: this.width,
            height: this.height,
            imgData: this.imgData
        };
    }

    deserializeData(deserializer, dataAndMeta) {
        super.deserializeData(deserializer, dataAndMeta);
        let meta = dataAndMeta.meta;
        let _data = {};
        if(meta.refLink) {
            let metaAndData = deserializer.wordbookSerializedData.refItems.pictures[meta.refLink];
            _data = metaAndData.data;
        }
        this.width = _data.width;
        this.height = _data.height;
        this.imgData = _data.imgData;
    }

    cloneSelf() {
        let _pictNode = new this.constructor(this.type, this.id);
        _pictNode.imgData = this.imageData;
        _pictNode.width = this.width;
        _pictNode.height = this.height;
        return _pictNode;
    }
}

module.exports = PictureNode;
