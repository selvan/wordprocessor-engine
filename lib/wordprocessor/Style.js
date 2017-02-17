import SeqGen from 'seqgen'
let keyMirror = require('keymirror');

let TYPE = keyMirror({
    BOLD: null,
    ITALIC: null,
    UNDER_LINE: null,
    STRIKE_THROUGH: null,
    TEXT_ALIGN_LEFT: null,
    TEXT_ALIGN_RIGHT: null,
    TEXT_ALIGN_CENTER: null,
    TEXT_ALIGN_JUSTIFY: null,
    TEXT_QUOTE_LEFT: null
});

class Style {

    constructor(type, styleDefinition) {
        this._type = type;
        this._styleDefinition = styleDefinition;
        this._id = SeqGen.next();
    }

    get id() {
        return this._id;
    };

    get type() {
        return this._type;
    }

    get styleDefinition() {
        return this._styleDefinition;
    }

    toMarkup() {
        return `${JSON.stringify(this.styleDefinition)}`;
    }

    static BOLD = new Style(TYPE.BOLD, {fontWeight: 'bold'});
    static ITALIC = new Style(TYPE.ITALIC, {fontStyle: 'italic'});
    static UNDER_LINE = new Style(TYPE.UNDER_LINE, {textDecoration: 'underline'});
    static STRIKE_THROUGH = new Style(TYPE.STRIKE_THROUGH, {textDecoration: 'line-through'});
    static TEXT_ALIGN_LEFT = new Style(TYPE.TEXT_ALIGN_LEFT, {textAlign: 'left'});
    static TEXT_ALIGN_RIGHT = new Style(TYPE.TEXT_ALIGN_RIGHT, {textAlign: 'right'});
    static TEXT_ALIGN_CENTER = new Style(TYPE.TEXT_ALIGN_CENTER, {textAlign: 'center'});
    static TEXT_ALIGN_JUSTIFY = new Style(TYPE.TEXT_ALIGN_JUSTIFY, {textAlign: 'justify'});
    static TEXT_QUOTE_LEFT = new Style(TYPE.TEXT_QUOTE_LEFT, {margin:0, padding: 0, paddingLeft: "1rem",  borderLeft: "8px solid #ddd"});
}

module.exports = Style;
