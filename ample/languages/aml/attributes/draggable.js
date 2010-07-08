/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_draggable	= function(){};

cAMLAttr_draggable.prototype	= new AMLAttr;

// Class Events Handlers
cAMLAttr_draggable.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.ownerElement.$draggable	= this.value == "true";
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.ownerElement.$draggable	= false;
	}
};

// Register Attribute with language
oAMLNamespace.setAttribute("draggable", cAMLAttr_draggable);
