/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULWindowElement	= function() {
	cXULElement.apply(this, arguments);
};
cXULWindowElement.prototype	= new cXULElement;
cXULWindowElement.prototype.localName	= "#element-window";

cXULWindowElement.prototype.$draggable	= true;
cXULWindowElement.prototype.$resizable	= true;

// Register Element
ample.extend(cXULWindowElement);
