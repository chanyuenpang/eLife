/**
 * Created with JetBrains WebStorm.
 * User: Yop Chan
 * Date: 13-9-8
 * Time: 上午1:27
 * To change this template use File | Settings | File Templates.
 */

var el = el = el || {};
var game = game = game || {};

el.LifeLayer = cc.Layer.extend({
	/**
	 * @type Array
	 */
	lives : null,

	init : function() {
		this.lives = new Array();
	},

	/**
	 * @param {cc.Point} p
	 * @returns {el.LifeSprite} or null
	 */
	getLifeFromGrid : function(p) {
		var idx = game.Map.grid2Index(p);
		if (idx >= 0) return this.lives[idx];
		return null;
	},

	/**
	 * @param {cc.Point} p
	 * @param {Number} distance
	 * @param {bool} escapeOrigin
	 */
	getLivesFromGrid : function(p, distance) {
		var ret = new Array();
		var remain = 0;
		var life;
		for( var x = -distance; x <= distance; x++)  {
			remain = distance - Math.abs(x);
			for (var y = -remain; y <= remain; y++) {
				life = this.getLifeFromGrid(cc.pAdd(p, cc.p(x,y)));
				if (life) ret.push(life);
			}
		}
		return ret;
	},

	/**
	 * @param {el.LifeSprite} life
	 * @param {cc.Point} p
	 * @return {bool} can life to moved to given grid location
	 */
	moveLife2Grid : function(life, p) {
		var idx = game.Map.grid2Index(p);
		if (idx >= 0 && !this.lives[idx]) {
			this.lives[idx] = life;
			this.removeLifeFromGrid(life.getGrid());
			return true;
		}
		return false;
	},

	/**
	 * set lives to null in given grid location
	 * @param {cc.Point} p
	 */
	removeLifeFromGrid : function(p) {
		var idx = game.Map.grid2Index(p);
		if (idx >= 0) this.lives[idx] = null;
	},

	/**
	 * attach a life to life layer in given grid location
	 * @param {el.LifeSprite} life
	 * @param {cc.Point} p
	 * @return {bool} can life to be added to layer
	 */
	addLife2Layer : function(life, p) {
		var idx = game.Map.grid2Index(p);
		if (idx < 0 || this.lives[idx]) return false;
		this.lives[idx] = life;
		life.updateColor(this._indicateFlag);
		life.setGrid(p);
		this.addChild(life);
		life.wakeUp();
		return true;
	},

	_indicateFlag : -1,
	changeIndicateColor : function(flag) {
		this._indicateFlag = flag;
		for(var i in this.lives) {
			if (this.lives[i]) this.lives[i].updateColor(flag);
		}
	}
});

/**
 * @returns {el.LifeLayer}
 */
el.LifeLayer.create = function() {
	var lyLife = new el.LifeLayer();
	lyLife.init();
	lyLife.setPosition(cc.p(-game.Map.tileSize.width/2, -game.Map.tileSize.height/2));
	return lyLife;
};
