'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _Day=require('../classes/Day');var _Day2=_interopRequireDefault(_Day);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var WeekDay=function(){_createClass(WeekDay,null,[{key:'DAYS',get:function get(){return{SUNDAY:0,MONDAY:1,TUESDAY:2,WEDNESDAY:3,THURSDAY:4,FRIDAY:5,SATURDAY:6};}}]);function WeekDay(index){_classCallCheck(this,WeekDay);if(!arguments.length){throw new Error('Invalid index');};if(typeof index!=='number'){throw new Error('Invalid index');};if(index>6){throw new Error('Invalid index');};return[new _Day2.default(0,'Sunday',{weekend:true,lastInWeek:true}),new _Day2.default(1,'Monday',{workday:true,firstInWeek:true}),new _Day2.default(2,'Tuesday',{workday:true}),new _Day2.default(3,'Wednesday',{workday:true}),new _Day2.default(4,'Thursday',{workday:true}),new _Day2.default(5,'Friday',{workday:true}),new _Day2.default(6,'Saturday',{weekend:true})][index];}return WeekDay;}();exports.default=WeekDay;