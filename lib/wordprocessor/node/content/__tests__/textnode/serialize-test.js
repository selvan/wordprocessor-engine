jest.autoMockOff();

let TextNode = require("./../../TextNode.js");

describe('text', function() {
    it('serialize', function() {
        let text_node = new TextNode("some text");
        let serialized_node = text_node.serialize();

        expect(serialized_node.meta.styles.length).toEqual(0);
        expect(serialized_node.meta.nodeType).toEqual(text_node.constructor.name);
        expect(serialized_node.data.text).toEqual(text_node.text);
    });
});
