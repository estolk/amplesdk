/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_form	= function() {
	this.elements	= new AMLNodeList;
};
cXHTMLElement_form.prototype	= new cXHTMLElement("form");

// Public Properties
cXHTMLElement_form.prototype.elements	= null;

// Public Methods
cXHTMLElement_form.prototype.submit	= function() {
	// Handle @target="#target"
	var sTarget	= this.getAttribute("target"),
		oTarget;
	if (sTarget.match(/#(.+)$/) && (oTarget = this.ownerDocument.getElementById(window.RegExp.$1))) {
		var aValue	= [],
			sAction	= this.getAttribute("action").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
			vValue,
			sName,
			oElement;
		for (var nIndex = 0; nIndex < this.elements.length; nIndex++) {
			oElement	= this.elements[nIndex];
			if (!oElement.hasAttribute("disabled") && oElement.hasAttribute("name") && (vValue = oElement.$getValue()) != null)	{
				sName	= oElement.getAttribute("name");
				if (vValue instanceof window.Array)
					for (var nValue = 0; nValue < vValue.length; nValue++)
						aValue.push(sName + '=' + vValue[nValue]);
				else
					aValue.push(sName + '=' + vValue);
			}
		}
		function fComplete(oRequest) {
			// TODO: Check if works
			ample(oTarget).html(oRequest.responseText);
		};
		vValue	= window.encodeURI(aValue.join('&'));
		if (this.getAttribute("method").toLowerCase() == "post")
			ample.ajax({"type": "POST", "url": sAction, "headers": {'Content-Type': 'application/x-www-form-urlencoded'}, "data": vValue, "complete": fComplete});
		else
			ample.ajax({"type": "GET", "url": sAction.replace(/\?.+/, '') + '?' + vValue, "complete": fComplete});
	}
	else
		this.$getContainer().submit();
};

cXHTMLElement_form.prototype.reset	= function() {
	this.$getContainer().reset();
};

/* Event handlers */
cXHTMLElement_form.prototype._onSubmit	= function() {
    // Fire Event
    var oEvent = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("submit", true, true);

    return this.dispatchEvent(oEvent);
};

cXHTMLElement_form.prototype._onReset	= function() {
    // Fire Event
    var oEvent = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("reset", true, true);

    return this.dispatchEvent(oEvent);
};

// Default actions implementations
cXHTMLElement_form.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target instanceof cXHTMLElement_input ||
			oEvent.target instanceof cXHTMLElement_select ||
			oEvent.target instanceof cXHTMLElement_textarea ||
			oEvent.target instanceof cXHTMLElement_button) {
				oEvent.target.form	= this;
				this.elements.$add(oEvent.target);
//				if (oEvent.target.hasAttribute("name"))
//					this.elements[oEvent.target.getAttribute("name")]	= oEvent.target;
			}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target instanceof cXHTMLElement_input ||
			oEvent.target instanceof cXHTMLElement_select ||
			oEvent.target instanceof cXHTMLElement_textarea ||
			oEvent.target instanceof cXHTMLElement_button) {
				oEvent.target.form	= null;
				this.elements.$remove(oEvent.target);
//				if (oEvent.target.hasAttribute("name"))
//					delete this.elements[oEvent.target.getAttribute("name")];
		}
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

// Default Element Render: open
cXHTMLElement_form.prototype.$getTagOpen	= function() {
    var sHtml   = '<' + this.localName + ' onsubmit="var oElement = ample.$instance(this); if (oElement._onSubmit()) oElement.submit(); return false;" onreset="var oElement = ample.$instance(this); if (oElement._onReset()) oElement.reset(); return false;"';
    for (var sName in this.attributes)
		if (this.attributes.hasOwnProperty(sName) && sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
    return sHtml + '>';
};

// Register Element
ample.extend(cXHTMLElement_form);
