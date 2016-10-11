import { List } from "immutable";

import { _first, _isSeq, _wrap, _wrapFilter, _wrapReduce, _partialRight, seqOf } from "xvseq";

const ListProto = List.prototype;

export function array(...a) {
	var l = a.length;
	if(l===0){
		return seqOf(List());
	}
	if(l==1 && _isSeq(a[0])){
		return seqOf(List(a[0].map(_ => seqOf(_))));
	}
	return seqOf(List(a.map(_ => seqOf(_))));
}

export const join = array;

export function _isArray(maybe){
    return !!(maybe && List.isList(maybe));
}

function _checked($a, fn, ...args){
	var a = $a;
	if(_isSeq($a)) {
		if($a.size > 1) return error("XPTY0004");
		a = $a.first();
	}
	if(!_isArray(a)) return error("XPTY0004");
	return seqOf(fn.apply(a,args));
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
	return _checked($a,ListProto.insert,i-1,seqOf($v));
}

export function forEach(...args){
	if(args.length==1) return _partialRight(forEach,args);
	var fn = _first(args[1]);
	var a = _first(args[0]);
	if(!_isArray(a)) return error("XPTY0004");
	return seqOf(a.map(_wrap(fn)));
}

export function filter(...args){
	if(args.length==1) return _partialRight(filter,args);
	var fn = _first(args[1]);
	var a = _first(args[0]);
	if(!_isArray(a)) return error("XPTY0004");
	return seqOf(a.filter(_wrapFilter(fn)));
}

export function foldLeft(...args){
	if(args.length==1) return error("XPTY0004");
	if(args.length==2) return _partialRight(foldLeft,args);
	var fn = _first(args[2]);
	var init = _first(args[1]);
	var a = _first(args[0]);
	if(!_isArray(a)) return error("XPTY0004");
	return seqOf(a.reduce(_wrapReduce(fn),init));
}

export function foldRight(...args){
	if(args.length==1) return error("XPTY0004");
	if(args.length==2) return _partialRight(foldLeft,args);
	var fn = _first(args[2]);
	var init = _first(args[1]);
	var a = _first(args[0]);
	if(!_isArray(a)) return error("XPTY0004");
	return seqOf(a.reduceRight(_wrapReduce(fn),init));
}
