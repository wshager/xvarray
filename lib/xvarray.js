"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.array = array;
exports.join = join;
exports._isArray = _isArray;
exports.head = head;
exports.tail = tail;
exports.size = size;
exports.subarray = subarray;
exports.insertBefore = insertBefore;
exports.forEach = forEach;
exports.filter = filter;
exports.foldLeft = foldLeft;
exports.foldRight = foldRight;
exports.remove = remove;
exports.append = append;
exports.reverse = reverse;
exports.flatten = flatten;

var _immutable = require("immutable");

var _xverr = require("xverr");

var _xvseq = require("xvseq");

const ListProto = _immutable.List.prototype;

function array(...a) {
	var l = a.length;
	if (l === 0) {
		return (0, _xvseq.seq)((0, _immutable.List)());
	}
	if (l == 1 && (0, _xvseq._isSeq)(a[0])) {
		return (0, _xvseq.seq)((0, _immutable.List)(a[0].flatten(true).toArray().map(_ => (0, _xvseq.seq)(_))));
	}
	return (0, _xvseq.seq)((0, _immutable.List)(a.map(_ => (0, _xvseq.seq)(_))));
}

function join($a) {
	if ($a === undefined) return (0, _xverr.error)("XPTY0004");
	return (0, _xvseq.seq)($a.reduce(function (pre, cur) {
		var v = (0, _xvseq._first)(cur);
		if (!_isArray(v)) return (0, _xverr.error)("XPTY0004", "One of the items for array:join is not an array.");
		return pre.merge(v);
	}, (0, _immutable.List)()));
}

function _isArray($maybe) {
	let maybe = (0, _xvseq._first)($maybe);
	return !!(maybe && _immutable.List.isList(maybe));
}

function _checked($a, fn, ...args) {
	var a = $a;
	if ((0, _xvseq._isSeq)($a)) {
		if ($a.size > 1) return (0, _xverr.error)("XPTY0004");
		a = $a.first();
	}
	if (!_isArray(a)) return (0, _xverr.error)("XPTY0004");
	return (0, _xvseq.seq)(fn.apply(a, args));
}

function head($a) {
	return _checked($a, ListProto.first);
}

function tail($a) {
	return _checked($a, ListProto.rest);
}

function size($a) {
	return _checked($a, ListProto.count);
}

function subarray($a, $s, $e) {
	var s = (0, _xvseq._first)($s) || 1,
	    e = (0, _xvseq._first)($e);
	return _checked($a, ListProto.slice, s - 1, e);
}

function insertBefore($a, $i, $v) {
	var i = (0, _xvseq._first)($i) || 1;
	return _checked($a, ListProto.insert, i - 1, (0, _xvseq.seq)($v));
}

function forEach(...args) {
	if (args.length == 1) return (0, _xvseq._partialRight)(forEach, args);
	var fn = (0, _xvseq._first)(args[1]);
	var a = (0, _xvseq._first)(args[0]);
	if (!_isArray(a)) return (0, _xverr.error)("XPTY0004");
	return (0, _xvseq.seq)(a.map((0, _xvseq._wrap)(fn)));
}

function filter(...args) {
	if (args.length == 1) return (0, _xvseq._partialRight)(filter, args);
	var fn = (0, _xvseq._first)(args[1]);
	var a = (0, _xvseq._first)(args[0]);
	if (!_isArray(a)) return (0, _xverr.error)("XPTY0004");
	return (0, _xvseq.seq)(a.filter((0, _xvseq._wrap)(fn)));
}

function foldLeft(...args) {
	if (args.length == 1) return (0, _xverr.error)("XPTY0004");
	if (args.length == 2) return (0, _xvseq._partialRight)(foldLeft, args);
	var fn = (0, _xvseq._first)(args[2]);
	var init = (0, _xvseq._first)(args[1]);
	var a = (0, _xvseq._first)(args[0]);
	if (!_isArray(a)) return (0, _xverr.error)("XPTY0004");
	return (0, _xvseq.seq)(a.reduce((0, _xvseq._wrapReduce)(fn), init));
}

function foldRight(...args) {
	if (args.length == 1) return (0, _xverr.error)("XPTY0004");
	if (args.length == 2) return (0, _xvseq._partialRight)(foldLeft, args);
	var fn = (0, _xvseq._first)(args[2]);
	var init = (0, _xvseq._first)(args[1]);
	var a = (0, _xvseq._first)(args[0]);
	if (!_isArray(a)) return (0, _xverr.error)("XPTY0004");
	return (0, _xvseq.seq)(a.reduceRight((0, _xvseq._wrapReduce)(fn), init));
}

function remove(...args) {
	if (args.length == 1) return (0, _xverr.error)("XPTY0004");
	var a = (0, _xvseq._first)(args[0]);
	var index = (0, _xvseq._first)(args[1]) || 0;
	if (!_isArray(a)) return (0, _xverr.error)("XPTY0004");
	if (!index) return (0, _xvseq.seq)(a);
	return (0, _xvseq.seq)(a.delete(index.valueOf() - 1));
}

function append(...args) {
	if (args.length == 1) return (0, _xverr.error)("XPTY0004");
	var a = (0, _xvseq._first)(args[0]);
	var insert = args[1];
	if (!_isArray(a)) return (0, _xverr.error)("XPTY0004");
	//console.log("insert", insert);
	return (0, _xvseq.seq)(insert.isEmpty() ? a : a.push(insert));
}

function reverse(...args) {
	if (args.length === 0) return (0, _xverr.error)("XPTY0004");
	var a = (0, _xvseq._first)(args[0]);
	if (!_isArray(a)) return (0, _xverr.error)("XPTY0004");
	return (0, _xvseq.seq)(a.reverse());
}

function flatten($a) {
	if ($a === undefined) return (0, _xverr.error)("XPTY0004");
	var a = (0, _xvseq._first)($a);
	if (!_isArray(a)) return (0, _xverr.error)("XPTY0004");
	var ret = [];
	var flatDeep = function (val) {
		val.forEach(function (v, k, c) {
			if (v && (v._isSeq || _isArray(v) || v instanceof Array) && !v._isNode) {
				flatDeep(v);
			} else {
				ret.push(v);
			}
		});
	};
	this.forEach(function (v, k) {
		if (v && (v._isSeq || _isArray(v) || v instanceof Array) && !v._isNode) {
			flatDeep(v);
		} else {
			ret.push(v);
		}
	});
	return (0, _xvseq.toSeq)(ret);
}