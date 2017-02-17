jest.autoMockOff();

let TextNode = require("./../../TextNode.js");
let ContainerNode = require("./../../../container/ContainerNode.js");
let Style = require("./../../../../Style.js");
let Markup = require("./../../../../Markup.js");
let _byRef = Markup.findNodeByTestRef;

let _ = require('lodash');

describe('splitNodeBetween', function() {

    let parent_node;
    let simple_text_node;
    let unicode_text_node;

    let changeCallback;

    beforeEach(function() {
        parent_node = new ContainerNode();
        simple_text_node = new TextNode("HelloWorld");
        simple_text_node.addStyle(Style.BOLD);
        unicode_text_node = new TextNode("💩நிIñtërnâtiônàlizætiøn");

        parent_node.push(simple_text_node);
        parent_node.push(unicode_text_node);

        changeCallback = jest.genMockFunction();
        simple_text_node.addChangeListener(changeCallback);
        unicode_text_node.addChangeListener(changeCallback);
    });

    it('simple', function() {
        let new_txt_node = simple_text_node.splitNodeBetween(3, 5);
        expect(changeCallback).toBeCalled();

        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === TextNode.EVENTS.SPLIT_NODE_BETWEEN}).length).toBe(1);

        changeCallback.mockClear();

        simple_text_node.addStyle(Style.ITALIC);
        expect(changeCallback).toBeCalled();
        expect(changeCallback.mock.calls.length).toBe(1);

        expect(new_txt_node.text).toEqual('lo');
        expect(simple_text_node.text).toEqual('Hel');
        expect(new_txt_node.next.text).toEqual('World');

        expect(simple_text_node.hasStyle(Style.ITALIC)).toBeTruthy();
        expect(simple_text_node.hasStyle(Style.BOLD)).toBeTruthy();

        expect(new_txt_node.hasStyle(Style.BOLD)).toBeTruthy();
        expect(new_txt_node.hasStyle(Style.ITALIC)).toBeFalsy();
    });

    it('unicode', function() {
        let new_txt_node = unicode_text_node.splitNodeBetween(5, 8);
        expect(new_txt_node.text).toEqual("ërn");
        expect(new_txt_node.prev.text).toEqual("💩நிIñt");
        expect(new_txt_node.next.text).toEqual("âtiônàlizætiøn");
        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === TextNode.EVENTS.SPLIT_NODE_BETWEEN}).length).toBe(1);
        expect(changeCallback).toBeCalled();
    });


    it('span across all chars', function() {
        let new_txt_node = simple_text_node.splitNodeBetween(0, simple_text_node.size);
        expect(new_txt_node.id).toEqual(simple_text_node.id);
        expect(_.filter(changeCallback.mock.calls, (c) => {return c[0].type === TextNode.EVENTS.SPLIT_NODE_BETWEEN}).length).toBe(1);
    });
});
