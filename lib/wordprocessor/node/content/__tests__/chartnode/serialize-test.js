jest.autoMockOff();

let ChartNode = require("./../../ChartNode.js");

describe('ChartNode', function() {

    it('serialize', function() {
        let chartNode = new ChartNode(ChartNode.TYPE.LINE);
        chartNode.sheetRange = "A1:C5";

        let collector = {};
        let serialized_node = chartNode.serialize(collector);

        expect(serialized_node.meta.styles.length).toEqual(0);
        expect(serialized_node.meta.nodeType).toEqual(chartNode.constructor.name);
        expect(Object.keys(collector).length).toEqual(1);

        let chart_node = collector.charts[serialized_node.meta.refLink];
        expect(chart_node.data.width).toEqual(chartNode.width);
        expect(chart_node.data.height).toEqual(chartNode.height);
        expect(chart_node.data.type).toEqual(chartNode.type);
        expect(chart_node.data.sheetRange).toEqual(chartNode.sheetRange);

    });

    it("should have refLink", function() {
        let chartNode = new ChartNode(ChartNode.TYPE.LINE);
        expect(chartNode.refLink).toBeDefined();
    });
});