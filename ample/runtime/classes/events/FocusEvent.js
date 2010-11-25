/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cFocusEvent	= function(){};
cFocusEvent.prototype	= new cUIEvent;

// nsIDOMFocusEvent
cFocusEvent.prototype.relatedTarget	= null;

cFocusEvent.prototype.initFocusEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, oRelatedTarget)
{
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	this.relatedTarget	= oRelatedTarget;
};