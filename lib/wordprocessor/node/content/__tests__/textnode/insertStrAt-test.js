jest.autoMockOff();

let TextNode = require("./../../TextNode.js");
let ContainerNode = require("./../../../container/ContainerNode.js");
let Style = require("./../../../../Style.js");
let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe("insertStrAt", function() {
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
        unicode_text_node.insertStrAt(0, "xyz");
        expect(unicode_text_node.text).toEqual("xyz💩நிIñtërnâtiônàlizætiøn");
        expect(changeCallback).toBeCalled();
    });

    it('at end', function() {
        unicode_text_node.insertStrAt(unicode_text_node.size, "xyz");
        expect(unicode_text_node.text).toEqual("💩நிIñtërnâtiônàlizætiønxyz");
        expect(changeCallback).toBeCalled();
    });

    it('at middle', function() {
        unicode_text_node.insertStrAt(5, "xyz");
        expect(unicode_text_node.text).toEqual("💩நிIñtxyzërnâtiônàlizætiøn");
        expect(changeCallback).toBeCalled();
    });
});