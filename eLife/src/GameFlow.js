/**
 * Created with JetBrains WebStorm.
 * User: Yop Chan
 * Date: 13-1-28
 * Time: 下午4:38
 * To change this template use File | Settings | File Templates.
 */

var yc = yc = yc ||{};

yc.FlowStatus = {
	NotBegin : 0,
	WaitingForInput : 1,
	WaitingForAction : 2,
	Finished : 3
};

/**
 * Game Flow can be used like this:
 * flow = new GameFlow({data: null});
 * flow.begin();
 * flow.input({value:true});
 * and flow will automatically call its action method
 * You can handle flow.action by extending GameFlow class, and also control its every process like _input(), _validate(), _begin()
 */
yc.GameFlow = cc.Class.extend({
	_status : yc.FlowStatus.NotBegin,

	//The setting data passed in constructor and can be used in every flow period
	_setting : null,

	//The input data sample which will be use in input validation
	_inputLock : null,

	ctor : function(setting){
		this._setting = setting;
		//Should not call begin here as the ctor require a immediate return and the begin might delay the return.
		//this.begin();
	},

	reset : function(){
		this._status = yc.FlowStatus.NotBegin;
	},

	begin : function(){
		if(this._status != yc.FlowStatus.NotBegin){
			cc.log('Flow Error : Begin');
			return;
		}
		this._status = yc.FlowStatus.WaitingForInput;
		this._begin();
	},

	_begin : function(){},

	validate : function(data) {
		if(_(this._inputLock).isObject()) {
			if(!_(data).isObject()) return false;
			if(_(this._inputLock).chain().keys().difference(_(data).keys()).value().length > 0) return false;
		}
		return this._validate(data);
	},

	_validate : function(data) { return true },

	input : function(data){
		if(!this.validate(data)){
			cc.log('Flow Error : Validation.');
			return;
		}
		if(this._status != yc.FlowStatus.WaitingForInput) {
			cc.log('Flow Error : Input');
			return;
		}
		this._status = yc.FlowStatus.WaitingForAction;
		this._input(data);
		this.action(data);
	},

	_input : function(data){},

	action : function(data){
		if(this._status != yc.FlowStatus.WaitingForAction) {
			//cc.log('Flow Error : Action');
			return;
		}
		this._status = yc.FlowStatus.Finished;
		this._action(data);
	},

	_action : function(data){},

	//set the status to finish
	forceClose : function(){
		this._status = yc.FlowStatus.Finished;
	},

	//set the status to waiting for input
	rejectInput : function(){
		this._status = yc.FlowStatus.WaitingForInput;
	}
});