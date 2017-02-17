jest.autoMockOff();

let TextNode = require("./../../TextNode.js");

describe('text', function() {

    let simple_text_node;
    let changeCallback;

    beforeEach(function() {
        simple_text_node = new TextNode("");
        changeCallback = jest.genMockFunction();
        simple_text_node.addChangeListener(changeCallback);
    });

    it('simple', function() {
        simple_text_node.text="abc";
        expect(simple_text_node.size).toEqual(3);
        expect(changeCallback).toBeCalled();
    });
});
