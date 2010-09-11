/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fAMLSelection_onMouseDown(oEvent) {
	for (var oElement = oEvent.target, bAllow = false; oElement.nodeType != cAMLNode.DOCUMENT_NODE; oElement = oElement.parentNode)
		if (oElement.$selectable == true)
			bAllow	= true;
		else
		if (oElement.$selectable == false)
			return !bAllow && oEvent.preventDefault();
};

// Attaching to implementation
// Public Properties
cAMLElement.prototype.$selectable	= null;

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAmple_document, "mousedown",	fAMLSelection_onMouseDown, false);
