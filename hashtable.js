/**
 * Created by MileSplit, Inc. 2011 - http://www.milesplit.com
 * License: Open Source, With Attribution (leave this comment in place)
 * More info: http://milesplit.wordpress.com/open-source/hashtable-js/
 */

var _ = _ || {};

_.HashTable = function(data) {
	// Initialize
	var me = this;
	var map = {};
	var items = [];
	var keys = [];
	var offset = 0;
	var sortby = [{ key:null, order:null, style:'string' }];
	// Public properties
	me.count = 0;
	// Private methods
	var isObject = function(v) {
		if (typeof v == "object") {
			if (v.constructor == (new Array).constructor) return false;
			if (v.constructor == (new Date).constructor) return false;
			if (v.constructor == (new RegExp).constructor) return false;
			return true;
		}
		return false;
	};
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
	var addIndex = function(key, val) {
		if (isObject(val)) {
			val.key = key;
		}
		map[key] = items.push(val) - 1;
		keys.push(key);
		me.count++;
	}
	var removeIndex = function(start) {
		// Remove from array
		items.splice(start, 1);
		keys.splice(start, 1);
		// Now remap it
		var new_map = {};
		for (var i=0; i < keys.length; i++) {
			new_map[keys[i]] = i;
		}
		map = new_map;
		// Offset for new data coming in
		offset++;
		return me;
	};
	var indexOf = function(key) {
		if (me.exists(key)) {
			return map[key];
		} else {
			return - 1;
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
		var key = 'r' + (items.length + offset);
		addIndex(key, val);
		return key;
	};
	me.import = function (data) {
		if (Array.isArray(data) || typeof data == 'object') {
			for (var i in data) {
				me.push(data[i]);
			}
		}
		return me;
	};
	me.set = function(key, val) {
		if (me.exists(key)) {
			items[map[key]] = val;
		} else {
			addIndex(key, val);
		}
		return me;
	};
	me.remove = function(key) {
		var i = indexOf(key);
		if (i >= 0) {
			removeIndex(i);
		}
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
	// Accept data on instantiation
	if (typeof data != 'undefined') {
		me.import(data);
	}
	return me;
};