/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_separator	= function(){};
cXULElement_separator.prototype = new cXULElement("separator");

// Class Events Handlers
cXULElement_separator.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_separator.prototype.$getTagOpen	= function() {
	return '<div class="xul-separator' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="height:1.5em;width:1.5em;"><img height="1" width="1" /></div>';
};

// Register Element
ample.extend(cXULElement_separator);
