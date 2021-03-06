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
	 * Race defines two lives is friend or enemy
	 * @type {Number}
 	 */
	_race : -1,
	setRace : function(race){
		this._race = race;
	},
	getRace : function() { return this._race; },
	isEnemy : function(life) { return life.getRace() != this._race; },

	/**
	 * @type el.LiveBehavior.Basic
	 */
	_liveBehavior : null,
	setLiveBehavior : function(behavior) {
		this._liveBehavior = behavior;
	},
	copyLiveBehavior : function() {
		return this._liveBehavior.clone();
	},

	/**
	 * @type el.MoveBehavior.Basic
	 */
	_moveBehavior : null,
	setMoveBehavior : function(behavior) {
		this._moveBehavior = behavior;
	},
	copyMoveBehavior : function() {
		return this._moveBehavior.clone();
	},

	/**
	 * @type el.AttackBehavior.Basic
	 */
	_attackBehavior : null,
	setAttackBehavior : function(behavior) {
		if (!behavior) cc.log('error');
		this._attackBehavior = behavior;
	},
	copyAttackBehavior : function(behavior) {
		return this._attackBehavior.clone();
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

	_aimScale : 1.0,
	/**
	 * Could not set a sprite's scale directly as it's always animating by scale.
	 * Set the aim scale and this sprite will change it's scale when it's done animating.
	 * @param {Number} s
	 */
	setAimScale : function(s) {
		this._aimScale = s;
	},
	scale2AimScale : function() {
		this.setScale(this._aimScale);
	},

	wakeUp : function() {
		var scaleBack = cc.ScaleBy.create(0.15, 0.8);
		var scaleTo = cc.ScaleBy.create(0.15, 1.25);
		var delay = cc.DelayTime.create(0.25);
		var setScale = cc.CallFunc.create(this.scale2AimScale, this);
		var repeat = cc.RepeatForever.create(cc.Sequence.create(scaleBack, scaleTo, setScale, delay));
		this.runAction(repeat);

		this.schedule(this.behave, 2.0, cc.REPEAT_FOREVER, 1.0);
	},

	/**
	 * Behavior action
	 */
	behave : function() {
		if (!this._isDead) this._liveBehavior.newDay(this);
		if (!this._isDead) this._moveBehavior.move(this);
		if (!this._isDead) this._attackBehavior.attack(this);
	},

	/* Functions for Live Behavior */

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

		var child = el.LifeSprite.create(this._race);

		var rand = Math.floor(cc.RANDOM_0_1()*1000)%8;
		if (rand >= 4) child.setLiveBehavior(this.copyLiveBehavior());
		else if (neighbor[rand]) child.setLiveBehavior(neighbor[rand].copyLiveBehavior());
		else child.setLiveBehavior(el.LiveBehavior.getRandomBehavior());

		rand = Math.floor(cc.RANDOM_0_1()*1000)%8;
		if (rand >= 4) child.setMoveBehavior(this.copyMoveBehavior());
		else if (neighbor[rand]) child.setMoveBehavior(neighbor[rand].copyMoveBehavior());
		else child.setMoveBehavior(el.MoveBehavior.getRandomBehavior());

		rand = Math.floor(cc.RANDOM_0_1()*1000)%8;
		if (rand >= 4) child.setAttackBehavior(this.copyAttackBehavior());
		else if (neighbor[rand]) child.setAttackBehavior(neighbor[rand].copyAttackBehavior());
		else child.setAttackBehavior(el.AttackBehavior.getRandomBehavior());

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

	/* Functions for Attack Behavior */

	/**
	 * @param {el.LifeSprite} enemy
	 * @param {el.AttackBehavior.Basic} attackBehavior
	 */
	getAttacked : function(enemy, attackBehavior) {
		this._attackBehavior.getAttacked(this, enemy, attackBehavior);
	},

	/* */

	/**
	 * @param {el.LifeSprite.ColorFlag}} flag
	 */
	updateColor : function(flag) {
		if (this._race == el.LifeSprite.Race.Lightia) {
			switch (flag) {
				case el.LifeSprite.ColorFlag.IndicateLiveBehavior:
					this.setColor(this._liveBehavior.getColor());
					break;
				case el.LifeSprite.ColorFlag.IndicateMoveBehavior:
					this.setColor(this._moveBehavior.getColor());
					break;
				case el.LifeSprite.ColorFlag.IndicateAttackBehavior:
					this.setColor(this._attackBehavior.getColor());
					break;
				case el.LifeSprite.ColorFlag.Default:
					this.setColor(el.LifeSprite.Race.getColor(this._race));
					break;
			}
		} else {
			switch (flag) {
				case el.LifeSprite.ColorFlag.Default:
					this.setColor(el.LifeSprite.Race.getColor(this._race));
					break;
				default :
					this.setColor(el.Colors3B.White);
					break;
			}
		}
	},

	end : function() {}
});

el.LifeSprite.ColorFlag = {
	Default : -1,
	IndicateLiveBehavior : 0,
	IndicateMoveBehavior : 1,
	IndicateAttackBehavior : 2
};

el.LifeSprite.Race = {
	Lightia : 0,
	Yudi : 1,
	Segxa : 2,
	Mozikra : 3,

	/**
	 * @param {Number} race
	 * @returns {cc.Color3B}
	 */
	getColor : function(race) {
		switch (race) {
			case el.LifeSprite.Race.Lightia:
				return el.Colors3B.White;
			case el.LifeSprite.Race.Yudi:
				return el.Colors3B.Red;
			case el.LifeSprite.Race.Segxa:
				return el.Colors3B.Yellow;
			case el.LifeSprite.Race.Mozikra:
				return el.Colors3B.Green;
		}
	}
};

/**
 * @param {Number} race
 * @returns {el.LifeSprite}
 */
el.LifeSprite.create = function(race) {
	var life = new el.LifeSprite();
	life.init(cc.c4b(255,255,255,255), game.Map.tileSize.width, game.Map.tileSize.height);
	life.setOpacity(30);
	life.setRace(race);
	return life;
};