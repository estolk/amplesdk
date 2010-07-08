/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_panelset	= function(){};
cAMLElement_panelset.prototype	= new cAMLElement;

cAMLElement_panelset.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "cols":
				case "rows":
					this.refresh();
					break;
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.refresh();
		// register document resize event
		var that	= this;
		this.ownerDocument.addEventListener("resize", function() {
			that.refresh();
		}, false);
	}
};

cAMLElement_panelset.prototype.refresh	= function() {
	var aSize	= [],
		nFlex	= 0,
		nSize	= 0,
		nPanelsetSize	= 0,
		bVertical	= false,
		oElement;
	if (this.hasAttribute("rows")) {
		aSize	= this.getAttribute("rows").replace(/^\s+|\s+$/g, '').split(/\s+/);
		nPanelsetSize	= this.$getContainer().offsetHeight;
		bVertical	= true;
	}
	else
	if (this.hasAttribute("cols")) {
		aSize	= this.getAttribute("cols").replace(/^\s+|\s+$/g, '').split(/\s+/);
		nPanelsetSize	= this.$getContainer().offsetWidth;
		bVertical	= false;
	}

	//
	for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++) {
		if (aSize[nIndex].match(/(\d*)\*/))
			nFlex	+=(RegExp.$1 || 1)* 1;
		else {
			oElement	= this.childNodes[nIndex].$getContainer();
			oElement.style[bVertical ? "height" : "width"]	= aSize[nIndex];
			nSize	+= oElement[bVertical ? "offsetHeight" : "offsetWidth"];
		}
	}
	//
	for (var nIndex = 0, nOffset = 0; nIndex < this.childNodes.length; nIndex++) {
		if (aSize[nIndex].match(/(\d*)\*/))
			this.childNodes[nIndex].$getContainer().style[bVertical ? "height" : "width"]	= Math.floor((nPanelsetSize - nSize)*(RegExp.$1 || 1)/ nFlex - 2)+ "px";
	}
};

// Renderers
cAMLElement_panelset.prototype.$getTagOpen	= function()
{
	return '<div class="aml-panelset' + (this.hasAttribute("rows") ? ' aml-panelset-rows-' : this.hasAttribute("cols") ? ' aml-panelset-cols-' : '')+ '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') + '>';
};

cAMLElement_panelset.prototype.$getTagClose	= function()
{
    return 	'</div>';
};

// Register Element with language
oAMLNamespace.setElement("panelset", cAMLElement_panelset);
