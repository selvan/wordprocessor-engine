jest.autoMockOff();

let TextNode = require("./../../TextNode.js");
let Style = require("./../../../../Style.js");

describe('size', function() {

    let simple_text_node;
    let unicode_text_node;

    beforeEach(function() {
        simple_text_node = new TextNode("HelloWorld");
        simple_text_node.addStyle(Style.BOLD);
        unicode_text_node = new TextNode("💩நிIñtërnâtiônàlizætiøn");
    });

    it('simple', function() {
        expect(simple_text_node.size).toEqual(10);
    });

    it('unicode', function() {
        expect(unicode_text_node.size).toEqual(22);
    });
});