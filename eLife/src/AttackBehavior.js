/**
 * Created with JetBrains WebStorm.
 * User: Yop Chan
 * Date: 13-9-10
 * Time: 上午12:06
 * To change this template use File | Settings | File Templates.
 */

var el = el = el || {};

el.AttackBehavior = el.AttackBehavior = el.AttackBehavior || {};

el.AttackBehavior.Basic = yc.GameFlow.extend({
	_HP : 100,
	_power : 35,

	getPower : function() { return this._power; },

	_action : function(life) {
		this.behave(life);
		this.reset();
	},

	attack : function(life) {
		this.begin();
		this.input(life);
	},

	clone : function () {
		return new el.AttackBehavior.Basic();
	},

	/**
	 * @param {el.LifeSprite} life
	 */
	behave : function(life) {
		var dir = yc.MapDirection.getRandomDirection(true, true);
		var neighbor;
		var g = life.getGrid();
		for (var i = 0; i < 4; i++) {
			neighbor = game.LifeLayer.getLifeFromGrid(game.Map.grid2Direction(g, dir));
			if (neighbor && life.isEnemy(neighbor)) {
				neighbor.getAttacked(life, this);
			} else {
				dir = yc.MapDirection.getDirectionClockwise(dir, true);
			}
		}
	},

	/**
	 * @param {el.LifeSprite} life
	 * @param {el.LifeSprite} enemy
	 * @param {el.AttackBehavior.Basic} enemyBehavior
	 */
	getAttacked : function(life, enemy, enemyBehavior) {
		this._HP -= enemyBehavior.getPower();
		this.updateHP(life);
	},

	updateHP : function(life) {
		if (this._HP <= 0) life.die();
		life.setAimScale(this._HP / 50.0);
	},

	getColor : function() {
		return el.Colors3B.Yellow;
	}
});

el.AttackBehavior.LoneRanger = el.AttackBehavior.Basic.extend({

	clone : function() {
		return new el.AttackBehavior.LoneRanger();
	},

	behave : function(life) {
		var sc = this.getSocialCenter(life.getGrid());
		if(!life.moveTo(sc, true)) this._super(life);
	},

	getColor : function() {
		return cc.c3b(192,30,30);
	}
});

el.AttackBehavior.Social = el.AttackBehavior.Basic.extend({

	clone : function() {
		return new el.AttackBehavior.Social();
	},

	behave : function(life) {
		var sc = this.getSocialCenter(life.getGrid());
		life.moveTo(sc, false);
	},

	getColor : function() {
		return cc.c3b(30,192,30);
	}

});

/**
 * @returns {el.AttackBehavior.Basic}
 */
el.AttackBehavior.getRandomBehavior = function() {
	var rand = Math.floor((cc.RANDOM_0_1()*1000))%2;
	rand = -1;
	switch(rand) {
		case 0 :
			return new el.AttackBehavior.LoneRanger();
		case 1 :
			return new el.AttackBehavior.Social();
		default :
			return new el.AttackBehavior.Basic();
	}
};