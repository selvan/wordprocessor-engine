jest.autoMockOff();

let TextNode = require("./../../TextNode.js");
let ContainerNode = require("./../../../container/ContainerNode.js");
let Style = require("./../../../../Style.js");
let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe("removeCharBetween", function() {
    let parent_node;
    let unicode_text_node;
    let changeCallback;

    beforeEach(function() {
        parent_node = new ContainerNode();
        unicode_text_node = new TextNode("💩நிIñtërnâtiônàlizætiøn");
        parent_node.push(unicode_text_node);

        changeCallback = jest.genMockFunction();
        unicode_text_node.addChangeListener(changeCallback);
    });

    it('at start', function() {
        unicode_text_node.removeCharBetween(0, 1);
        expect(unicode_text_node.text).toEqual("நிIñtërnâtiônàlizætiøn");
        expect(changeCallback).toBeCalled();
    });

    it('at end', function() {
        unicode_text_node.removeCharBetween(unicode_text_node.size-1, unicode_text_node.size);
        expect(unicode_text_node.text).toEqual("💩நிIñtërnâtiônàlizætiø");
        expect(changeCallback).toBeCalled();
    });

    it('at middle', function() {
        unicode_text_node.removeCharBetween(5, 10);
        expect(unicode_text_node.text).toEqual("💩நிIñtiônàlizætiøn");
        expect(changeCallback).toBeCalled();
    });
});