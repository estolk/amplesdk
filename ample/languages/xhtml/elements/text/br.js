/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_br	= function(){};
cXHTMLElement_br.prototype	= new cXHTMLElement("br");

// Class Events Handlers
cXHTMLElement_br.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

// Element Render: close (cancel double tag)
cXHTMLElement_br.prototype.$getTagOpen	= function() {
	var sHtml   = '<' + this.localName;
	for (var sName in this.attributes)
		if (this.attributes.hasOwnProperty(sName) && sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
    return sHtml + '/>';
};

cXHTMLElement_br.prototype.$getTagClose	= function() {
	return '';
};

// Register Element
ample.extend(cXHTMLElement_br);
