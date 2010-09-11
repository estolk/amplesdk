/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLXSObjectList	= function() {

};
// This object can also be dereferenced using square bracket notation (e.g. obj[1]).
cAMLXSObjectList.prototype.length	= 0;

cAMLXSObjectList.prototype.item	= function(nIndex) {
	// Validate arguments
	fGuard(arguments, [
		["node",	cNumber]
	]);

	return nIndex < this.length ? this[nIndex] : null;
};

cAMLXSObjectList.prototype.$add	= function(oValue) {
	this[this.length++]	= oValue;
};
