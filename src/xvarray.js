import { List } from "immutable";

import { error } from "xverr";

import { seq, _first, _isSeq, _wrap, _wrapReduce, _partialRight } from "xvseq";

const ListProto = List.prototype;

export function array(...a) {
	var l = a.length;
	if(l===0){
		return seq(List());
	}
	if(l==1 && _isSeq(a[0])){
		return seq(List(a[0].flatten(true).toArray().map(_ => seq(_))));
	}
	return seq(List(a.map(_ => seq(_))));
}

export const join = array;

export function _isArray($maybe){
	let maybe = _first($maybe);
    return !!(maybe && List.isList(maybe));
}

function _checked($a, fn, ...args){
	var a = $a;
	if(_isSeq($a)) {
		if($a.size > 1) return error("XPTY0004");
		a = $a.first();
	}
	if(!_isArray(a)) return error("XPTY0004");
	return seq(fn.apply(a,args));
}

export function head($a) {
	return _checked($a,ListProto.slice,0,1);
}

export function tail($a) {
	return _checked($a,ListProto.slice,1);
}

export function size($a) {
	return _checked($a,ListProto.count);
}

export function insertBefore($a,$i,$v) {
	var i = _first($i) || 1;
	return _checked($a,ListProto.insert,i-1,seq($v));
}

export function forEach(...args){
	if(args.length==1) return _partialRight(forEach,args);
	var fn = _first(args[1]);
	var a = _first(args[0]);
	if(!_isArray(a)) return error("XPTY0004");
	return seq(a.map(_wrap(fn)));
}

export function filter(...args){
	if(args.length==1) return _partialRight(filter,args);
	var fn = _first(args[1]);
	var a = _first(args[0]);
	if(!_isArray(a)) return error("XPTY0004");
	return seq(a.filter(_wrap(fn)));
}

export function foldLeft(...args){
	if(args.length==1) return error("XPTY0004");
	if(args.length==2) return _partialRight(foldLeft,args);
	var fn = _first(args[2]);
	var init = _first(args[1]);
	var a = _first(args[0]);
	if(!_isArray(a)) return error("XPTY0004");
	return seq(a.reduce(_wrapReduce(fn),init));
}

export function foldRight(...args){
	if(args.length==1) return error("XPTY0004");
	if(args.length==2) return _partialRight(foldLeft,args);
	var fn = _first(args[2]);
	var init = _first(args[1]);
	var a = _first(args[0]);
	if(!_isArray(a)) return error("XPTY0004");
	return seq(a.reduceRight(_wrapReduce(fn),init));
}

function remove(...args){
	if (args.length == 1) return error("XPTY0004");
	var a = _first(args[0]);
	var index = _first(args[1]) || 0;
	if(!_isArray(a)) return error("XPTY0004");
	if(!index) return seq(a);
	return seq(a.delete(index.valueOf() - 1));
}

function append(...args){
	if (args.length == 1) return error("XPTY0004");
	var a = _first(args[0]);
	var insert = args[1];
	if(!_isArray(a)) return error("XPTY0004");
	//console.log("insert", insert);
	return seq(insert.isEmpty() ? a : a.push(insert));
}

function reverse(...args){
	if (args.length === 0) return error("XPTY0004");
	var a = _first(args[0]);
	if(!_isArray(a)) return error("XPTY0004");
	return seq(a.reverse());
}
