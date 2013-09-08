/**
 * Created with JetBrains WebStorm.
 * User: Yop Chan
 * Date: 13-9-7
 * Time: 下午5:58
 * To change this template use File | Settings | File Templates.
 */

var el = el = el || {};

el.GridLayer = cc.Layer.extend({
	/**
	 * @type cc.DrawNode
	 */
	drawNode : null,

	/**
	 * @type yc.Map
	 */
	map : null,

	/**
	 * @param {yc.Map} map
	 */
	init : function(map) {
		this.map = map;
		this.drawNode = cc.DrawNode.create();
		this.addChild(this.drawNode);;
	},

	updateGrid : function() {
		var dir = cc.Director.getInstance();
		var o = this.map.grid2Position(cc.p(0,0));
		var w = this.map.tileSize.width;
		var h = this.map.tileSize.height;
		var width = w*(this.map.mapSize.width-1);
		var height = h*(this.map.mapSize.height-1);
		var begin, end;
//		for (var i = 0; i < this.map.mapSize.width; i++) {
//			for (var j = 0; j < this.map.mapSize.height; j++) {
//				this.drawNode.drawDot(this.map.grid2Position(cc.p(i,j)), 5, cc.c4f(1, 1, 1, 0.2));
//			}
//		}
		for( var i = 0; i <= this.map.mapSize.width; i++) {
			begin = this.map.grid2Position(cc.p(i, 0));
			begin = cc.pAdd(begin, cc.p(-h/2, h/2));
			end = this.map.grid2Position(cc.p(i,this.map.mapSize.height));
			end = cc.pAdd(end, cc.p(-h/2, h/2));
			this.drawNode.drawSegment(begin, end, 1, cc.c4f(0.3,0.35,0.4,0.5));
		}
		for( var i = 0; i <= this.map.mapSize.height; i++) {
			begin = this.map.grid2Position(cc.p(0, i));
			begin = cc.pAdd(begin, cc.p(-h/2, h/2));
			end = this.map.grid2Position(cc.p(this.map.mapSize.width, i));
			end = cc.pAdd(end, cc.p(-h/2, h/2));
			this.drawNode.drawSegment(begin, end, 1, cc.c4f(0.3,0.35,0.4,0.5));
		}
	}
});

/**
 * @type yc.Map
 * @param map
 */
el.GridLayer.create = function(map) {
	var ret = new el.GridLayer();
	ret.init(map);
	ret.updateGrid();
	return ret;
}