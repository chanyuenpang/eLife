/**
 * Created with JetBrains WebStorm.
 * User: Yop Chan
 * Date: 13-9-8
 * Time: 上午2:12
 * To change this template use File | Settings | File Templates.
 */

var el = el = el || {};

el.LiveBehavior = el.LiveBehavior = el.LiveBehavior || {};

/**
 * Basic behavior decided normal growth and death.
 * Life will accelerate death if get crowed.
 * @type {el.LiveBehavior.Basic}
 */
el.LiveBehavior.Basic = yc.GameFlow.extend({
	_age : 1,
	_maxAge : 9,
	_unitHP : 0,

	ctor : function() {
		this._unitHP = 150 / this._maxAge;
	},

	_action : function(life) {
		this.behave(life);
		this.reset();
	},

	newDay : function(life) {
		this.begin();
		this.input(life);
	},

	clone : function () {
		return new el.LiveBehavior.Basic();
	},

	/**
	 * @param {el.LifeSprite} life
	 */
	behave : function(life) {
		var crow = game.LifeLayer.getLivesFromGrid(life.getGrid(),1).length;
		if (this._age %4 == 0 && crow < 3) life.produceChild();
		this.grow(life);
	},

	grow : function(life) {
		this._age++;
		if (game.LifeLayer.getLivesFromGrid(life.getGrid(),1).length == 5) this._age++;
		if (this._age > this._maxAge) {
			life.die();
			return;
		}
		life.setHP(100 - Math.abs(this._age - this._maxAge/2) * this._unitHP);
	},

	getColor : function(){
		return cc.c3b(192, 192, 30);
	}
});

/**
 * Long liver can remain a long life but will only produce once in its life time
 * @type {el.LiveBehavior.LongLiver}
 */
el.LiveBehavior.LongLiver = el.LiveBehavior.Basic.extend({
	_maxAge : 12,
	_isProduced : false,

	clone : function() {
		return new el.LiveBehavior.LongLiver();
	},

	behave : function(life) {
		if (this._age >= 10 && !this._isProduced ) {
			life.produceChild();
			this._isProduced = true;
		}
		this.grow(life);
	},

	getColor : function(){
		return cc.c3b(40, 60, 192);
	}
});

/**
 * Hurry mother will produce 2 times in its life time but it will also die in an early age.
 * @type {el.LiveBehavior.HurryMother}
 */
el.LiveBehavior.HurryMother = el.LiveBehavior.Basic.extend({
	_maxAge : 7,

	clone : function() {
		return new el.LiveBehavior.HurryMother();
	},

	behave : function(life) {
		if (this._age % 3 == 0) life.produceChild();
		this.grow(life);
	},

	getColor : function(){
		return cc.c3b(30, 192, 30);
	}
});

/**
 * @returns {el.LiveBehavior.Basic}
 */
el.LiveBehavior.getRandomBehavior = function() {
	var rand = Math.floor((cc.RANDOM_0_1()*1000))%3;
	switch(rand) {
		case 0 :
			return new el.LiveBehavior.LongLiver();
		case 1 :
			return new el.LiveBehavior.HurryMother();
		default :
			return new el.LiveBehavior.Basic();
	}
};