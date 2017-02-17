jest.autoMockOff();

let TextNode = require("./../../TextNode.js");
let Style = require("./../../../../Style.js");

describe('clone', function() {

    let simple_text_node;
    let unicode_text_node;

    beforeEach(function() {
        simple_text_node = new TextNode("HelloWorld");
        simple_text_node.addStyle(Style.BOLD);
        unicode_text_node = new TextNode("💩நிIñtërnâtiônàlizætiøn");
    });

    it('unicode', function() {
        let _clonedNode = unicode_text_node.clone();
        expect(_clonedNode.size).toEqual(unicode_text_node.size);
        _clonedNode.text = _clonedNode.text + "1";
        expect(_clonedNode.size).toEqual(unicode_text_node.size+1);
    });
});