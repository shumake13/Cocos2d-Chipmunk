var SPRITE_WIDTH=64;
var SPRITE_HEIGHT=64;
var DEBUG_NODE_SHOW=true;
var HelloWorldLayer = cc.Layer.extend({
    space:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.director.getWinSize();
        this.initPhysics();
        this.scheduleUpdate();

        return true;
    },
    initPhysics:function(){
        var winSize=cc.director.getWinSize();

        this.space= new cp.Space();
        this.setupDebugNode();
        //設置重力
        this.space.gravity=cp.v(0,-100);
        var staticBody=this.space.staticBody;

        //設置空間邊界
        var walls=[new cp.SegmentShape(staticBody,cp.v(0,0),cp.v(winSize.width,0),0),
            new cp.SegmentShape(staticBody,cp.v(0,winSize.height),cp.v(winSize.width,winSize.height),0),
            new cp.SegmentShape(staticBody,cp.v(0,0),cp.v(0,winSize.height),0),
            new cp.SegmentShape(staticBody,cp.v(winSize.width,0),cp.v(winSize.width,winSize.height),0)
        ];
        for(var i=0;i<walls.length;i++){
            var shape=walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            this.space.addStaticShape(shape);
        }
    },
    setupDebugNode:function(){
        this._debugNode=new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible=DEBUG_NODE_SHOW;
        this.addChild(this._debugNode);
    },
    onEnter:function(){
        this._super();
        cc.log("onEnter");
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:this.onTouchBegan
        },this);
    },
    update:function(dt) {
        var timeStep=0.03;
        this.space.step(timeStep);
    },
    onTouchBegan:function(touch,event){
        cc.log("onTouchBegan");
        var target=event.getCurrentTarget();
        var location=touch.getLocation();
        target.addNewSpriteAtPosition(location);
    },
    addNewSpriteAtPosition:function(_location){
        cc.log("addNewSpriteAtPosition");

        var body=new cp.Body(1,cp.momentForBox(1,SPRITE_WIDTH,SPRITE_HEIGHT));
        body.setPos(_location);
        this.space.addBody(body);

        var shape=new cp.BoxShape(body,SPRITE_WIDTH,SPRITE_HEIGHT);
        shape.setElasticity(0.5);
        shape.setFriction(0.5);
        this.space.addShape(shape);


        var sprite=new cc.PhysicsSprite(res.BoxA2_png);
        sprite.setBody(body);
        sprite.setPosition(cc.p(_location.x,_location.y));
        this.addChild(sprite);
    },
    onExit:function(){
        this._super();
        cc.log("onExit");
        cc.eventManager.removeEventListener(cc.EventListener.TOUCH_ONE_BY_ONE);
    }
});
var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

