/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_img	= function(){};
cXHTMLElement_img.prototype	= new cXHTMLElement;

// Class Events Handlers
cXHTMLElement_img.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

// Element Render: open
cXHTMLElement_img.prototype.$getTagOpen	= function() {
    var sHtml   = '<' + this.localName + ' onmousedown="return '+ "false" + '" ondragstart="return '+ "false" + '"';
    for (var sName in this.attributes)
		if (this.attributes.hasOwnProperty(sName) && sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
    return sHtml + '/>';
};

cXHTMLElement_img.prototype.$getTagClose	= function() {
	return '';
};

// Register Element with language
oXHTMLNamespace.setElement("img", cXHTMLElement_img);
