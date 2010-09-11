/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tabbox	= function(){};
cXULElement_tabbox.prototype	= new cXULElement("tabbox");

// Public Properties
cXULElement_tabbox.prototype.tabs		= null; // Reference to tabs child element
cXULElement_tabbox.prototype.tabpanels	= null; // Reference to tabpanels child element

cXULElement_tabbox.prototype.selectedIndex	= -1;
cXULElement_tabbox.prototype.selectedTab	= null; // not supported
cXULElement_tabbox.prototype.selectedPanel	= null; // not supported

// Attributes Defaults
cXULElement_tabbox.attributes	= {};
cXULElement_tabbox.attributes.orient	= "vertical";

// Class Events Handlers
cXULElement_tabbox.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_tabbox.prototype.$getTagOpen	= function() {
    return '<div class="xul-tabbox' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
};

// Element Render: close
cXULElement_tabbox.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element
ample.extend(cXULElement_tabbox);
