/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_symbol	= function(){};
cSVGElement_symbol.prototype	= new cSVGElement("symbol");

if (cSVGElement.useVML) {
	// Implementation for IE
};

// Register Element
ample.extend(cSVGElement_symbol);
