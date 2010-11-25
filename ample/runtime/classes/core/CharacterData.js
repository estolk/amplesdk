/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cCharacterData	= function(){};

cCharacterData.prototype	= new cNode;

// nsIDOMCharacterData
cCharacterData.prototype.data	= null;
cCharacterData.prototype.length	= 0;

function fCharacterData_appendData(oNode, sData)
{
	var sValueOld	= oNode.data;
	oNode.data		+= sData;
	oNode.length	= oNode.data.length;
	oNode.nodeValue	= oNode.data;

	// Fire Mutation event
    if (sValueOld != oNode.data) {
	    var oEvent = new cMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, oNode.data, null, null);
	    fNode_dispatchEvent(oNode, oEvent);
	}
};

cCharacterData.prototype.appendData	= function(sData)
{
//->Guard
	fGuard(arguments, [
		["data",	cString]
	]);
//<-Guard
	fCharacterData_appendData(this, sData);
};

function fCharacterData_deleteData(oNode, nOffset, nLength)
{
	var sValueOld	= oNode.data;
	oNode.data		= oNode.data.substring(0, nOffset) + oNode.data.substring(nOffset, nOffset + nLength);
	oNode.length	= oNode.data.length;
	oNode.nodeValue	= oNode.data;

	// Fire Mutation event
    if (sValueOld != oNode.data) {
	    var oEvent = new cMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, oNode.data, null, null);
	    fNode_dispatchEvent(oNode, oEvent);
	}
};

cCharacterData.prototype.deleteData	= function(nOffset, nLength)
{
//->Guard
	fGuard(arguments, [
		["offset",	cNumber],
		["length",	cNumber]
	]);
//<-Guard
	if (nOffset <= this.length && nOffset >= 0 && nLength >= 0)
		fCharacterData_deleteData(this, nOffset, nLength);
	else
		throw new cDOMException(cDOMException.INDEX_SIZE_ERR);
};

function fCharacterData_insertData(oNode, nOffset, sData)
{
	var sValueOld	= oNode.data;
	oNode.data		= oNode.data.substring(0, nOffset) + sData + oNode.data.substring(nOffset);
	oNode.length	= oNode.data.length;
	oNode.nodeValue	= oNode.data;

	// Fire Mutation event
    if (sValueOld != oNode.data) {
	    var oEvent = new cMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, oNode.data, null, null);
	    fNode_dispatchEvent(oNode, oEvent);
	}
};

cCharacterData.prototype.insertData	= function(nOffset, sData)
{
//->Guard
	fGuard(arguments, [
		["offset",	cNumber],
		["data",	cString]
	]);
//<-Guard
	if (nOffset <= this.length && nOffset >= 0)
		fCharacterData_insertData(this, nOffset, sData);
	else
		throw new cDOMException(cDOMException.INDEX_SIZE_ERR);
};

function fCharacterData_replaceData(oNode, nOffset, nLength, sData)
{
	var sValueOld	= oNode.data;
	oNode.data		= oNode.data.substring(0, nOffset) + sData + oNode.data.substring(nOffset + nLength);
	oNode.length	= oNode.data.length;
	oNode.nodeValue	= oNode.data;

	// Fire Mutation event
    if (sValueOld != oNode.data) {
	    var oEvent = new cMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, oNode.data, null, null);
	    fNode_dispatchEvent(oNode, oEvent);
	}
};

cCharacterData.prototype.replaceData	= function(nOffset, nLength, sData)
{
//->Guard
	fGuard(arguments, [
		["offset",	cNumber],
		["length",	cNumber],
		["data",	cString]
	]);
//<-Guard
	if (nOffset <= this.length && nOffset >= 0 && nLength >= 0)
		fCharacterData_replaceData(this, nOffset, nLength, sData);
	else
		throw new cDOMException(cDOMException.INDEX_SIZE_ERR);
};

function fCharacterData_substringData(oNode, nOffset, nLength)
{
	return this.data.substring(nOffset, nOffset + nLength);
};

cCharacterData.prototype.substringData	= function(nOffset, nLength)
{
//->Guard
	fGuard(arguments, [
		["offset",	cNumber],
		["length",	cNumber]
	]);
//<-Guard
	if (nOffset <= this.length && nOffset >= 0 && nLength >= 0)
		return fCharacterData_substringData(this, nOffset, nLength);
	else
		throw new cDOMException(cDOMException.INDEX_SIZE_ERR);
};

cCharacterData.prototype.$getContainer	= function()
{
	var oParent	= this.parentNode,
		oGateway;
	return oParent &&(oGateway =(oParent.$getContainer("gateway") || oParent.$getContainer())) ? oGateway.childNodes[oParent.childNodes.$indexOf(this)] : null;
};
