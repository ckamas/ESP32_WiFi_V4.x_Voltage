function OpenEVSEError(f,b){this.type=f;this.message=void 0===b?"":b}function OpenEVSERequest(){var f=this;f._done=function(){};f._error=function(){};f._always=function(){};f.done=function(b){f._done=b;return f};f.error=function(b){f._error=b;return f};f.always=function(b){f._always=b;return f}}
function OpenEVSE(f){var b=this;b._version="0.1";b._endpoint=f;b.states={0:"unknown",1:"not connected",2:"connected",3:"charging",4:"vent required",5:"diode check failed",6:"gfci fault",7:"no ground",8:"stuck relay",9:"gfci self-test failure",10:"over temperature",254:"sleeping",255:"disabled"};b._lcd_colors="off red green yellow blue violet teal white".split(" ");b._status_functions={disable:"FD",enable:"FE",sleep:"FS"};b._lcd_types=["monochrome","rgb"];b._service_levels=["A","1","2"];b.STANDARD_SERIAL_TIMEOUT=
.5;b.RESET_SERIAL_TIMEOUT=10;b.STATUS_SERIAL_TIMEOUT=0;b.SYNC_SERIAL_TIMEOUT=.5;b.NEWLINE_MAX_AGE=5;b.CORRECT_RESPONSE_PREFIXES=("$OK","$NK");b.regex=/\$([^\^]*)(\^..)?/;b._request=function(d,a){a=void 0===a?function(){}:a;var c="$"+(Array.isArray(d)?d.join("+"):d),e=new OpenEVSERequest;$.get(b._endpoint+"?json=1&rapi="+encodeURI(c),function(c){c=c.ret.match(b.regex);null!==c?(c=c[1].split(" "),"OK"===c[0]?(a(c.slice(1)),e._done(c.slice(1))):e._error(new OpenEVSEError("OperationFailed"))):e._error(new OpenEVSEError("UnexpectedResponse"))},
"json").always(function(){e._always()}).fail(function(){e._error(new OpenEVSEError("RequestFailed"))});return e};b._flags=function(d){var a=b._request("GE",function(b){var c=parseInt(b[1],16);isNaN(c)?a._error(new OpenEVSEError("ParseError",'Failed to parse "'+b[0]+'"')):d({service_level:(c&1)+1,diode_check:0===(c&2),vent_required:0===(c&4),ground_check:0===(c&8),stuck_relay_check:0===(c&16),auto_service_level:0===(c&32),auto_start:0===(c&64),serial_debug:0!==(c&128),lcd_type:0!==(c&256)?"monochrome":
"rgb",gfi_self_test:0===(c&512),temp_check:0===(c&1024)})});return a};b.reset=function(){return b._request("FR")};b.time=function(d,a){a=void 0===a?!1:a;if(!1!==a)return b._request(["S1",a.getFullYear()-2E3,a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds()],function(){b.time(d)});var c=b._request("GT",function(a){if(6<=a.length){var b=parseInt(a[0]),e=parseInt(a[1]),h=parseInt(a[2]),f=parseInt(a[3]),l=parseInt(a[4]),m=parseInt(a[5]);isNaN(b)||isNaN(e)||isNaN(h)||isNaN(f)||isNaN(l)||
isNaN(m)?c._error(new OpenEVSEError("ParseError",'Could not parse time "'+a.join(" ")+'" arguments')):165==b&&165==e&&165==h&&165==f&&165==l&&85==m?(a=new Date(0),d(a,!1)):(a=new Date(2E3+b,e,h,f,l,m),d(a,!0))}else c._error(new OpenEVSEError("ParseError","Only received "+a.length+" arguments"))});return c};b.timer=function(d,a,c){a=void 0===a?!1:a;c=void 0===c?!1:c;if(!1!==a&&!1!==c){var e=/([01]\d|2[0-3]):([0-5]\d)/,g=a.match(e),e=c.match(e);return null!==g&&null!==e?b._request(["ST",parseInt(g[1]),
parseInt(g[2]),parseInt(e[1]),parseInt(e[2])],function(){b.timer(d)}):!1}var f=b._request("GD",function(b){if(4<=b.length){var e=parseInt(b[0]),g=parseInt(b[1]),h=parseInt(b[2]),k=parseInt(b[3]);isNaN(e)||isNaN(g)||isNaN(h)||isNaN(k)?f._error(new OpenEVSEError("ParseError",'Could not parse time "'+b.join(" ")+'" arguments')):0===e&&0===g&&0===h&&0===k?d(!1,"--:--","--:--"):(a=(10>e?"0":"")+e+":"+((10>g?"0":"")+g),c=(10>h?"0":"")+h+":"+((10>k?"0":"")+k),d(!0,a,c))}else f._error(new OpenEVSEError("ParseError",
"Only received "+b.length+" arguments"))});return f};b.cancelTimer=function(d){return b._request(["ST",0,0,0,0],function(){d()})};b.time_limit=function(d,a){a=void 0===a?!1:a;if(!1!==a)return b._request(["S3",Math.round(a/15)],function(){b.time_limit(d)});var c=b._request("G3",function(a){if(1<=a.length){var b=parseInt(a[0]);isNaN(b)?c._error(new OpenEVSEError("ParseError",'Could not parse "'+a.join(" ")+'" arguments')):d(15*b)}else c._error(new OpenEVSEError("ParseError","Only received "+a.length+
" arguments"))});return c};b.charge_limit=function(d,a){a=void 0===a?!1:a;if(!1!==a)return b._request(["SH",a],function(){b.charge_limit(d)});var c=b._request("GH",function(a){if(1<=a.length){var b=parseInt(a[0]);isNaN(b)?c._error(new OpenEVSEError("ParseError",'Could not parse "'+a.join(" ")+'" arguments')):d(b)}else c._error(new OpenEVSEError("ParseError","Only received "+a.length+" arguments"))});return c};b.ammeter_settings=function(d,a,c){a=void 0===a?!1:a;c=void 0===c?!1:c;if(!1!==a&&!1!==c)return b._request(["SA",
a,c],function(){d(a,c)});var e=b._request("GA",function(a){if(2<=a.length){var b=parseInt(a[0]),c=parseInt(a[0]);isNaN(b)||isNaN(c)?e._error(new OpenEVSEError("ParseError",'Could not parse "'+a.join(" ")+'" arguments')):d(b,c)}else e._error(new OpenEVSEError("ParseError","Only received "+a.length+" arguments"))});return e};b.current_capacity=function(d,a){a=void 0===a?!1:a;if(!1!==a)return b._request(["SC",a],function(){b.current_capacity(d)});var c=b._request("GE",function(a){if(1<=a.length){var b=
parseInt(a[0]);isNaN(b)?c._error(new OpenEVSEError("ParseError",'Could not parse "'+a.join(" ")+'" arguments')):d(b)}else c._error(new OpenEVSEError("ParseError","Only received "+a.length+" arguments"))});return c};b.service_level=function(d,a){a=void 0===a?!1:a;return!1!==a?b._request(["SL",b._service_levels[a]],function(){b.service_level(d)}):b._flags(function(a){d(a.auto_service_level?0:a.service_level,a.service_level)})};b.current_capacity_range=function(d){var a=b._request("GC",function(b){if(2<=
b.length){var c=parseInt(b[0]),f=parseInt(b[1]);isNaN(c)||isNaN(f)?a._error(new OpenEVSEError("ParseError",'Could not parse "'+b.join(" ")+'" arguments')):d(c,f)}else a._error(new OpenEVSEError("ParseError","Only received "+b.length+" arguments"))});return a};b.status=function(d,a){a=void 0===a?!1:a;if(!1!==a)return b._request([b._status_functions[a]],function(){b.status(d)});var c=b._request("GS",function(a){if(1<=a.length){var b=parseInt(a[0]);isNaN(b)?c._error(new OpenEVSEError("ParseError",'Could not parse "'+
a.join(" ")+'" arguments')):d(b)}else c._error(new OpenEVSEError("ParseError","Only received "+a.length+" arguments"))});return c};b.diode_check=function(d,a){a=void 0===a?null:a;return null!==a?b._request(["FF","D",a?"1":"0"],function(){b.diode_check(d)}):b._flags(function(a){d(a.diode_check)})};b.gfi_self_test=function(d,a){a=void 0===a?null:a;return null!==a?b._request(["FF F",a?"1":"0"],function(){b.gfi_self_test(d)}):b._flags(function(a){d(a.gfi_self_test)})};b.ground_check=function(d,a){a=void 0===
a?null:a;return null!==a?b._request(["FF G",a?"1":"0"],function(){b.ground_check(d)}):b._flags(function(a){d(a.ground_check)})};b.stuck_relay_check=function(d,a){a=void 0===a?null:a;return null!==a?b._request(["FF R",a?"1":"0"],function(){b.stuck_relay_check(d)}):b._flags(function(a){d(a.stuck_relay_check)})};b.vent_required=function(d,a){a=void 0===a?null:a;return null!==a?b._request(["FF V",a?"1":"0"],function(){b.vent_required(d)}):b._flags(function(a){d(a.vent_required)})};b.temp_check=function(d,
a){a=void 0===a?null:a;return null!==a?b._request(["FF T",a?"1":"0"],function(){b.temp_check(d)}):b._flags(function(a){d(a.temp_check)})};b.over_temperature_thresholds=function(d,a,c){a=void 0===a?!1:a;c=void 0===c?!1:c;if(!1!==a&&!1!==c)return b._request(["SO",a,c],function(){b.over_temperature_thresholds(d)});var e=b._request("GO",function(a){if(2<=a.length){var b=parseInt(a[0]),c=parseInt(a[0]);isNaN(b)||isNaN(c)?e._error(new OpenEVSEError("ParseError",'Could not parse "'+a.join(" ")+'" arguments')):
d(b,c)}else e._error(new OpenEVSEError("ParseError","Only received "+a.length+" arguments"))});return e};b.setEndpoint=function(d){b._endpoint=d}};
function RapiViewModel(c){var a=this;a.baseEndpoint=c;a.rapiSend=ko.observable(!1);a.cmd=ko.observable("");a.ret=ko.observable("");a.send=function(){a.rapiSend(!0);$.get(a.baseEndpoint()+"/r?json=1&rapi="+encodeURI(a.cmd()),function(b){a.ret(">"+b.ret);a.cmd(b.cmd)},"json").always(function(){a.rapiSend(!1)})}};
function TimeViewModel(d){function c(a){return(10>a?"0":"")+a}function f(){e=setInterval(function(){a.automaticTime()&&a.nowTimedate(new Date(a.evseTimedate().getTime()+(new Date-a.localTimedate())));d.isCharging()&&a.elapsedNow(new Date(1E3*d.status.elapsed()+(new Date-a.elapsedLocal())))},1E3)}var a=this;a.evseTimedate=ko.observable(new Date);a.localTimedate=ko.observable(new Date);a.nowTimedate=ko.observable(null);a.hasRTC=ko.observable(!0);a.elapsedNow=ko.observable(new Date(0));a.elapsedLocal=
ko.observable(new Date);a.date=ko.pureComputed({read:function(){return null===a.nowTimedate()?"":a.nowTimedate().toISOString().split("T")[0]},write:function(b){a.evseTimedate(new Date(b));a.localTimedate(new Date)}});a.time=ko.pureComputed({read:function(){if(null===a.nowTimedate())return"--:--:--";var b=a.nowTimedate();return c(b.getHours())+":"+c(b.getMinutes())+":"+c(b.getSeconds())},write:function(b){b=b.split(":");var c=a.evseTimedate();c.setHours(parseInt(b[0]));c.setMinutes(parseInt(b[1]));
a.evseTimedate(c);a.localTimedate(new Date)}});a.elapsed=ko.pureComputed(function(){if(null===a.nowTimedate())return"0:00:00";var b=a.elapsedNow();return c(b.getUTCHours())+":"+c(b.getMinutes())+":"+c(b.getSeconds())});d.status.elapsed.subscribe(function(b){a.elapsedNow(new Date(1E3*b));a.elapsedLocal(new Date)});var e=null;a.automaticTime=ko.observable(!0);a.setTime=function(){var b=a.automaticTime()?new Date:a.evseTimedate();d.openevse.time(a.timeUpdate,b)};a.timeUpdate=function(b,c){a.hasRTC(void 0===
c?!0:c);null!==e&&(clearInterval(e),e=null);a.evseTimedate(b);a.nowTimedate(b);a.localTimedate(new Date);f()}};
function OpenEvseViewModel(k,l){var a=this,g=ko.pureComputed(function(){return k()+"/r"});a.openevse=new OpenEVSE(g());g.subscribe(function(b){a.openevse.setEndpoint(b)});a.status=l;a.time=new TimeViewModel(a);a.serviceLevels=[{name:"Auto",value:0},{name:"1",value:1},{name:"2",value:2}];a.currentLevels=ko.observableArray([]);a.timeLimits=[{name:"none",value:0},{name:"15 min",value:15},{name:"30 min",value:30},{name:"45 min",value:45},{name:"1 hour",value:60},{name:"1.5 hours",value:90},{name:"2 hours",
value:120},{name:"2.5 hours",value:150},{name:"3 hours",value:180},{name:"4 hours",value:240},{name:"5 hours",value:300},{name:"6 hours",value:360},{name:"7 hours",value:420},{name:"8 hours",value:480}];a.chargeLimits=[{name:"none",value:0},{name:"1 kWh",value:1},{name:"2 kWh",value:2},{name:"3 kWh",value:3},{name:"4 kWh",value:4},{name:"5 kWh",value:5},{name:"6 kWh",value:6},{name:"7 kWh",value:7},{name:"8 kWh",value:8},{name:"9 kWh",value:9},{name:"10 kWh",value:10},{name:"15 kWh",value:11},{name:"20 kWh",
value:12},{name:"25 kWh",value:25},{name:"30 kWh",value:30},{name:"35 kWh",value:35},{name:"40 kWh",value:40},{name:"45 kWh",value:45},{name:"50 kWh",value:50},{name:"55 kWh",value:55},{name:"60 kWh",value:60},{name:"70 kWh",value:70},{name:"80 kWh",value:80},{name:"90 kWh",value:90}];a.serviceLevel=ko.observable(-1);a.actualServiceLevel=ko.observable(-1);a.minCurrentLevel=ko.observable(-1);a.maxCurrentLevel=ko.observable(-1);a.currentCapacity=ko.observable(-1);a.timeLimit=ko.observable(-1);a.chargeLimit=
ko.observable(-1);a.delayTimerEnabled=ko.observable(!1);a.delayTimerStart=ko.observable("--:--");a.delayTimerStop=ko.observable("--:--");a.gfiSelfTestEnabled=ko.observable(!1);a.groundCheckEnabled=ko.observable(!1);a.stuckRelayEnabled=ko.observable(!1);a.tempCheckEnabled=ko.observable(!1);a.diodeCheckEnabled=ko.observable(!1);a.ventRequiredEnabled=ko.observable(!1);a.allTestsEnabled=ko.pureComputed(function(){return a.gfiSelfTestEnabled()&&a.groundCheckEnabled()&&a.stuckRelayEnabled()&&a.tempCheckEnabled()&&
a.diodeCheckEnabled()&&a.ventRequiredEnabled()});a.tempCheckSupported=ko.observable(!1);a.isConnected=ko.pureComputed(function(){return-1!==[2,3].indexOf(a.status.state())});a.isReady=ko.pureComputed(function(){return-1!==[0,1].indexOf(a.status.state())});a.isCharging=ko.pureComputed(function(){return 3===a.status.state()});a.isError=ko.pureComputed(function(){return-1!==[4,5,6,7,8,9,10].indexOf(a.status.state())});a.isEnabled=ko.pureComputed(function(){return-1!==[0,1,2,3].indexOf(a.status.state())});
a.isSleeping=ko.pureComputed(function(){return 254===a.status.state()});a.isDisabled=ko.pureComputed(function(){return 255===a.status.state()});a.selectTimeLimit=function(b){if(a.timeLimit()!==b)for(var c=0;c<a.timeLimits.length;c++){var d=a.timeLimits[c];if(d.value>=b){a.timeLimit(d.value);break}}};a.selectChargeLimit=function(b){if(a.chargeLimit()!==b)for(var c=0;c<a.chargeLimits.length;c++){var d=a.chargeLimits[c];if(d.value>=b){a.chargeLimit(d.value);break}}};var f=[function(){return a.openevse.time(a.time.timeUpdate)},
function(){return a.openevse.service_level(function(b,c){a.serviceLevel(b);a.actualServiceLevel(c)})},function(){return a.updateCurrentCapacity()},function(){return a.openevse.current_capacity(function(b){a.currentCapacity(b)})},function(){return a.openevse.time_limit(function(b){a.selectTimeLimit(b)})},function(){return a.openevse.charge_limit(function(b){a.selectChargeLimit(b)})},function(){return a.openevse.gfi_self_test(function(b){a.gfiSelfTestEnabled(b)})},function(){return a.openevse.ground_check(function(b){a.groundCheckEnabled(b)})},
function(){return a.openevse.stuck_relay_check(function(b){a.stuckRelayEnabled(b)})},function(){return a.openevse.temp_check(function(b){a.tempCheckEnabled(b)})},function(){return a.openevse.diode_check(function(b){a.diodeCheckEnabled(b)})},function(){return a.openevse.vent_required(function(b){a.ventRequiredEnabled(b)})},function(){return a.openevse.temp_check(function(){a.tempCheckSupported(!0)},a.tempCheckEnabled()).error(function(){a.tempCheckSupported(!1)})},function(){return a.openevse.timer(function(b,
c,d){a.delayTimerEnabled(b);a.delayTimerStart(c);a.delayTimerStop(d)})}];a.updateCount=ko.observable(0);a.updateTotal=ko.observable(f.length);a.updateCurrentCapacity=function(){return a.openevse.current_capacity_range(function(b,c){a.minCurrentLevel(b);a.maxCurrentLevel(c);var d=a.currentCapacity();a.currentLevels.removeAll();for(var e=a.minCurrentLevel();e<=a.maxCurrentLevel();e++)a.currentLevels.push({name:e+" A",value:e});a.currentCapacity(d)})};a.updatingServiceLevel=ko.observable(!1);a.savedServiceLevel=
ko.observable(!1);a.updatingCurrentCapacity=ko.observable(!1);a.savedCurrentCapacity=ko.observable(!1);a.updatingTimeLimit=ko.observable(!1);a.savedTimeLimit=ko.observable(!1);a.updatingChargeLimit=ko.observable(!1);a.savedChargeLimit=ko.observable(!1);a.updatingDelayTimer=ko.observable(!1);a.savedDelayTimer=ko.observable(!1);a.updatingStatus=ko.observable(!1);a.savedStatus=ko.observable(!1);a.updatingGfiSelfTestEnabled=ko.observable(!1);a.savedGfiSelfTestEnabled=ko.observable(!1);a.updatingGroundCheckEnabled=
ko.observable(!1);a.savedGroundCheckEnabled=ko.observable(!1);a.updatingStuckRelayEnabled=ko.observable(!1);a.savedStuckRelayEnabled=ko.observable(!1);a.updatingTempCheckEnabled=ko.observable(!1);a.savedTempCheckEnabled=ko.observable(!1);a.updatingDiodeCheckEnabled=ko.observable(!1);a.savedDiodeCheckEnabled=ko.observable(!1);a.updatingVentRequiredEnabled=ko.observable(!1);a.savedVentRequiredEnabled=ko.observable(!1);a.setForTime=function(a,c){a(!0);setTimeout(function(){a(!1)},c)};var h=!1;a.subscribe=
function(){h||(a.serviceLevel.subscribe(function(b){a.updatingServiceLevel(!0);a.openevse.service_level(function(b,d){a.setForTime(a.savedServiceLevel,2E3);a.actualServiceLevel(d);a.updateCurrentCapacity().always(function(){})},b).always(function(){a.updatingServiceLevel(!1)})}),a.currentCapacity.subscribe(function(b){!0!==a.updatingServiceLevel()&&(a.updatingCurrentCapacity(!0),a.openevse.current_capacity(function(c){a.setForTime(a.savedCurrentCapacity,2E3);b!==c&&a.currentCapacity(c)},b).always(function(){a.updatingCurrentCapacity(!1)}))}),
a.timeLimit.subscribe(function(b){a.updatingTimeLimit(!0);a.openevse.time_limit(function(c){a.setForTime(a.savedTimeLimit,2E3);b!==c&&a.selectTimeLimit(c)},b).always(function(){a.updatingTimeLimit(!1)})}),a.chargeLimit.subscribe(function(b){a.updatingChargeLimit(!0);a.openevse.charge_limit(function(c){a.setForTime(a.savedChargeLimit,2E3);b!==c&&a.selectChargeLimit(c)},b).always(function(){a.updatingChargeLimit(!1)})}),a.gfiSelfTestEnabled.subscribe(function(b){a.updatingGfiSelfTestEnabled(!0);a.openevse.gfi_self_test(function(c){a.setForTime(a.savedGfiSelfTestEnabled,
2E3);b!==c&&a.gfiSelfTestEnabled(c)},b).always(function(){a.updatingGfiSelfTestEnabled(!1)})}),a.groundCheckEnabled.subscribe(function(b){a.updatingGroundCheckEnabled(!0);a.openevse.ground_check(function(c){a.setForTime(a.savedGroundCheckEnabled,2E3);b!==c&&a.groundCheckEnabled(c)},b).always(function(){a.updatingGroundCheckEnabled(!1)})}),a.stuckRelayEnabled.subscribe(function(b){a.updatingStuckRelayEnabled(!0);a.savedStuckRelayEnabled(!1);a.openevse.stuck_relay_check(function(c){a.savedStuckRelayEnabled(!0);
setTimeout(function(){a.savedStuckRelayEnabled(!1)},2E3);b!==c&&a.stuckRelayEnabled(c)},b).always(function(){a.updatingStuckRelayEnabled(!1)})}),a.tempCheckEnabled.subscribe(function(b){a.updatingTempCheckEnabled(!0);a.openevse.temp_check(function(c){a.setForTime(a.savedTempCheckEnabled,2E3);b!==c&&a.tempCheckEnabled(c)},b).always(function(){a.updatingTempCheckEnabled(!1)})}),a.diodeCheckEnabled.subscribe(function(b){a.updatingDiodeCheckEnabled(!0);a.openevse.diode_check(function(c){a.setForTime(a.savedDiodeCheckEnabled,
2E3);b!==c&&a.diodeCheckEnabled(c)},b).always(function(){a.updatingDiodeCheckEnabled(!1)})}),a.ventRequiredEnabled.subscribe(function(b){a.updatingVentRequiredEnabled(!0);a.openevse.vent_required(function(c){a.setForTime(a.savedVentRequiredEnabled,2E3);b!==c&&a.ventRequiredEnabled(c)},b).always(function(){a.updatingVentRequiredEnabled(!1)})}),h=!0)};a.update=function(b){b=void 0===b?function(){}:b;a.updateCount(0);a.nextUpdate(b)};a.nextUpdate=function(b){(0,f[a.updateCount()])().always(function(){a.updateCount(a.updateCount()+
1);a.updateCount()<f.length?a.nextUpdate(b):(a.subscribe(),b())})};a.delayTimerValid=ko.pureComputed(function(){return/([01]\d|2[0-3]):([0-5]\d)/.test(a.delayTimerStart())&&/([01]\d|2[0-3]):([0-5]\d)/.test(a.delayTimerStop())});a.startDelayTimer=function(){a.updatingDelayTimer(!0);a.openevse.timer(function(){a.delayTimerEnabled(!0)},a.delayTimerStart(),a.delayTimerStop()).always(function(){a.updatingDelayTimer(!1)})};a.stopDelayTimer=function(){a.updatingDelayTimer(!0);a.openevse.cancelTimer(function(){a.delayTimerEnabled(!1)}).always(function(){a.updatingDelayTimer(!1)})};
a.setStatus=function(b){a.updatingStatus(!0);a.openevse.status(function(b){a.status.state(b)},b).always(function(){a.updatingStatus(!1)})};a.restartFetching=ko.observable(!1);a.restart=function(){confirm("Restart OpenEVSE? Current config will be saved, takes approximately 10s.")&&(a.restartFetching(!0),a.openevse.reset().always(function(){a.restartFetching(!1)}))}};
var $jscomp={scope:{},checkStringArgs:function(c,e,d){if(null==c)throw new TypeError("The 'this' value for String.prototype."+d+" must not be null or undefined");if(e instanceof RegExp)throw new TypeError("First argument to String.prototype."+d+" must not be a regular expression");return c+""}};
$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(c,e,d){if(d.get||d.set)throw new TypeError("ES3 does not support getters and setters.");c!=Array.prototype&&c!=Object.prototype&&(c[e]=d.value)};$jscomp.getGlobal=function(c){return"undefined"!=typeof window&&window===c?c:"undefined"!=typeof global&&null!=global?global:c};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.polyfill=function(c,e,d,a){if(e){d=$jscomp.global;c=c.split(".");for(a=0;a<c.length-1;a++){var g=c[a];g in d||(d[g]={});d=d[g]}c=c[c.length-1];a=d[c];e=e(a);e!=a&&null!=e&&$jscomp.defineProperty(d,c,{configurable:!0,writable:!0,value:e})}};
$jscomp.polyfill("String.prototype.endsWith",function(c){return c?c:function(c,d){var a=$jscomp.checkStringArgs(this,c,"endsWith");c+="";void 0===d&&(d=a.length);for(var e=Math.max(0,Math.min(d|0,a.length)),f=c.length;0<f&&0<e;)if(a[--e]!=c[--f])return!1;return 0>=f}},"es6-impl","es3");
function OpenEvseWiFiViewModel(c,e,d){var a=this;a.baseHost=ko.observable(""!==c?c:"openevse.local");a.basePort=ko.observable(e);a.baseProtocol=ko.observable(d);a.baseEndpoint=ko.pureComputed(function(){var b="//"+a.baseHost();80!==a.basePort()&&(b+=":"+a.basePort());return b});a.wsEndpoint=ko.pureComputed(function(){var b="ws://"+a.baseHost();"https:"===a.baseProtocol()&&(b="wss://"+a.baseHost());80!==a.basePort()&&(b+=":"+a.basePort());return b+"/ws"});a.config=new ConfigViewModel(a.baseEndpoint);
a.status=new StatusViewModel(a.baseEndpoint);a.rapi=new RapiViewModel(a.baseEndpoint);a.scan=new WiFiScanViewModel(a.baseEndpoint);a.wifi=new WiFiConfigViewModel(a.baseEndpoint,a.config,a.status,a.scan);a.openevse=new OpenEvseViewModel(a.baseEndpoint,a.status);a.initialised=ko.observable(!1);a.updating=ko.observable(!1);a.scanUpdating=ko.observable(!1);a.bssid=ko.observable("");a.bssid.subscribe(function(b){for(var c=0;c<a.scan.results().length;c++){var d=a.scan.results()[c];if(b===d.bssid()){a.config.ssid(d.ssid());
break}}});a.showMqttInfo=ko.observable(!1);a.showSolarDivert=ko.observable(!1);a.showSafety=ko.observable(!1);a.toggle=function(a){a(!a())};a.advancedMode=ko.observable(!1);a.advancedMode.subscribe(function(b){a.setCookie("advancedMode",b.toString())});a.developerMode=ko.observable(!1);a.developerMode.subscribe(function(b){a.setCookie("developerMode",b.toString());b&&a.advancedMode(!0)});var g=null,f=null;c="status";""!==window.location.hash&&(c=window.location.hash.substr(1));a.tab=ko.observable(c);
a.tab.subscribe(function(a){window.location.hash="#"+a});a.isSystem=ko.pureComputed(function(){return"system"===a.tab()});a.isServices=ko.pureComputed(function(){return"services"===a.tab()});a.isStatus=ko.pureComputed(function(){return"status"===a.tab()});a.isRapi=ko.pureComputed(function(){return"rapi"===a.tab()});a.upgradeUrl=ko.observable("about:blank");a.loadedCount=ko.observable(0);a.itemsLoaded=ko.pureComputed(function(){return a.loadedCount()+a.openevse.updateCount()});a.itemsTotal=ko.observable(2+
a.openevse.updateTotal());a.start=function(){a.updating(!0);a.status.update(function(){a.loadedCount(a.loadedCount()+1);a.config.update(function(){a.loadedCount(a.loadedCount()+1);a.baseHost().endsWith(".local")&&""!==a.status.ipaddress()&&(""===a.config.www_username()?a.baseHost(a.status.ipaddress()):window.location.replace("http://"+a.status.ipaddress()+":"+a.basePort()));a.openevse.update(function(){a.initialised(!0);g=setTimeout(a.update,5E3);a.upgradeUrl(a.baseEndpoint()+"/update");for(var b=
document.getElementsByTagName("img"),c=0;c<b.length;c++)b[c].getAttribute("data-src")&&b[c].setAttribute("src",b[c].getAttribute("data-src"));a.updating(!1)})});a.connect()});a.advancedMode("true"===a.getCookie("advancedMode","false"));a.developerMode("true"===a.getCookie("developerMode","false"))};a.update=function(){a.updating()||(a.updating(!0),null!==g&&(clearTimeout(g),g=null),a.status.update(function(){g=setTimeout(a.update,5E3);a.updating(!1)}))};var h=!1;a.startScan=function(){a.scanUpdating()||
(h=!0,a.scanUpdating(!0),null!==f&&(clearTimeout(f),f=null),a.scan.update(function(){h&&(f=setTimeout(a.startScan,3E3));a.scanUpdating(!1)}))};a.stopScan=function(){h=!1;a.scanUpdating()||null===f||(clearTimeout(f),f=null)};a.wifiConnecting=ko.observable(!1);a.status.mode.subscribe(function(b){"STA+AP"!==b&&"STA"!==b||a.wifiConnecting(!1);"STA+AP"===b||"AP"===b?a.startScan():a.stopScan()});a.saveNetworkFetching=ko.observable(!1);a.saveNetworkSuccess=ko.observable(!1);a.saveNetwork=function(){""===
a.config.ssid()?alert("Please select network"):(a.saveNetworkFetching(!0),a.saveNetworkSuccess(!1),$.post(a.baseEndpoint()+"/savenetwork",{ssid:a.config.ssid(),pass:a.config.pass()},function(){a.saveNetworkSuccess(!0);a.wifiConnecting(!0)}).fail(function(){alert("Failed to save WiFi config")}).always(function(){a.saveNetworkFetching(!1)}))};a.saveAdminFetching=ko.observable(!1);a.saveAdminSuccess=ko.observable(!1);a.saveAdmin=function(){a.saveAdminFetching(!0);a.saveAdminSuccess(!1);$.post(a.baseEndpoint()+
"/saveadmin",{user:a.config.www_username(),pass:a.config.www_password()},function(){a.saveAdminSuccess(!0)}).fail(function(){alert("Failed to save Admin config")}).always(function(){a.saveAdminFetching(!1)})};a.saveEmonCmsFetching=ko.observable(!1);a.saveEmonCmsSuccess=ko.observable(!1);a.saveEmonCms=function(){var b={enable:a.config.emoncms_enabled(),server:a.config.emoncms_server(),apikey:a.config.emoncms_apikey(),node:a.config.emoncms_node(),fingerprint:a.config.emoncms_fingerprint()};!b.enable||
""!==b.server&&""!==b.node?b.enable&&32!==b.apikey.length&&"___DUMMY_PASSWORD___"!==b.apikey?alert("Please enter valid Emoncms apikey"):b.enable&&""!==b.fingerprint&&59!==b.fingerprint.length?alert("Please enter valid SSL SHA-1 fingerprint"):(a.saveEmonCmsFetching(!0),a.saveEmonCmsSuccess(!1),$.post(a.baseEndpoint()+"/saveemoncms",b,function(){a.saveEmonCmsSuccess(!0)}).fail(function(){alert("Failed to save Admin config")}).always(function(){a.saveEmonCmsFetching(!1)})):alert("Please enter Emoncms server and node")};
a.saveMqttFetching=ko.observable(!1);a.saveMqttSuccess=ko.observable(!1);a.saveMqtt=function(){var b={enable:a.config.mqtt_enabled(),server:a.config.mqtt_server(),topic:a.config.mqtt_topic(),user:a.config.mqtt_user(),pass:a.config.mqtt_pass(),solar:a.config.mqtt_solar(),grid_ie:a.config.mqtt_grid_ie()};b.enable&&""===b.server?alert("Please enter MQTT server"):(a.saveMqttFetching(!0),a.saveMqttSuccess(!1),$.post(a.baseEndpoint()+"/savemqtt",b,function(){a.saveMqttSuccess(!0)}).fail(function(){alert("Failed to save MQTT config")}).always(function(){a.saveMqttFetching(!1)}))};
a.saveOhmKeyFetching=ko.observable(!1);a.saveOhmKeySuccess=ko.observable(!1);a.saveOhmKey=function(){a.saveOhmKeyFetching(!0);a.saveOhmKeySuccess(!1);$.post(a.baseEndpoint()+"/saveohmkey",{enable:a.config.ohm_enabled(),ohm:a.config.ohmkey()},function(){a.saveOhmKeySuccess(!0)}).fail(function(){alert("Failed to save Ohm key config")}).always(function(){a.saveOhmKeyFetching(!1)})};a.turnOffAccessPointFetching=ko.observable(!1);a.turnOffAccessPointSuccess=ko.observable(!1);a.turnOffAccessPoint=function(){a.turnOffAccessPointFetching(!0);
a.turnOffAccessPointSuccess(!1);$.post(a.baseEndpoint()+"/apoff",{},function(b){console.log(b);""!==a.status.ipaddress()?setTimeout(function(){window.location="http://"+a.status.ipaddress();a.turnOffAccessPointSuccess(!0)},3E3):a.turnOffAccessPointSuccess(!0)}).fail(function(){alert("Failed to turn off Access Point")}).always(function(){a.turnOffAccessPointFetching(!1)})};a.changeDivertModeFetching=ko.observable(!1);a.changeDivertModeSuccess=ko.observable(!1);a.changeDivertMode=function(b){a.status.divertmode()!==
b&&(a.status.divertmode(b),a.changeDivertModeFetching(!0),a.changeDivertModeSuccess(!1),$.post(a.baseEndpoint()+"/divertmode",{divertmode:b},function(){a.changeDivertModeSuccess(!0)}).fail(function(){alert("Failed to set divert mode")}).always(function(){a.changeDivertModeFetching(!1)}))};a.isEcoModeAvailable=ko.pureComputed(function(){return a.config.mqtt_enabled()&&(""!==a.config.mqtt_solar()||""!==a.config.mqtt_grid_ie())});a.ecoMode=ko.pureComputed({read:function(){return 2===a.status.divertmode()},
write:function(b){a.changeDivertMode(b?2:1)}});a.factoryResetFetching=ko.observable(!1);a.factoryResetSuccess=ko.observable(!1);a.factoryReset=function(){confirm("CAUTION: Do you really want to Factory Reset? All setting and config will be lost.")&&(a.factoryResetFetching(!0),a.factoryResetSuccess(!1),$.post(a.baseEndpoint()+"/reset",{},function(){a.factoryResetSuccess(!0)}).fail(function(){alert("Failed to Factory Reset")}).always(function(){a.factoryResetFetching(!1)}))};a.restartFetching=ko.observable(!1);
a.restartSuccess=ko.observable(!1);a.restart=function(){confirm("Restart OpenEVSE WiFi? Current config will be saved, takes approximately 10s.")&&(a.restartFetching(!0),a.restartSuccess(!1),$.post(a.baseEndpoint()+"/restart",{},function(){a.restartSuccess(!0)}).fail(function(){alert("Failed to restart")}).always(function(){a.restartFetching(!1)}))};a.pingInterval=!1;a.reconnectInterval=!1;a.socket=!1;a.connect=function(){a.socket=new WebSocket(a.wsEndpoint());a.socket.onopen=function(b){console.log(b);
a.pingInterval=setInterval(function(){a.socket.send('{"ping":1}')},1E3)};a.socket.onclose=function(b){console.log(b);a.reconnect()};a.socket.onmessage=function(b){console.log(b);ko.mapping.fromJSON(b.data,a.status)};a.socket.onerror=function(b){console.log(b);a.socket.close();a.reconnect()}};a.reconnect=function(){!1!==a.pingInterval&&(clearInterval(a.pingInterval),a.pingInterval=!1);!1===a.reconnectInterval&&(a.reconnectInterval=setTimeout(function(){a.reconnectInterval=!1;a.connect()},500))};a.setCookie=
function(a,c,d){d=void 0===d?!1:d;var b="";!1!==d&&(b=new Date,b.setTime(b.getTime()+864E5*d),b=";expires="+b.toUTCString());document.cookie=a+"="+c+b+";path=/"};a.getCookie=function(a,c){c=void 0===c?"":c;for(var b=a+"=",d=document.cookie.split(";"),e=0;e<d.length;e++){for(var f=d[e];" "===f.charAt(0);)f=f.substring(1);if(0===f.indexOf(b))return f.substring(b.length,f.length)}return c}};
(function(){var a=window.location.hostname,b=window.location.port,c=window.location.protocol;$(function(){var d=new OpenEvseWiFiViewModel(a,b,c);ko.applyBindings(d);d.start()})})();function scaleString(a,b,c){return(parseInt(a)/b).toFixed(c)};
