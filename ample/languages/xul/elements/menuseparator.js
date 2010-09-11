/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_menuseparator	= function(){};
cXULElement_menuseparator.prototype  = new cXULElement("menuseparator");

//Class Events Handlers
cXULElement_menuseparator.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_menuseparator.prototype.$getTagOpen	= function() {
    return '<tr>\
    			<td colspan="4"><div class="xul-menuseparator"><br /></div></td>\
    		</tr>';
};

// Register Element
ample.extend(cXULElement_menuseparator);
