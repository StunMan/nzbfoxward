var EXPORTED_SYMBOLS = ["nzbgetBridge"];

var nzbgetBridge = {};

nzbgetBridge.getNzbGetUrl = function() {
  return "http://"+this.prefs.getCharPref("username")+":"+this.prefs.getCharPref("password")+"@"+this.prefs.getCharPref("host")+":"+this.prefs.getIntPref("port")+"/";
}

nzbgetBridge._init = function () {
  this.prefs = Components.classes["@mozilla.org/preferences-service;1"].
                        getService(Components.interfaces.nsIPrefService);
  this.prefs = this.prefs.getBranch("extensions.sabnzbfox.");
  this._readPref();
  
  this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
  this.prefs.addObserver("", this, false);
}

nzbgetBridge.observe = function(aSubject, aTopic, aData) {
  if(aTopic != "nsPref:changed") return;
  this._readPref();
}

function setInterval(action, delay) {
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
  var win = wm.getMostRecentWindow("navigator:browser");
  return win.setInterval(action, delay);
  /* fails on 3.6 nightlies ... only fires two time :(
  return Components.classes['@mozilla.org/timer;1']
      .createInstance(Components.interfaces.nsITimer)
      .initWithCallback({ notify: action }, delay, Components.interfaces.nsITimer.TYPE_REPEATING_PRECISE);
  */
}
 
function clearInterval(timer) {
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
  var win = wm.getMostRecentWindow("navigator:browser");
  return win.clearInterval(timer);
  //timer.cancel();
}

nzbgetBridge._readPref = function () {
  if (nzbgetBridge.isEnabled()) {
 /*   if (!this._updateInterval) {
      this._updateInterval = setInterval(function () {
        nzbgetBridge._updateStatus();
      }, 5000);
    }
  } else if (this._updateInterval) {
    clearInterval(this._updateInterval);
    this._updateInterval = null;*/
  }
}

nzbgetBridge.isEnabled = function () {
  return this.prefs.getBoolPref("enabled") && this.prefs.getCharPref("action") == "nzbget";
}

nzbgetBridge._updateStatus = function () {
  
}

nzbgetBridge.sendToNzbGet = function (fileName, data) {
  var text = Components.classes["@mozilla.org/appshell/appShellService;1"].getService(Components.interfaces.nsIAppShellService).hiddenDOMWindow.btoa(data);

  var requestraw = { "method": "append", "params": [fileName, "", 0, false, text], "id": 1 }
  var nativeJSON = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
  var request = JSON.stringify(requestraw);
  
  var xmlhttp = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
  xmlhttp.QueryInterface(Components.interfaces.nsIXMLHttpRequest);
    
  var url = "http://"+this.prefs.getCharPref("host")+":"+this.prefs.getIntPref("port")+"/"+this.prefs.getCharPref("username")+ ":"+ this.prefs.getCharPref("password")+"/jsonrpc";
  xmlhttp.open('POST', url, true);
  xmlhttp.setRequestHeader("Content-Type","application/json");
  xmlhttp.setRequestHeader("Content-length", request.length);
  xmlhttp.setRequestHeader("Connection", "close");
  xmlhttp.send(request);
}

nzbgetBridge._init();