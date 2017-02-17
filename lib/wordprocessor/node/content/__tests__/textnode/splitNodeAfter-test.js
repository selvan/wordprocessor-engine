jest.autoMockOff();

let TextNode = require("./../../TextNode.js");
let ContainerNode = require("./../../../container/ContainerNode.js");
let Style = require("./../../../../Style.js");
let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

describe('splitNodeAfter', function() {

    let simple_text_node;
    let unicode_text_node;
    let changeCallback;

    beforeEach(function() {
        simple_text_node = new TextNode("HelloWorld");
        simple_text_node.addStyle(Style.BOLD);
        unicode_text_node = new TextNode("💩நிIñtërnâtiônàlizætiøn");

        changeCallback = jest.genMockFunction();
        simple_text_node.addChangeListener(changeCallback);
        unicode_text_node.addChangeListener(changeCallback);
    });

    it('simple', function() {
        let new_txt_node = simple_text_node.splitNodeAfter(5);
        expect(changeCallback).toBeCalled();
        expect(changeCallback.mock.calls.length).toBe(2);
        changeCallback.mockClear();

        simple_text_node.addStyle(Style.ITALIC);
        expect(changeCallback).toBeCalled();

        expect(simple_text_node.hasStyle(Style.ITALIC)).toBeTruthy();
        expect(simple_text_node.hasStyle(Style.BOLD)).toBeTruthy();

        expect(new_txt_node.text).toEqual('World');
        expect(new_txt_node.hasStyle(Style.BOLD)).toBeTruthy();
        expect(new_txt_node.hasStyle(Style.ITALIC)).toBeFalsy();
    });

    it('unicode', function() {
        let new_txt_node = unicode_text_node.splitNodeAfter(2);
        expect(unicode_text_node.text).toEqual("💩நி");
        expect(new_txt_node.text).toEqual('Iñtërnâtiônàlizætiøn');
        expect(changeCallback).toBeCalled();
    });

    it('after all chars', function() {
        let new_txt_node = unicode_text_node.splitNodeAfter(unicode_text_node.size);
        expect(unicode_text_node.text).toEqual("💩நிIñtërnâtiônàlizætiøn");
        expect(new_txt_node.id).not.toEqual(unicode_text_node.id);
        expect(new_txt_node.text).toEqual("");
        expect(changeCallback).toBeCalled();
    });

    it('before all chars', function() {
        let new_txt_node = unicode_text_node.splitNodeAfter(0);
        expect(new_txt_node.text).toEqual("💩நிIñtërnâtiônàlizætiøn");
        expect(new_txt_node.id).not.toEqual(unicode_text_node.id);
        expect(unicode_text_node.text).toEqual("");
        expect(changeCallback).toBeCalled();
    });
});