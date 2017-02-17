jest.autoMockOff();

let Node = require("./../../../Node.js");
let ContainerNode = require("./../../ContainerNode.js");

describe('ContainerNode', function() {

    it('should have set head and tail to null', function () {
        let containerNode = new ContainerNode();
        expect(containerNode.head).toEqual(null);
        expect(containerNode.tail).toEqual(null);
    });
});