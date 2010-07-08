/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_row	= function(){};
cXULElement_row.prototype	= new cXULElement;

// Attributes Defaults
cXULElement_row.attributes	= {};
cXULElement_row.attributes.orient	= "horizontal";

// Class event handlers
cXULElement_row.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		oXULReflowManager.schedule(this);
	}
};

// Element Render: open
cXULElement_row.prototype.$getTagOpen		= function() {
    return '<tr class="xul-row"' +(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '')+(this.attributes["hidden"] == "true" ? ' style="display:none"' : '')+'>';
};

// Element Render: close
cXULElement_row.prototype.$getTagClose	= function() {
    return '</tr>';
};

// Register Element with language
oXULNamespace.setElement("row", cXULElement_row);
