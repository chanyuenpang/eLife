/**
 * Created with JetBrains WebStorm.
 * User: Yop Chan
 * Date: 13-9-7
 * Time: 下午5:29
 * To change this template use File | Settings | File Templates.
 */
var el = el = el || {};
var game = game = game || {};

el.LifeSprite = cc.LayerColor.extend({

	/**
	 * @type el.LiveBehavior.Basic
	 */
	_liveBehavior : null,
	setLiveBehavior : function(behavior) {
		this._liveBehavior = behavior;
	},
	copyLiveBehavior : function() {
		if (this._liveBehavior) return this._liveBehavior.clone();
		return null;
	},

	/**
	 * @type el.MoveBehavior.Basic
	 */
	_moveBehavior : null,
	setMoveBehavior : function(behavior) {
		this._moveBehavior = behavior;
	},
	copyMoveBehavior : function() {
		if (this._moveBehavior) return this._moveBehavior.clone();
		return null;
	},

	/**
	 * @type cc.Point
	 */
	_grid : null,
	/**
	 * @param {cc.Point} p
	 * @param {bool} animate
	 */
	setGrid : function(p, animate) {
		this._grid = p;
		if (animate) {
			var move = cc.MoveTo.create(0.25, game.Map.grid2Position(p));
			this.runAction(move);
		} else {
			this.setPosition(game.Map.grid2Position(p));
		}
	},
	getGrid : function() { return this._grid; },

	_isDead : false,

	wakeUp : function() {
		var scaleBack = cc.ScaleTo.create(0.15, 0.85);
		var scaleTo = cc.ScaleTo.create(0.15, 1);
		var delay = cc.DelayTime.create(0.25);
		var repeat = cc.RepeatForever.create(cc.Sequence.create(scaleBack, scaleTo, delay));
		this.runAction(repeat);

		this.schedule(this.behave, 2.0, cc.REPEAT_FOREVER, 1.0);
	},

	behave : function() {
		if (!this._isDead && this._liveBehavior) this._liveBehavior.newDay(this);
		if (!this._isDead && this._moveBehavior) this._moveBehavior.move(this);
	},

	/* Functions for Live Behavior */

	/**
	 * @param {Number} 0-100 hp
	 */
	setHP : function(hp) {
		this.setOpacity(hp*2.5);
	},

	produceChild : function() {
		var neighbor = new Array();
		var dir = yc.MapDirection.getRandomDirection(true, true);
		var life;
		var emptyDir = yc.MapDirection.Origin;
		for (var i = 0; i < 4; i++) {
			life = game.LifeLayer.getLifeFromGrid(game.Map.grid2Direction(this._grid,dir));
			if (life) neighbor.push(life);
			else emptyDir = dir;
			dir = yc.MapDirection.getDirectionClockwise(dir, true);
		}
		var len = neighbor.length;
		if (len == 4) return;  // no empty room for new child

		var child = el.LifeSprite.create();

		var rand = Math.floor(cc.RANDOM_0_1()*1000)%8;
		if (rand >= 4) child.setLiveBehavior(this.copyLiveBehavior());
		else if (neighbor[rand]) child.setLiveBehavior(neighbor[rand].copyLiveBehavior());
		else child.setLiveBehavior(el.LiveBehavior.getRandomBehavior());

		rand = Math.floor(cc.RANDOM_0_1()*1000)%8;
		if (rand >= 4) child.setMoveBehavior(this.copyMoveBehavior());
		else if (neighbor[rand]) child.setMoveBehavior(neighbor[rand].copyMoveBehavior());
		else child.setMoveBehavior(el.MoveBehavior.getRandomBehavior());

		game.LifeLayer.addLife2Layer(child, game.Map.grid2Direction(this._grid, emptyDir));
	},

	die : function() {
		this._isDead = true;
		game.LifeLayer.removeLifeFromGrid(this._grid);
		this.removeFromParent(true);
	},

	/* Functions for Move Behavior */

	/**
	 * @param {cc.Point} p destination
	 * @param {bool} isAgainst
	 * @return {bool} Is Success
	 */
	moveTo : function(p, isAgainst) {
		var flag = isAgainst ? -1 : 1;
		var g = this._grid;
		var off = cc.p(p.x - g.x, p.y - g.y);
		var grid, dir;
		if (off.x != 0) {
			dir = cc.p(flag * (off.x > 0 ? 1 : -1), 0);
			grid = game.Map.lawGrid(cc.pAdd(g, dir));
			if (game.LifeLayer.moveLife2Grid(this, grid)) {
				this.setGrid(grid, true);
				return true;
			}
		}

		if (off.y != 0) {
			dir = cc.p(0, flag * (off.y > 0 ? 1 : -1));
			grid = game.Map.lawGrid(cc.pAdd(g, dir));
			if (game.LifeLayer.moveLife2Grid(this, grid)) {
				this.setGrid(grid, true);
				return true;
			}
		}

		return false;
	},

	/* */

	/**
	 * @param {el.LifeSprite.ColorFlag}} flag
	 */
	updateColor : function(flag) {
		switch (flag) {
			case el.LifeSprite.ColorFlag.IndicateLiveBehavior:
				this.setColor(this._liveBehavior.getColor());
				break;
			case el.LifeSprite.ColorFlag.IndicateMoveBehavior:
				this.setColor(this._moveBehavior.getColor());
				break;
			case el.LifeSprite.ColorFlag.Default:
				this.setColor(cc.c3b(255,255,255));
				break;
		}
	},

	end : function() {}
});

el.LifeSprite.ColorFlag = {
	Default : -1,
	IndicateLiveBehavior : 0,
	IndicateMoveBehavior : 1
};

el.LifeSprite.create = function() {
	var life = new el.LifeSprite();
	life.init(cc.c4b(255,255,255,255), game.Map.tileSize.width, game.Map.tileSize.height);
	life.setOpacity(30);
	return life;
};