var VERSION = "1.2.1";

var isReady = false;
var callbacks = [];

var alignments = {
  center: 0,
  left:   1,
  right:  2
};

var langs = {
  en_FUZZ:  0,
  ca:    1,
  de:    2,
  en_GB: 3,
  en_US: 4,
  es:    5,
  fr:    6,
  no:    7,
  sv:    8
};

function readyCallback(event) {
  isReady = true;
  var callback;
  while (callbacks.length > 0) {
    callback = callbacks.shift();
    callback(event);
  }
}

function showConfiguration(event) {
  onReady(function() {
    var opts = getOptions();
    var url  = "http://keithzg.ca/configure-fuzzier-text.html";
    Pebble.openURL(url + "#v=" + encodeURIComponent(VERSION) + "&options=" + encodeURIComponent(opts));
  });
}

function webviewclosed(event) {
  var resp = event.response;
  console.log('configuration response: '+ resp + ' ('+ typeof resp +')');

  var options = JSON.parse(resp);
  if (typeof options.invert === 'undefined' &&
      typeof options.text_align === 'undefined' &&
      typeof options.lang === 'undefined') {
    return;
  }

  onReady(function() {
    setOptions(resp);

    var message = prepareConfiguration(resp);
    transmitConfiguration(message);
  });
}

// Retrieves stored configuration from localStorage.
function getOptions() {
  return localStorage.getItem("options") || ("{}");
}

// Stores options in localStorage.
function setOptions(options) {
  localStorage.setItem("options", options);
}

// Takes a string containing serialized JSON as input.  This is the
// format that is sent back from the configuration web UI.  Produces
// a JSON message to send to the watch face.
function prepareConfiguration(serialized_settings) {
  var settings = JSON.parse(serialized_settings);
  return {
    "0": settings.invert ? 1 : 0,
    "1": alignments[settings.text_align],
    "2": langs[settings.lang]
  };
}

// Takes a JSON message as input.  Sends the message to the watch.
function transmitConfiguration(settings) {
  console.log('sending message: '+ JSON.stringify(settings));
  Pebble.sendAppMessage(settings, function(event) {
    // Message delivered successfully
  }, logError);
}

function logError(event) {
  console.log('Unable to deliver message with transactionId='+
              event.data.transactionId +' ; Error is'+ event.error.message);
}

function onReady(callback) {
  if (isReady) {
    callback();
  }
  else {
    callbacks.push(callback);
  }
}

Pebble.addEventListener("ready", readyCallback);
Pebble.addEventListener("showConfiguration", showConfiguration);
Pebble.addEventListener("webviewclosed", webviewclosed);

onReady(function(event) {
  var message = prepareConfiguration(getOptions());
  transmitConfiguration(message);
});
