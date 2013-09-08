/**
 * Created with JetBrains WebStorm.
 * User: Yop Chan
 * Date: 13-9-7
 * Time: 下午3:24
 * To change this template use File | Settings | File Templates.
 */

var yc = yc = yc ||{};

yc.MapDirection = {
	Origin : 0,
	TopLeft : 1,
	Top : 2,
	TopRight : 3,
	Right : 4,
	BottomRight : 5,
	Bottom : 6,
	BottomLeft : 7,
	Left : 8,

	direction2Point : function( dir ) {
		switch(dir) {
			case this.TopLeft :
				return cc.p(-1,-1);
			case this.Top :
				return cc.p(0,-1);
			case this.TopRight :
				return cc.p(1,-1);
			case this.Right :
				return cc.p(1,0);
			case this.BottomRight :
				return cc.p(1,1);
			case this.Bottom :
				return cc.p(0,1);
			case this.BottomLeft :
				return cc.p(-1,1);
			case this.Left :
				return cc.p(-1,0);
			default :
				return cc.p(0,0);
		}
	},

	/**
	 * @param {yc.MapDirection} dir
	 * @param {bool}} only4Direction
	 * @returns {yc.MapDirection}
	 */
	getDirectionClockwise : function( dir , only4Direction) {
		dir += 1 + (only4Direction ? 1 : 0);
		if (dir > this.Left) dir = this.Top;
		return dir;
	},

	/**
	 * @param {yc.MapDirection} dir
	 * @param {bool}} only4Direction
	 * @returns {yc.MapDirection}
	 */
	getDirectionCounterClockwise : function( dir , only4Direction) {
		dir -= 1 + (only4Direction ? 1 : 0);
		if (dir < this.TopLeft + only4Direction ? 1 : 0 ) dir = this.Left;
		return dir;
	},

	/**
	 * @param {bool} escapeOrigin
	 * @param {bool}} only4Direction
	 * @returns {yc.MapDirection}
	 */
	getRandomDirection : function( escapeOrigin , only4Direction) {
		var max = (only4Direction ? this.Left/2.0 : this.Left) + (escapeOrigin ? 0 : 1);
		var ret = Math.floor(cc.RANDOM_0_1()*1000) % max + (escapeOrigin ? 1 : 0);
		return only4Direction ? ret*2 : ret;
	}
};

yc.Map = cc.Class.extend({

	ctor : function() {
	},

	/**
	 * @type cc.Point
	 */
	baseLocation : {x:20, y:20},

	/**
	 * @type cc.Size
	 */
	tileSize : {width:100, height:100},

	/**
	 * @type cc.Size
	 */
	mapSize : {width:10, height: 10},

	/**
	 * @param {cc.Size} size
	 */
	setMapSize : function(size) {
		this.mapSize = size;
	},

	/**
	 * @param {cc.Size} size
	 */
	setTileSize : function(size) {
		this.tileSize = size;
	},

	/**
	 * @param {cc.Point} p
	 */
	setPosition : function(p) {
		this.baseLocation = p;
	},
	getPosition : function() { return this.baseLocation; },

	/**
	 * @param {cc.Point} p
	 */
	location2Grid : function(p){
		var gridX = Math.floor((p.x - this.baseLocation.x)/this.tileSize.width);
		var gridY = this.mapSize.height - Math.floor((p.y - this.baseLocation.y)/this.tileSize.height) - 1;
		if(gridX < 0 || gridY < 0 || gridX >= this.mapSize.width || gridY >= this.mapSize.height) return null;
		return cc.p(gridX,gridY);
	},

	/**
	 * @param {cc.Point} p
	 * @param {yc.MapDirection} dir
	 */
	grid2Direction : function(p, dir) {
		return this.lawGrid(cc.pAdd(p, yc.MapDirection.direction2Point(dir)));
	},

	/**
	 * @param {cc.Point} p
	 */
	grid2Index : function(p){
		if(!this.lawGrid(p)) return -1;
		return p.x + p.y*this.mapSize.width;
	},

	/**
	 * @param {Number} idx
	 */
	index2Grid : function(idx){
		return cc.p(idx%this.mapSize.width, Math.floor(idx/this.mapSize.width));
	},

	/**
	 * @param {cc.Point} p
	 */
	grid2Position : function(p){
		return cc.p(this.baseLocation.x + (p.x + 0.5)*this.tileSize.width, this.baseLocation.y + (this.mapSize.height - p.y - 0.5)*this.tileSize.height);
	},

	/**
	 * @param {cc.Point} p
	 */
	grid2PositionInMap : function(p){
		return cc.p((p.x + 0.5)*this.tileSize.width, (this.mapSize.height - p.y - 0.5)*this.tileSize.height);
	},

	/**
	 * @param {cc.Point} p
	 */
	forceLawGrid : function(p){
		var x = Math.max(0,Math.min(this.mapSize.width-1, p.x));
		var y = Math.max(0,Math.min(this.mapSize.height-1, p.y));
		return cc.p(x,y);
	},

	/**
	 * @param {cc.Point} p
	 */
	lawGrid : function(p) {
		if (!p) return false;
		if (p.x < 0 || p.y < 0 || p.x >= this.mapSize.width || p.y >= this.mapSize.height) return false;
		return p;
	}
});

yc.Map.create = function() {
	return new yc.Map();
};