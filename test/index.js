const xvarray = require("../lib/xvarray");
const xvseq = require("xvseq");
const assert = require("assert");

function assertEq(a,b){
	var ajs = JSON.stringify(a.toJS()), bjs = JSON.stringify([b]);
	assert.equal(ajs,bjs,`${ajs} not equal to ${bjs}`);
}


assertEq(xvarray.array(xvseq.seq(1,2,3)),[[1],[2],[3]]);
assertEq(xvarray.tail(xvarray.array("a","b","c")),[["b"],["c"]]);
assertEq(xvarray.insertBefore(xvarray.array("a","b","c"),1,"s"),[["s"],["a"],["b"],["c"]]);
assertEq(xvarray.forEach(xvarray.array(xvseq.seq(1,2,3)),function(_){
	return xvseq.seqOf(xvseq._first(_)+1);
}),xvarray.array(2,3,4).first().toJS());
assertEq(xvarray.filter(xvarray.array(xvseq.seq(1,2,3)),function(_){
	return xvseq._first(_)>1;
}),[[2],[3]]);
assertEq(xvarray.foldLeft(xvarray.array(xvseq.seq(1,2,3)),1,function(acc,_){
	return xvseq._first(acc) + xvseq._first(_);
}),7);


console.log("All tests passed");
