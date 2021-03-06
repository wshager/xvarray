import { PVec, isVec } from "js-persistent-vector";

import { error } from "xverr";

import { seq, toSeq, _first, _isSeq, _wrapReduce, _partialRight } from "xvseq";

const ListProto = List.prototype;

export function array(...a) {
	var l = a.length;
	if(l===0){
		return new PVec();
	}
	if(l==1 && _isSeq(a[0])){
		return new PVec(a[0].map(_ => _isSeq(_) && _.size > 1 ? _ : _first(_)));
	}
	return new PVec(a.map(_ => _isSeq(_) && (_.isEmpty() || _.size > 1) ? _ : _first(_)));
}

export function join($a) {
	if ($a === undefined) return error("XPTY0004");
	// assume a sequence of vectors
	return $a.reduce(function(pre,cur){
		var v = _first(cur);
		if(!_isArray(v)) return error("XPTY0004","One of the items for array:join is not an array.");
		return pre.concat(v);
	},List()));
}

export function _isArray($maybe) {
	let maybe = _first($maybe);
	return !!(maybe && isVec(maybe));
}

function _checked($a, fn, ...args) {
	var a = $a;
	if (_isSeq($a)) {
		if ($a.size > 1) return error("XPTY0004");
		a = $a.first();
	}
	if (!_isArray(a)) return error("XPTY0004");
	return seq(fn.apply(a, args));
}

export function head($a) {
	return _checked($a, ListProto.first);
}

export function tail($a) {
	return _checked($a, ListProto.rest);
}

export function size($a) {
	return _checked($a, ListProto.count);
}

export function subarray($a,$s,$e) {
	var s =  _first($s) || 1, e = _first($e);
	return _checked($a, ListProto.slice, s - 1,  e);
}

export function insertBefore($a, $i, $v) {
	var i = _first($i) || 1;
	return _checked($a, ListProto.insert, i - 1, _isSeq($v) && $v.size>1 ? $v : _first($v));
}

function _wrap(fn,fltr){
   return function (v,i){
	   var ret = fn(seq(v));
	   return !fltr && _isSeq(ret) && (ret.isEmpty() || ret.size>1) ? ret : _first(ret);
   };
}

export function forEach(...args) {
	if (args.length == 1) return _partialRight(forEach, args);
	var fn = _first(args[1]);
	var a = _first(args[0]);
	if (!_isArray(a)) return error("XPTY0004");
	return seq(a.map(_wrap(fn)));
}

export function filter(...args) {
	if (args.length == 1) return _partialRight(filter, args);
	var fn = _first(args[1]);
	var a = _first(args[0]);
	if (!_isArray(a)) return error("XPTY0004");
	return seq(a.filter(_wrap(fn,true)));
}

export function foldLeft(...args) {
	if (args.length == 1) return error("XPTY0004");
	if (args.length == 2) return _partialRight(foldLeft, args);
	var fn = _first(args[2]);
	var init = _first(args[1]);
	var a = _first(args[0]);
	if (!_isArray(a)) return error("XPTY0004");
	return seq(a.reduce(_wrapReduce(fn), init));
}

export function foldRight(...args) {
	if (args.length == 1) return error("XPTY0004");
	if (args.length == 2) return _partialRight(foldLeft, args);
	var fn = _first(args[2]);
	var init = _first(args[1]);
	var a = _first(args[0]);
	if (!_isArray(a)) return error("XPTY0004");
	return seq(a.reduceRight(_wrapReduce(fn), init));
}

export function remove(...args) {
	if (args.length == 1) return error("XPTY0004");
	var a = _first(args[0]);
	var index = _first(args[1]) || 0;
	if (!_isArray(a)) return error("XPTY0004");
	if (!index) return seq(a);
	return seq(a.delete(index.valueOf() - 1));
}

export function append(...args) {
	if (args.length == 1) return error("XPTY0004");
	var a = _first(args[0]);
	var insert = args[1];
	if (!_isArray(a)) return error("XPTY0004");
	if(_isSeq(insert) && !insert.isEmpty()) {
		insert = insert.size>1 ? insert : _first(insert);
	}
	return seq(a.push(insert));
}

export function reverse(...args) {
	if (args.length === 0) return error("XPTY0004");
	var a = _first(args[0]);
	if (!_isArray(a)) return error("XPTY0004");
	return seq(a.reverse());
}

export function flatten($a) {
	if($a === undefined) return error("XPTY0004");
	var a = _first($a);
	if (!_isArray(a)) return error("XPTY0004");
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
	a.forEach(function (v, k) {
		if (v && (v._isSeq || _isArray(v) || v instanceof Array) && !v._isNode) {
			flatDeep(v);
		} else {
			ret.push(v);
		}
	});
	return toSeq(ret);
}

export function get($a,$index) {
	var a = _first($a);
	// TODO throw
	var index = _first($index).valueOf() - 1;
	if(a.isEmpty()) return seq();
	return seq(a.get(index));
}
