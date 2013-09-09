var el = el = el || {};
var game = game = game || {};

/**
 * @type yc.Map
 */
game.Map = yc.Map.create();

el.MainLayer = cc.Layer.extend({
	/**
	 * @type el.GridLayer
	 */
	lyGrid : null,

    init : function () {
	    game.Map.setMapSize(cc.size(20,20));
	    game.Map.setTileSize(cc.size(24,24));
		game.Map.setPosition(cc.p(40,440));

	    var bgColor = cc.LayerColor.create(cc.c4b(30,30,35,255), 2000,2000);
	    this.addChild(bgColor);

	    this.lyGrid = el.GridLayer.create(game.Map);
	    this.addChild(this.lyGrid);

	    game.LifeLayer = el.LifeLayer.create();
	    this.addChild(game.LifeLayer);

	    var life = el.LifeSprite.create(el.LifeSprite.Race.Lightia);
	    life.setLiveBehavior(new el.LiveBehavior.HurryMother());
	    life.setMoveBehavior(el.MoveBehavior.getRandomBehavior());
	    life.setAttackBehavior(el.AttackBehavior.getRandomBehavior());
	    game.LifeLayer.addLife2Layer(life, cc.p(5,5));

	    var enemy = el.LifeSprite.create(el.LifeSprite.Race.Mozikra);
	    enemy.setLiveBehavior(new el.LiveBehavior.HurryMother());
	    enemy.setMoveBehavior(el.MoveBehavior.getRandomBehavior());
	    enemy.setAttackBehavior(el.AttackBehavior.getRandomBehavior());
	    game.LifeLayer.addLife2Layer(enemy, cc.p(15,15));

	    game.LifeLayer.changeIndicateColor(el.LifeSprite.ColorFlag.IndicateAttackBehavior);
    }
});

el.MainLayer.create = function() {
	var ly = new el.MainLayer();
	ly.init();
	return ly;
};

//game.MainLayer = el.MainLayer.create();

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
	    game.MainLayer = el.MainLayer.create();
        this.addChild(game.MainLayer);
    }
});
