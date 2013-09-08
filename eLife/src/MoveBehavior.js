/**
 * Created with JetBrains WebStorm.
 * User: Yop Chan
 * Date: 13-9-8
 * Time: 下午1:59
 * To change this template use File | Settings | File Templates.
 */

var el = el = el || {};

el.MoveBehavior = el.MoveBehavior = el.MoveBehavior || {};

el.MoveBehavior.Basic = yc.GameFlow.extend({

	_action : function(life) {
		this.behave(life);
		this.reset();
	},

	move : function(life) {
		this.begin();
		this.input(life);
	},

	clone : function () {
		return new el.MoveBehavior.Basic();
	},

	/**
	 * @param {el.LifeSprite} life
	 */
	behave : function(life) {
		var grid = game.Map.grid2Direction(life.getGrid(), yc.MapDirection.getRandomDirection(true, true));
		if (game.LifeLayer.moveLife2Grid(life, grid)) life.setGrid(grid, true);
	},

	/**
	 * @param {cc.Point} p
	 * @return {cc.Point} social center point
	 */
	getSocialCenter : function(p) {
		var lyLife = game.LifeLayer;
		var lives = lyLife.getLivesFromGrid(p, 3);
		if (lives.length == 1) return p;
		var center = cc.p(0,0);
		for (var i in lives) {
			center = cc.pAdd(lives[i].getGrid(), center);
		}
		center = cc.pSub(center, p);
		center.x = Math.round(center.x / (lives.length-1));
		center.y = Math.round(center.y / (lives.length-1));
		return center;
	},

	getColor : function() {
		return cc.c3b(255,255,255);
	}
});

el.MoveBehavior.LoneRanger = el.MoveBehavior.Basic.extend({

	clone : function() {
		return new el.MoveBehavior.LoneRanger();
	},

	behave : function(life) {
		var sc = this.getSocialCenter(life.getGrid());
		if(!life.moveTo(sc, true)) this._super(life);
	},

	getColor : function() {
		return cc.c3b(192,30,30);
	}
});

el.MoveBehavior.Social = el.MoveBehavior.Basic.extend({

	clone : function() {
		return new el.MoveBehavior.Social();
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
 * @returns {el.MoveBehavior.Basic}
 */
el.MoveBehavior.getRandomBehavior = function() {
	var rand = Math.floor((cc.RANDOM_0_1()*1000))%2;
	switch(rand) {
		case 0 :
			return new el.MoveBehavior.LoneRanger();
		case 1 :
			return new el.MoveBehavior.Social();
		default :
			return new el.MoveBehavior.Basic();
	}
};