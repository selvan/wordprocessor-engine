import ContentAsRefNode from "./ContentAsRefNode"
import PageNode from "./../container/PageNode"
import assign from 'object-assign';

let keyMirror = require('keymirror');

class ChartNode extends ContentAsRefNode {

    static TYPE = keyMirror({
        LINE: null,
        VBAR: null,
        HBAR: null,
        PIE: null,
        DONUT: null
    });

    static EVENTS = keyMirror({
        UPDATE_SHEET_RANGE: null,
        UPDATE_CHART_SIZE: null
    });

    constructor(_type) {
        super();
        this.width =330;
        this.height =165;
        this.type = _type;
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

    get sheetRange() {
        return this._sheetRange;
    }

    set sheetRange(_sheetRange) {
        this._sheetRange=_sheetRange;
    }

    updateSheetRange(sheetRange) {
        this.sheetRange = sheetRange;
        this.notifyChange({type: ChartNode.EVENTS.UPDATE_SHEET_RANGE, eventSource: this});
    }

    get type() {
        return this._type;
    }

    set type(_type) {
        if(_type && (! ChartNode.TYPE.hasOwnProperty(_type))) {
            throw new Error(`Unknown chart type ${_type}`);
        }
        this._type = _type;
    }

    canBeAChildTo(toBeParentNode) {
        if(toBeParentNode instanceof PageNode) {
            return true;
        }
        return false;
    }

    cloneSelf() {
        let _chartNode = new this.constructor(this.type, this.id);
        _chartNode.sheetRange = this.sheetRange;
        _chartNode.width = this.width;
        _chartNode.height = this.height;
        return _chartNode;
    }

    serialize(collector) {
        let _meta_and_data = super.serialize(collector);
        if(!collector.charts) {
            collector.charts = {};
        }

        collector.charts[_meta_and_data.meta.refLink] = assign({}, _meta_and_data);
        _meta_and_data.data = {};
        return _meta_and_data;
    }

    serializableData() {
        return {
            width: this.width,
            height: this.height,
            type: this.type,
            sheetRange: this.sheetRange
        };
    }

    deserializeData(deserializer, dataAndMeta) {
        super.deserializeData(deserializer, dataAndMeta);
        let meta = dataAndMeta.meta;
        let _data = {};
        if(meta.refLink) {
            let metaAndData = deserializer.wordbookSerializedData.refItems.charts[meta.refLink];
            _data = metaAndData.data;
        }
        this.width = _data.width;
        this.height = _data.height;
        this.type = _data.type;
        this.sheetRange = _data.sheetRange;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.notifyChange({type: ChartNode.EVENTS.UPDATE_CHART_SIZE, eventSource: this});
    }
}

module.exports = ChartNode;
