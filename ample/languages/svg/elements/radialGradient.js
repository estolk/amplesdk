/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_radialGradient	= function(){};
cSVGElement_radialGradient.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_radialGradient.handlers	= {
		"DOMAttrModified":	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "cx":
					case "cy":
					case "r":
						var sId	= this.getAttribute("id");
						if (sId) {
							var aElements	= this.ownerDocument.querySelectorAll("[fill=url(#" + sId + ")]");
							for (var nIndex = 0; nIndex < aElements.length; nIndex++)
								cSVGElement.setStyle(aElements[nIndex], "fill", "url(#" + sId + ")");
						}
				}
			}
		}
	};
};

// Register Element with language
oSVGNamespace.setElement("radialGradient", cSVGElement_radialGradient);
