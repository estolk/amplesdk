/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement	= function(){};

cAMLElement.prototype	= new cAMLNode;
cAMLElement.prototype.nodeType	= cAMLNode.ELEMENT_NODE;

// nsIDOMElement
cAMLElement.prototype.tagName	= null;
cAMLElement.prototype.uniqueID	= null;

// HTMLElement
cAMLElement.prototype.style	= null;

//
cAMLElement.prototype.$childNodesAnonymous	= null;

// Private Variables
var nAMLElement_prefix	= 0;

// Public Methods
function fAMLElement_appendChild(oParent, oNode)
{
	// Call parent class method
	fAMLNode_appendChild(oParent, oNode);

	// Append DOM
	var oGateway, oElement;
	if (oParent.nodeType == cAMLNode.ELEMENT_NODE)
		if (oGateway =(oParent.$getContainer("gateway") || oParent.$getContainer()))
			if (oElement = (oNode.$getContainer() || fAML_render(oNode)))
		   		oGateway.appendChild(oElement);

	// Register Instance
	if (oAML_all[oParent.uniqueID])
		fAML_register(oNode);

	//
    return oNode;
};

cAMLElement.prototype.appendChild	= function(oNode)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	]);

	// Invoke actual implementation
	if (oNode.nodeType == cAMLNode.DOCUMENT_FRAGMENT_NODE)
		while (oNode.firstChild)
			fAMLElement_appendChild(this, oNode.firstChild);
	else
		fAMLElement_appendChild(this, oNode);
	//
	return oNode;
};

cAMLElement.prototype.$appendChildAnonymous	= function(oNode)
{
	// Set parent
    oNode.parentNode	= this;

    // Pseudo DOM
    var nLength	= this.$childNodesAnonymous.length;
    if (nLength)
    {
        oNode.previousSibling	= this.$childNodesAnonymous[nLength - 1];
        oNode.previousSibling.nextSibling	= oNode;
    }

    // Add to collection of anonymous child nodes
    this.$childNodesAnonymous.$add(oNode);

	// Fire Mutation event
    var oEvent = new cAMLMutationEvent;
    oEvent.initMutationEvent("DOMNodeInserted", true, false, this, null, null, null, null);
    fAMLNode_dispatchEvent(oNode, oEvent);

	// Register Instance
	if (oAML_all[this.uniqueID])
		fAML_register(oNode);

	return oNode;
};

function fAMLElement_insertBefore(oParent, oNode, oBefore)
{
	// Call parent class method
	fAMLNode_insertBefore(oParent, oNode, oBefore);

	// Insert DOM
	var oGateway, oChild;
	if (oParent.nodeType == cAMLNode.ELEMENT_NODE)
		if ((oGateway =(oParent.$getContainer("gateway") || oParent.$getContainer())))
			if (oChild = (oNode.$getContainer() || fAML_render(oNode)))
	    		oGateway.insertBefore(oChild, function() {
	    			for (var oElement; oBefore; oBefore = oBefore.nextSibling)
	    				if (oElement = oBefore.$getContainer())
	    					return oElement;
	    			return null;
	    		}());

	// Register Instance
	if (oAML_all[oParent.uniqueID])
		fAML_register(oNode);

	//
    return oNode;
};

cAMLElement.prototype.insertBefore	= function(oNode, oBefore)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode],
		["before",	cAMLNode, false, true]
	]);

	if (oBefore) {
		if (this.childNodes.$indexOf(oBefore) !=-1) {
			if (oNode.nodeType == cAMLNode.DOCUMENT_FRAGMENT_NODE)
				while (oNode.firstChild)
					fAMLElement_insertBefore(this, oNode.firstChild, oBefore);
			else
				fAMLElement_insertBefore(this, oNode, oBefore);
		}
		else
			throw new cAMLException(cAMLException.NOT_FOUND_ERR);
	}
	else {
		if (oNode.nodeType == cAMLNode.DOCUMENT_FRAGMENT_NODE)
			while (oNode.firstChild)
				fAMLElement_appendChild(this, oNode.firstChild);
		else
			fAMLElement_appendChild(this, oNode);
	}
	return oNode;
};

function fAMLElement_removeChild(oParent, oNode)
{
	// Fire Mutation event
	var oEvent = new cAMLMutationEvent;
	oEvent.initMutationEvent("DOMNodeRemoved", true, false, oParent, null, null, null, null);
	fAMLNode_dispatchEvent(oNode, oEvent);

	// Unregister Instance
	if (oAML_all[oParent.uniqueID])
		fAML_unregister(oNode);

	// Call parent class method
	fAMLNode_removeChild(oParent, oNode);

	// Remove from DOM
	var oGateway, oChild;
	if (oParent.nodeType == cAMLNode.ELEMENT_NODE)
		if ((oChild = oNode.$getContainer()) && (oGateway = (oParent.$getContainer("gateway") || oParent.$getContainer())))
			if (oChild = (function() {
				for (; oChild; oChild = oChild.parentNode)
					if (oChild.parentNode == oGateway)
						return oChild;
			}()))
				oGateway.removeChild(oChild);

	return oNode;
};

cAMLElement.prototype.removeChild	= function(oNode)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	]);

    if (this.childNodes.$indexOf(oNode) !=-1)
    	return fAMLElement_removeChild(this, oNode);
    else
        throw new cAMLException(cAMLException.NOT_FOUND_ERR);
};

cAMLElement.prototype.$removeChildAnonymous	= function(oNode)
{
	// Fire Mutation event
    var oEvent = new cAMLMutationEvent;
    oEvent.initMutationEvent("DOMNodeRemoved", true, false, this, null, null, null, null);
    fAMLNode_dispatchEvent(oNode, oEvent);

	if (oNode.nextSibling)
		oNode.nextSibling.previousSibling	= oNode.previousSibling;

	if (oNode.previousSibling)
		oNode.previousSibling.nextSibling	= oNode.nextSibling;

	// Reset DOM properties
    oNode.parentNode  		= null;
	oNode.previousSibling	= null;
	oNode.nextSibling		= null;

    // Add to collection of anonymous child nodes
    this.$childNodesAnonymous.$remove(oNode);

	// Register Instance
	if (oAML_all[this.uniqueID])
		fAML_unregister(oNode);

	return oNode;
};

function fAMLElement_replaceChild(oParent, oNode, oOld)
{
	// Call parent class method
	fAMLNode_replaceChild(oParent, oNode, oOld);

	// Unregister Instance
	fAML_unregister(oOld);

	// Replace in from DOM
	var oElement, oGateway, oChild;
	if (oParent.nodeType == cAMLNode.ELEMENT_NODE)
		if ((oGateway =(oParent.$getContainer("gateway") || oParent.$getContainer())) && (oChild = oOld.$getContainer()))
			if (oElement = (oNode.$getContainer() || fAML_render(oNode)))
		    	oGateway.replaceChild(oElement, oChild);

	// Register Instance
	if (oAML_all[oParent.uniqueID])
		fAML_register(oNode);

	return oOld;
};

cAMLElement.prototype.replaceChild	= function(oNode, oOld)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode],
		["old",		cAMLNode, false, true]
	]);

	if (oOld) {
	    if (this.childNodes.$indexOf(oOld) !=-1) {
	    	if (oNode.nodeType == cAMLNode.DOCUMENT_FRAGMENT_NODE) {
	    		while (oNode.firstChild)
	    			fAMLElement_insertBefore(this, oNode.firstChild, oOld);
	    	}
	    	else
	    		fAMLElement_insertBefore(this, oNode, oOld);
			fAMLElement_removeChild(this, oOld);
	    }
	    else
	    	throw new cAMLException(cAMLException.NOT_FOUND_ERR);
	}
	else {
    	if (oNode.nodeType == cAMLNode.DOCUMENT_FRAGMENT_NODE)
    		while (oNode.firstChild)
    			fAMLElement_appendChild(this, oNode.firstChild);
    	else
    		fAMLElement_appendChild(this, oNode);
	}

    //
    return oOld;
};

cAMLElement.prototype.cloneNode	= function(bDeep)
{
	// Create Element
	var oElement	= fAMLDocument_createElementNS(this.ownerDocument, this.namespaceURI, this.nodeName);

	// Copy Attributes
	for (var sName in this.attributes)
		if (this.attributes.hasOwnProperty(sName))
			oElement.attributes[sName]	= this.attributes[sName];

	// Append Children
	if (bDeep)
		for (var nIndex = 0, oNode; oNode = this.childNodes[nIndex]; nIndex++)
			fAMLNode_appendChild(oElement, oNode.cloneNode(bDeep));
	return oElement;
};

function fAMLElement_hazAttribute(oElement, sName)
{
	return oElement.attributes.hasOwnProperty(sName);
};

cAMLElement.prototype.hasAttribute	= function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",		cString]
	]);

	return fAMLElement_hazAttribute(this, sName);
};

function fAMLElement_hazAttributeNS(oElement, sNameSpaceURI, sLocalName)
{
	if (sNameSpaceURI == null)
		return fAMLElement_hazAttribute(oElement, sLocalName);

	var sPrefix	= fAMLNode_lookupPrefix(oElement, sNameSpaceURI);
	return sPrefix ? fAMLElement_hazAttribute(oElement, sPrefix + ':' + sLocalName) : false;
};

cAMLElement.prototype.hasAttributeNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true]
		["localName",		cString]
	]);

	return fAMLElement_hazAttributeNS(this, sNameSpaceURI, sLocalName);
};

function fAMLElement_setAttribute(oElement, sName, sValue)
{
	// convert value to string
	var sValueOld	= oElement.attributes[sName],
		bValue	= sName in oElement.attributes;

    if (sValueOld != sValue) {
    	// Only operate on shadow if element is in the DOM
    	if (oAML_all[oElement.uniqueID] && (sName == 'id' || sName == "class" || sName == "style")) {
    		// Find shadow content first
    		var oElementDOM	= oElement.$getContainer();
    		if (sName == 'id') {
	    		if (sValue)
	    			oAML_ids[sValue]	= oElement;
    			delete oAML_ids[sValueOld];
	    	}
    		// Update view
    		if (oElementDOM) {
		    	if (sName == "class") {
		    		var sValueClass	=(oElement.prefix ? oElement.prefix + '-' : '') + oElement.localName + (sValue ? ' ' + sValue : '');
		    		if (bTrident && nVersion < 8)
		    			oElementDOM.className	= sValueClass;
		    		else
		    			oElementDOM.setAttribute("class", sValueClass);
		    	}
		    	else
		    	if (sName == "style")
	    			oElementDOM.style.cssText	= sValue;
		    	else
	    			oElementDOM.id	= sValue ? sValue : oElement.uniqueID;
    		}
    	}

    	//
    	oElement.attributes[sName]	= sValue;

    	// Fire Mutation event
    	if (oAML_all[oElement.uniqueID]) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMAttrModified", true, false, null, bValue ? sValueOld : null, sValue, sName, bValue ? cAMLMutationEvent.MODIFICATION : cAMLMutationEvent.ADDITION);
		    fAMLNode_dispatchEvent(oElement, oEvent);
    	}
    }
};

cAMLElement.prototype.setAttribute	= function(sName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",		cString],
		["value",		cObject]
	]);

	fAMLElement_setAttribute(this, sName, cString(sValue));
};

function fAMLElement_setAttributeNS(oElement, sNameSpaceURI, sQName, sValue)
{
	if (sNameSpaceURI != null) {
		var sElementPrefix	= fAMLNode_lookupPrefix(oElement, sNameSpaceURI),
			aQName		= sQName.split(':'),
			sLocalName	= aQName.pop(),
			sPrefix		= aQName.pop() || null;

		if (sPrefix)
		{
			if (!sElementPrefix || (sPrefix != sElementPrefix))
				// Put namespace declaration
				oElement.attributes["xmlns" + ':' + sPrefix]	= sNameSpaceURI;
		}
		else
		{
			if (sElementPrefix)
				sPrefix	= sElementPrefix;
			else
			{
				// Create fake prefix
				sPrefix	= '_' + 'p' + nAMLElement_prefix++;

				// Put namespace declaration
				oElement.attributes["xmlns" + ':' + sPrefix]	= sNameSpaceURI;
			}
			//
			sQName	= sPrefix + ':' + sLocalName;
		}

		// Global attributes module
		if (!(sQName in oElement.attributes) && !(sQName == "xmlns" || sNameSpaceURI == "http://www.w3.org/2000/xmlns/" || sNameSpaceURI == "http://www.w3.org/XML/1998/namespace"))
		{
			var oNamespace	= oAML_namespaces[sNameSpaceURI],
				cAttribute	= oNamespace ? oNamespace.attributes[sLocalName] : null,
				oAttribute,
				oEvent;

			if (cAttribute)
			{
				// oAttribute used to create fake object
				oAttribute	= new cAttribute;
				oAttribute.ownerDocument= oElement.ownerDocument;
				oAttribute.ownerElement	= oElement;
				oAttribute.nodeValue	= sValue;
				oAttribute.nodeName		= sQName;
				oAttribute.localName	= sLocalName;
				oAttribute.prefix		= sPrefix;
				oAttribute.namespaceURI	= sNameSpaceURI;
				oAttribute.name		= sQName;
				oAttribute.value	= sValue;

				// Fire Mutation event (pseudo)
				oEvent = new cAMLMutationEvent;
				oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
				oEvent.target	=
				oEvent.currentTarget	= oAttribute;
				oEvent.eventPhase		= cAMLEvent.AT_TARGET;
				fAMLNode_handleEvent(oAttribute, oEvent);
			}
		}
	}

	// Set attribute
	fAMLElement_setAttribute(oElement, sQName, sValue);
};

cAMLElement.prototype.setAttributeNS	= function(sNameSpaceURI, sQName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["qualifiedName",	cString],
		["value",			cObject]
	]);

	fAMLElement_setAttributeNS(this, sNameSpaceURI, sQName, cString(sValue));
};

cAMLElement.prototype.setAttributeNode	= function(oAttribute)
{
	this.setAttributeNodeNS(oAttribute);
};

cAMLElement.prototype.setAttributeNodeNS	= function(oAttribute)
{
//->Source
/*
	// Validate arguments
	fAML_validate(arguments, [
		["node",		cAMLAttr]
	]);

	//
	oAttribute.ownerElement	= this;
	this.setAttributeNS(oAttribute.namespaceURI, oAttribute.nodeName, oAttribute.nodeValue);
*/
//<-Source
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

function fAMLElement_getAttribute(oElement, sName)
{
    return oElement.attributes.hasOwnProperty(sName) ? oElement.attributes[sName] : '';
};

cAMLElement.prototype.getAttribute	= function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",		cString]
	]);

	return fAMLElement_getAttribute(this, sName);
};

function fAMLElement_getAttributeNS(oElement, sNameSpaceURI, sLocalName)
{
	if (sNameSpaceURI == null)
		return fAMLElement_getAttribute(oElement, sLocalName);

	var sPrefix	= fAMLNode_lookupPrefix(oElement, sNameSpaceURI);
    return sPrefix ? fAMLElement_getAttribute(oElement, sPrefix + ':' + sLocalName) : '';
};

cAMLElement.prototype.getAttributeNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	]);

	return fAMLElement_getAttributeNS(this, sNameSpaceURI, sLocalName);
};

cAMLElement.prototype.getAttributeNode	= function(sName)
{
	return this.getAttributeNodeNS(null, sName);
};

cAMLElement.prototype.getAttributeNodeNS	= function(sNameSpaceURI, sLocalName)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

function fAMLElement_removeAttribute(oElement, sName)
{
	if (sName in oElement.attributes) {
		var sValueOld	= oElement.attributes[sName];
		// Only operate on shadow if element is in the DOM
    	if (oAML_all[oElement.uniqueID] && (sName == 'id' || sName == "class" || sName == "style")) {
    		// Find shadow content
    		var oElementDOM	= oElement.$getContainer();
    		if (sName == 'id') {
		    	delete oAML_ids[sValueOld];
		    }
		    // Update view
		    if (oElementDOM) {
			    if (sName == "class") {
			    	var sValueClass	=(oElement.prefix ? oElement.prefix + '-' : '') + oElement.localName;
			    	if (bTrident && nVersion < 8)
			    		oElementDOM.className	= sValueClass;
			    	else
			    		oElementDOM.setAttribute("class", sValueClass);
			    }
			    else
			    if (sName == "style")
			    	oElementDOM.style.cssText	= '';
			    else
			    	oElementDOM.id	= oElement.uniqueID;
		    }
    	}
	    //
	    delete oElement.attributes[sName];

		// Fire Mutation event
	    if (oAML_all[oElement.uniqueID]) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMAttrModified", true, false, null, sValueOld, null, sName, cAMLMutationEvent.REMOVAL);
		    fAMLNode_dispatchEvent(oElement, oEvent);
	    }
	}
};

cAMLElement.prototype.removeAttribute	= function(sName)
{
	fAML_validate(arguments, [
		["name",	cString]
	]);

	fAMLElement_removeAttribute(this, sName);
};

function fAMLElement_removeAttributeNS(oElement, sNameSpaceURI, sLocalName)
{
	if (sNameSpaceURI != null) {
		var sPrefix	= fAMLNode_lookupPrefix(oElement, sNameSpaceURI),
			sQName	= sPrefix + ':' + sLocalName;

		if (!sPrefix)
			return;

		// Global attributes module
		if (sQName in oElement.attributes && !(sLocalName == "xmlns" || sNameSpaceURI == "http://www.w3.org/2000/xmlns/" || sNameSpaceURI == "http://www.w3.org/XML/1998/namespace"))
		{
			var oNamespace	= oAML_namespaces[sNameSpaceURI],
				cAttribute	= oNamespace ? oNamespace.attributes[sLocalName] : null,
				sValue		= oElement.attributes[sQName],
				oAttribute,
				oEvent;

			if (cAttribute)
			{
				// oAttribute used to create fake object
				oAttribute	= new cAttribute;
				oAttribute.ownerDocument= oElement.ownerDocument;
				oAttribute.ownerElement	= oElement;
				oAttribute.nodeValue	= sValue;
				oAttribute.nodeName		= sQName;
				oAttribute.localName	= sLocalName;
				oAttribute.prefix		= sPrefix;
				oAttribute.namespaceURI	= sNameSpaceURI;
				oAttribute.name		= sQName;
				oAttribute.value	= sValue;

				// Fire Mutation event (pseudo)
				oEvent = new cAMLMutationEvent;
				oEvent.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
				oEvent.target	=
				oEvent.currentTarget	= oAttribute;
				oEvent.eventPhase		= cAMLEvent.AT_TARGET;
				fAMLNode_handleEvent(oAttribute, oEvent);
			}
		}

		//
		sLocalName	= sQName;
	}

	fAMLElement_removeAttribute(oElement, sLocalName);
};

cAMLElement.prototype.removeAttributeNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	]);

	fAMLElement_removeAttributeNS(this, sNameSpaceURI, sLocalName);
};

cAMLElement.prototype.removeAttributeNode	= function(oAttribute)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLElement.prototype.hasChildNodes	= function()
{
	return this.childNodes.length > 0;
};

function fAMLElement_getElementsByTagName(oElement, sTagName)
{
	var aElements	= new cAMLNodeList,
		bTagName	= '*' == sTagName;
	(function(oElement) {
		for (var nIndex = 0, oNode; oNode = oElement.childNodes[nIndex]; nIndex++) {
			if (oNode.nodeType == cAMLNode.ELEMENT_NODE) {
				if (bTagName || sTagName == oNode.tagName)
					aElements.$add(oNode);
				if (oNode.childNodes.length)
					arguments.callee(oNode);
			}
		}
	})(oElement);
	return aElements;
};

cAMLElement.prototype.getElementsByTagName	= function(sTagName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString]
	]);

	return fAMLElement_getElementsByTagName(this, sTagName);
};

function fAMLElement_getElementsByTagNameNS(oElement, sNameSpaceURI, sLocalName)
{
	var aElements	= new cAMLNodeList,
		bNameSpaceURI	= '*' == sNameSpaceURI,
		bLocalName		= '*' == sLocalName;
	(function(oElement) {
		for (var nIndex = 0, oNode; oNode = oElement.childNodes[nIndex]; nIndex++) {
			if (oNode.nodeType == cAMLNode.ELEMENT_NODE) {
				if ((bLocalName || sLocalName == oNode.localName) && (bNameSpaceURI || sNameSpaceURI == oNode.namespaceURI))
					aElements.$add(oNode);
				if (oNode.childNodes.length)
					arguments.callee(oNode);
			}
		}
	})(oElement);
	return aElements;
};

cAMLElement.prototype.getElementsByTagNameNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString],
		["localName",		cString]
	]);

	return fAMLElement_getElementsByTagNameNS(this, sNameSpaceURI, sLocalName);
};
/*
cAMLElement.prototype.focus	= function()
{

};

cAMLElement.prototype.blur	= function()
{

};
*/

cAMLElement.prototype.$activate	= function()
{
	var oEvent	= new cAMLUIEvent;
	oEvent.initUIEvent("DOMActivate", true, true, window, null);
	fAMLNode_dispatchEvent(this, oEvent);
};

cAMLElement.prototype.$getTag		= function()
{
	var aHtml	= [this.$getTagOpen().replace(/^(\s*<[\w:]+)/, '$1 id="' +(this.attributes.id || this.uniqueID)+ '"')];
	for (var nIndex = 0, oNode; oNode = this.childNodes[nIndex]; nIndex++)
		aHtml[aHtml.length]	= oNode.$getTag();
	return aHtml.join('') + this.$getTagClose();
};

cAMLElement.prototype.$getTagOpen	= function()
{
	return '';
};

cAMLElement.prototype.$getTagClose	= function()
{
	return '';
};

/*
cAMLElement.prototype.$getContainer	= function(sName) {
	var sId	= this.uniqueID + (sName ? '_' + sName : '');
    if (!this.$cache)
    	this.$cache	= {};
    return this.$cache[sId] ||(this.$cache[sId] = oUADocument.getElementById(sId));
};
*/
/*
cAMLElement.prototype.$getContainer	= function(sName)
{
   	return oUADocument.getElementById(this.uniqueID + (sName ? '_' + sName : ''));
};
*/

function fAMLElement_getBoundingClientRect(oElement, sPseudo)
{
    var oElementDOM	= oElement.$getContainer(sPseudo),
		oClientRect	= oElementDOM.getBoundingClientRect ? oElementDOM.getBoundingClientRect() : null,
		oRectangle	= {},
		oNode,
		nLeft	= 0,
		nTop	= 0,
		nRight,
		nBottom;

	// if 'getBoundingClientRect' is supported in the given browser
	if (oClientRect) {
		nLeft	= oClientRect.left;
		nTop	= oClientRect.top;
		nRight	= oClientRect.right;
		nBottom	= oClientRect.bottom;
	}
	else {
		// Calculate offsets
		for (oNode = oElementDOM; oNode; oNode = oNode.offsetParent) {
			nLeft	+= oNode.offsetLeft;
			nTop	+= oNode.offsetTop;
		}
	    for (oNode = oElementDOM; oNode.nodeType == 1; oNode = oNode.parentNode) {
	    	nLeft	-= oNode.scrollLeft;
	    	nTop	-= oNode.scrollTop;
		}
	    //
		nRight	= nLeft + oElementDOM.offsetWidth;
		nBottom	= nTop + oElementDOM.offsetHeight;
	}
	oRectangle.left		= nLeft;
	oRectangle.top		= nTop;
	oRectangle.right	= nRight;
	oRectangle.bottom	= nBottom;

	return oRectangle;
};

cAMLElement.prototype.getBoundingClientRect	= function(sPseudo)
{
	return fAMLElement_getBoundingClientRect(this, sPseudo || null);
};
/*
cAMLElement.prototype.$getContainer	= function(sName)
{
	var sShadow	= '#' +(sName || ''),
		oCache	= oAML_shadow[this.uniqueID] ||(oAML_shadow[this.uniqueID] = {});

	if (sShadow in oCache)
		return oCache[sShadow];
	else {
		var oNode	= oUADocument.getElementById(this.attributes.id || this.uniqueID);
		if (sName && oNode) {
			var rClass	= new cRegExp('--' + sName + '(\\s|$)');
			oNode	= (function (oContext, oNode) {
				for (var nIndex = 0, aNodes = oNode.childNodes, oElement, sClass; oNode = aNodes[nIndex]; nIndex++)
					if (oNode.nodeType == 1 && !oNode.id) {
						// If pseudo-element
						if ((sClass = oNode.className) && sClass.match(rClass))
							return oNode;
						// Check children
						if (oElement = arguments.callee(oContext, oNode))
							return oElement;
					}
				return null;
			})(this, oNode);
		}
		return oCache[sShadow]	= oNode;
	}
};
*/
function fAMLElement_getContainerTraverse(oNode, rClass)
{
	for (var nIndex = 0, aChildNodes = oNode.childNodes, sClass; oNode = aChildNodes[nIndex]; nIndex++)
		if (oNode.nodeType == 1) {
			// If pseudo-element
			if ((sClass =(bTrident && nVersion < 8 ? oNode.className : oNode.getAttribute("class"))) && sClass.match(rClass))
				return oNode;
			// Check children
			if (!oNode.id &&(oNode = fAMLElement_getContainerTraverse(oNode, rClass)))
				return oNode;
		}
	return null;
};

cAMLElement.prototype.$getContainer	= function(sName)
{
	var oElement	= oUADocument.getElementById(this.attributes.id || this.uniqueID);
	if (sName && oElement)
		return fAMLElement_getContainerTraverse(oElement, new cRegExp('--' + sName + '(\\s|$)'));
	return oElement;
};

/*
function fAMLElement_setPseudoClass(oElement, sName, bValue, sContainer)
{
	var oElementDOM	= oElement.$getContainer(sContainer);
    oElementDOM.className	= oElementDOM.className.replace(/(\w+-[a-z\-]+)?_(\w+)?/ig, '$1_' + (bValue ? sName : ''));
};
*/
/*
function fAMLElement_addClass(oElement, sClass) {
	if (!fAMLElement_hasClass(oElement, sClass))
		oElement.className += ' ' + sClass;
};

function fAMLElement_hasClass(oElement, sClass) {
	return oElement.className.match(fAMLElement_getRegExp(sClass));
};

function fAMLElement_removeClass(oElement, sClass) {
	if (fAMLElement_hasClass(oElement, sClass))
		oElement.className	= oElement.className.replace(fAMLElement_getRegExp(sClass), ' ');
};
*/

var oAMLElement_cache	= {};
function fAMLElement_getRegExp(sName, sContainer) {
	return	oAMLElement_cache[sName + sContainer]
		?	oAMLElement_cache[sName + sContainer]
		:	oAMLElement_cache[sName + sContainer] = new cRegExp('(^|\\s)[-\\w]*' + sContainer + '(_\\w+)?' + '_' + sName + '(_\\w+)?' + '(|$)', 'g');
};

function fAMLElement_setPseudoClass(oElement, sName, bValue, sContainer)
{
	var oElementDOM	= oElement.$getContainer(sContainer),
		sClass		= fAMLElement_getAttribute(oElement, "class").trim(),
		aClass		= sClass.length ? sClass.split(/\s+/g) : null,
		sPseudoName	= sContainer ? '--' + sContainer : '',
		sTagName	=(oElement.prefix ? oElement.prefix + '-' : '') + oElement.localName;

//->Source
//console.warn("processing: " + oElement.tagName + ' ' + sName + '(' + (bValue ? 'true' : 'false') + ')');
//console.log("before: ", oElementDOM.className);
//<-Source
	if (oElementDOM) {
		var sOldName= bTrident && nVersion < 8 ? oElementDOM.className : oElementDOM.getAttribute("class") || '',
			bMatch	= sOldName.match(fAMLElement_getRegExp(sName, sPseudoName)),
			sPseudo,
			sClass,
			sNewName;
		if (bValue) {
			// Add class
			if (!bMatch) {
				var aPseudo	= sOldName.replace(/_\w+_\w+/g, '').match(/_\w+/g),
					aNewName= [];
				// create pair combinations :hover:focus, :focus:hover
				if (aPseudo)
					for (var nIndex = 0, nLength = aPseudo.length, oCache = {}; nIndex < nLength; nIndex++) {
						sPseudo	= aPseudo[nIndex];
						if (!oCache[sPseudo]) {
							if (aClass)
								for (var nClass = 0; nClass < aClass.length; nClass++) {
									sClass	= aClass[nClass];
									aNewName.push(	// ns|element.class(::pseudo-element)?:pseudo-class:pseudo-class2
													' ' + sTagName + '-' + sClass + sPseudoName + '_' + sName + sPseudo +
													// ns|element.class(::pseudo-element)?:pseudo-class2:pseudo-class
													' ' + sTagName + '-' + sClass + sPseudoName + sPseudo + '_' + sName +
													// .class(::pseudo-element)?:pseudo-class:pseudo-class2
													' ' + sClass + sPseudoName + '_' + sName + sPseudo +
													// .class(::pseudo-element)?:pseudo-class2:pseudo-class
													' ' + sClass + sPseudoName + sPseudo + '_' + sName);
								}
							// ns|element(::pseudo-element)?:pseudo-class:pseudo-class2
							aNewName.push(	' ' + sTagName + sPseudoName + '_' + sName + sPseudo);
							// ns|element(::pseudo-element)?:pseudo-class2:pseudo-class
							aNewName.push(	' ' + sTagName + sPseudoName + sPseudo + '_' + sName);
							// indicate class name processed
							oCache[sPseudo]	= true;
						}
					}
				if (aClass)
					for (var nClass = 0; nClass < aClass.length; nClass++) {
						sClass	= aClass[nClass];
						aNewName.push(	// ns|element.class(::pseudo-element)?:pseudo-class
										' ' + sTagName + '-' + sClass + sPseudoName + '_' + sName +
										// .class(::pseudo-element)?:pseudo-class
									  	' ' + sClass + sPseudoName + '_' + sName);
					}
				// ns|element(::pseudo-element)?:pseudo-class
				aNewName.push(	' ' + sTagName + sPseudoName + '_' + sName);
				sNewName	= aNewName.join('');
				if (bTrident && nVersion < 8)
					oElementDOM.className += sNewName;
				else
					oElementDOM.setAttribute("class", sOldName + sNewName);
			}
		}
		else {
			// Remove class
			if (bMatch) {
				// remove all classes having :pseudo-class
				sNewName	= sOldName.replace(fAMLElement_getRegExp(sName, sPseudoName), '');	// TODO: Remove space?
				if (bTrident && nVersion < 8)
					oElementDOM.className	= sNewName;
				else
					oElementDOM.setAttribute("class", sNewName);
			}
		}
	}
//->Debug
	else
		fAML_warn(nAML_NOT_FOUND_SHADOW_WRN, [oElement.tagName, sContainer || '']);
//<-Debug

//->Source
//console.log("after: ", oElementDOM.className);
//<-Source
};

// Attaching to implementation
cAMLElement.prototype.$setPseudoClass	= function(sName, bState, sContainer)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString],
		["state",	cBoolean],
		["pseudoElement",	cString, true]
	]);

	fAMLElement_setPseudoClass(this, sName, bState, sContainer);
};

// Content Loader
function fAMLElement_load(oElement, sUrl, sMethod, oHeaders, sData)
{
	// If there is an operation running, abort it
	fAMLElement_abort(oElement);

	// Dispatch unload event
	var oEvent	= new cAMLEvent;
	oEvent.initEvent("unload", false, false);
	fAMLNode_dispatchEvent(oElement, oEvent);

	// Remove nodes
	while (oElement.lastChild)
		fAMLElement_removeChild(oElement, oElement.lastChild);

	// Do timeout before loading
	oElement._timeout	= fSetTimeout(function(){fAMLElement_onTimeOut(oElement, sUrl, oHeaders, sMethod, sData)}, 1);
	oElement._request	= null;
};

function fAMLElement_onTimeOut(oElement, sUrl, oHeaders, sMethod, sData)
{
	// Create request
	var oRequest	= new cXMLHttpRequest;
	oRequest['on' + "readystatechange"]	= function(){fAMLElement_onReadyStateChange(oRequest, oElement)};
	oRequest.open(sMethod, sUrl, true);
	oHeaders["X-Requested-With"]	= "XMLHttpRequest";
	oHeaders["X-User-Agent"]		= oAMLConfiguration_values["ample-user-agent"];
	for (var sHeader in oHeaders)
		if (oHeaders.hasOwnProperty(sHeader))
			oRequest.setRequestHeader(sHeader, oHeaders[sHeader]);
	oRequest.send(sData);

	// Save in order to be able to cancel
	oElement._timeout	= null;
	oElement._request	= oRequest;
};

function fAMLElement_onReadyStateChange(oRequest, oElement)
{
	if (oRequest.readyState == 4)
	{
		// Clear
		fAMLElement_clear(oElement);

	    var oDocument	= fAML_getResponseDocument(oRequest),
			oEvent		= new cAMLEvent;
	    if (oDocument)
	    {
			// Render Content
	    	fAMLElement_appendChild(oElement, fAML_import(oDocument.documentElement, null));
			// Initialize event
			oEvent.initEvent("load", false, false);
	    }
	    else
	    {
//->Debug
			fAML_warn(nAML_NOT_WELLFORMED_WRN);
//<-Debug

			// Initialize event
			oEvent.initEvent("error", false, false);
	    }
		// Dispatch event
		fAMLNode_dispatchEvent(oElement, oEvent);
	}
};

function fAMLElement_clear(oElement)
{
	if (oElement._request) {
		oElement._request['on' + "readystatechange"]	= new cFunction;
	    delete oElement._request;
	}
	if (oElement._timeout) {
		fClearTimeout(oElement._timeout);
		delete oElement._timeout;
	}
};

function fAMLElement_abort(oElement)
{
	if (oElement._timeout || oElement._request) {
		if (oElement._request)
			oElement._request	= oElement._request.abort();
		fAMLElement_clear(oElement);

		// Dispatch abort event
		var oEvent	= new cAMLEvent;
		oEvent.initEvent("abort", false, false);
		fAMLNode_dispatchEvent(oElement, oEvent);
	}
};

cAMLElement.prototype.$load		= function(sUrl, sMethod, oHeaders, sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["url",		cString],
		["method",	cString, true, true],
		["headers",	cObject, true, true],
		["data",	cString, true, true]
	]);

	fAMLElement_load(this, sUrl, sMethod || "GET", oHeaders || {}, sData || null);
};

cAMLElement.prototype.$abort	= function()
{
	fAMLElement_abort(this);
};

cAMLElement.prototype.scrollIntoView	= function(bTop) {
	// Validate arguments
	fAML_validate(arguments, [
		["top",	cBoolean, true, false]	// Optional, null is not allowed
	]);

	var oElementDOM	= this.$getContainer();
	if (oElementDOM) {
		if (oElementDOM.scrollIntoView)
			oElementDOM.scrollIntoView(bTop || false);
		else {
			// TODO: Implement. FF for example doesn't support it on SVG elements
		}
	}
};

/*
cAMLElement.prototype.$getPseudoElement	= function(sName)
{
   	return this.$getContainer(sName);
};
*/
