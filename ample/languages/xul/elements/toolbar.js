/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbar	= function(){};
cXULElement_toolbar.prototype	= new cXULElement("toolbar");
cXULElement_toolbar.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Accessibility
cXULElement_toolbar.prototype.$selectable	= false;

// Class Events Handlers
cXULElement_toolbar.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_toolbar.prototype.$getTagOpen		= function() {
    return '<div class="xul-toolbar' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
};

// Element Render: close
cXULElement_toolbar.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element
ample.extend(cXULElement_toolbar);
