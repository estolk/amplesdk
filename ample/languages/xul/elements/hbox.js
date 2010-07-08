/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_hbox	= function(){};
cXULElement_hbox.prototype	= new cXULElement_box;

// Attributes Defaults
cXULElement_hbox.attributes	= {};
cXULElement_hbox.attributes.orient	= "horizontal";

// Class Events Handlers
cXULElement_hbox.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Register Element with language
oXULNamespace.setElement("hbox", cXULElement_hbox);
