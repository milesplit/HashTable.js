/*
Created by MileSplit, Inc. 2011 - http://www.milesplit.com
License: Open Source, With Attribution (leave this comment in place)
More info: http://milesplit.wordpress.com/open-source/hashtable-js/
*/


var _ = _ || {};

_.HashTable = function(o) {
	// Initialize
	var me = this;
	var map = {};
	var items = [];
	var keys = [];
	var sortby = [{ key:null, order:null, style:'string' }];
	var isObject = function(v) {
	  if (typeof(v) == "object") {
	    if (v === null) return false;
	    if (v.constructor == (new Array).constructor) return false
	    if (v.constructor == (new Date).constructor) return false;
	    if (v.constructor == (new RegExp).constructor) return false;
	    return true;
	  }
	  return false;
	};
	for (key in o) {
		map[key] = items.push(o[key]) - 1;
		keys.push(key);
	};
	// Private methods
	var sorter = function(a, b) {
		try {
			if (sortby.length > 0) {
				var val = 0;
				for (var i=0; i < sortby.length; i++) {
					var s = sortby[i];
					if (s.key) {
						if (s.style == 'numeric') {
							if (s.order == 'ASC') val = a[s.key] - b[s.key];
							else val = b[s.key] - a[s.key];
						} else {
							var x = a[s.key].toString().toLowerCase();
							var y = b[s.key].toString().toLowerCase();
							if (s.order == 'DESC') val = (x < y) ? 1 : (x == y) ? 0 : -1;
							else val = (x < y) ? -1 : (x == y) ? 0 : 1;
						}
					} else {
						if (s.style == 'numeric') {
							if (s.order == 'DESC') val = b-a;
							else val = a-b;
						} else {
							var x = a.toString().toLowerCase();
							var y = b.toString().toLowerCase();
							if (s.order == 'DESC') val = (x < y) ? 1 : (x == y) ? 0 : -1;
							else val = (x < y) ? -1 : (x == y) ? 0 : 1;
						}
					}
					if (val != 0) {
						return val;
					}
				}
				return val;
			} else {
				return 0;
			}
		} catch(err) {
			return 0;
		}
	};
	// Public methods
	me.item = function(i) {
		return items[i];
	};
	me.get = function(key, defaultVal) {
		if (arguments.length == 0) {
			if (sortby.length > 0) {
				var temp = [];
				for (var i=0; i < items.length; i++) {
					temp.push(items[i]);
				}
				temp.sort(sorter);
				return temp;
			} else {
				return items;
			}
		} else if (arguments.length == 1) {
			return items[map[key]];
		} else {
			if (!me.exists(key)) {
				map[key] = items.push(defaultVal) - 1;
				keys.push(key);
			}
			return items[map[key]];
		}
	};
	me.push = function(val) {
		var key = 'r' + items.length;
		if (isObject(val)) {
			val.key = key;
		}
		map[key] = items.push(val) - 1;
		keys.push(key);
		return key;
	};
	me.set = function(key, val) {
		if (me.exists(key)) {
			items[map[key]] = val;
		} else {
			map[key] = items.push(val) - 1;
		}
		return me;
	};
	me.indexOf = function(key) {
		if (me.exists(key)) {
			return map[key];
		} else {
			return - 1;
		}
	};
	me.remove = function(key) {
		var i = me.indexOf(key);
		if (i >= 0) {
			me.removeAt(i);
		}
		return me;
	};
	me.removeAt = function(start) {
		// Remove from array
		items.splice(start, 1);
		console.log(items.length);
		keys.splice(start, 1);
		// Now remap it
		var new_map = {};
		for (var i=0; i < keys.length; i++) {
			new_map[keys[i]] = i;
		}
		map = new_map;
		return me;
	};
	me.key = function(index) {
		if (arguments.length == 0) {
			return keys;
		} else {
			return keys[index];
		}
	};
	me.exists = function(key) {
		return typeof(map[key]) != 'undefined';
	};
	me.clear = function() {
		map = {};
		items = [];
		keys = [];
		return me;
	};
	me.length = function() {
		return items.length;
	};
	me.count = me.length;
	me.asc = function() {
		sortby = [];
		for (var i=0; i < arguments.length; i++) {
			var arr = arguments[i].split(' ');
			sortby.push({
				key:arr[0], order:'ASC', style:arr[1]
			});
		}
		return me;
	};
	me.desc = function() {
		sortby = [];
		for (var i=0; i < arguments.length; i++) {
			var arr = arguments[i].split(' ');
			sortby.push({
				key:arr[0], order:'DESC', style:arr[1]
			});
		}
		return me;
	};
	return me;
};
