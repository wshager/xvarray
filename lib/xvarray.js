"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.join = undefined;
exports.array = array;
exports._isArray = _isArray;
exports.head = head;
exports.tail = tail;
exports.size = size;
exports.insertBefore = insertBefore;
exports.forEach = forEach;
exports.filter = filter;
exports.foldLeft = foldLeft;
exports.foldRight = foldRight;

var _immutable = require("immutable");

var _xvseq = require("xvseq");

var ListProto = _immutable.List.prototype;

function array() {
	for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
		a[_key] = arguments[_key];
	}

	var l = a.length;
	if (l === 0) {
		return (0, _xvseq.seqOf)((0, _immutable.List)());
	}
	if (l == 1 && (0, _xvseq._isSeq)(a[0])) {
		return (0, _xvseq.seqOf)((0, _immutable.List)(a[0].map(function (_) {
			return (0, _xvseq.seqOf)(_);
		})));
	}
	return (0, _xvseq.seqOf)((0, _immutable.List)(a.map(function (_) {
		return (0, _xvseq.seqOf)(_);
	})));
}

var join = exports.join = array;

function _isArray(maybe) {
	return !!(maybe && _immutable.List.isList(maybe));
}

function _checked($a, fn) {
	var a = $a;
	if ((0, _xvseq._isSeq)($a)) {
		if ($a.size > 1) return error("XPTY0004");
		a = $a.first();
	}
	if (!_isArray(a)) return error("XPTY0004");

	for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
		args[_key2 - 2] = arguments[_key2];
	}

	return (0, _xvseq.seqOf)(fn.apply(a, args));
}

function head($a) {
	return _checked($a, ListProto.slice, 0, 1);
}

function tail($a) {
	return _checked($a, ListProto.slice, 1);
}

function size($a) {
	return _checked($a, ListProto.count);
}

function insertBefore($a, $i, $v) {
	var i = (0, _xvseq._first)($i) || 1;
	return _checked($a, ListProto.insert, i - 1, (0, _xvseq.seqOf)($v));
}

function forEach() {
	for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
		args[_key3] = arguments[_key3];
	}

	if (args.length == 1) return (0, _xvseq._partialRight)(forEach, args);
	var fn = (0, _xvseq._first)(args[1]);
	var a = (0, _xvseq._first)(args[0]);
	if (!_isArray(a)) return error("XPTY0004");
	return (0, _xvseq.seqOf)(a.map((0, _xvseq._wrap)(fn)));
}

function filter() {
	for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
		args[_key4] = arguments[_key4];
	}

	if (args.length == 1) return (0, _xvseq._partialRight)(filter, args);
	var fn = (0, _xvseq._first)(args[1]);
	var a = (0, _xvseq._first)(args[0]);
	if (!_isArray(a)) return error("XPTY0004");
	return (0, _xvseq.seqOf)(a.filter((0, _xvseq._wrapFilter)(fn)));
}

function foldLeft() {
	for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
		args[_key5] = arguments[_key5];
	}

	if (args.length == 1) return error("XPTY0004");
	if (args.length == 2) return (0, _xvseq._partialRight)(foldLeft, args);
	var fn = (0, _xvseq._first)(args[2]);
	var init = (0, _xvseq._first)(args[1]);
	var a = (0, _xvseq._first)(args[0]);
	if (!_isArray(a)) return error("XPTY0004");
	return (0, _xvseq.seqOf)(a.reduce((0, _xvseq._wrapReduce)(fn), init));
}

function foldRight() {
	for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
		args[_key6] = arguments[_key6];
	}

	if (args.length == 1) return error("XPTY0004");
	if (args.length == 2) return (0, _xvseq._partialRight)(foldLeft, args);
	var fn = (0, _xvseq._first)(args[2]);
	var init = (0, _xvseq._first)(args[1]);
	var a = (0, _xvseq._first)(args[0]);
	if (!_isArray(a)) return error("XPTY0004");
	return (0, _xvseq.seqOf)(a.reduceRight((0, _xvseq._wrapReduce)(fn), init));
}