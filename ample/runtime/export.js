/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var sAMLExporter_space	= new cArray(5).join(' ');
function fAMLExporter_toStringFunction(sName) {
	return cFunction('return "' + "function" + ' ' + sName + '()' + ' ' + '{\\n' + sAMLExporter_space + '[' + "ample" + ' ' + "code" + ']\\n}"');
};
function fAMLExporter_toStringObject(sName) {
	return cFunction('return "[' + "object" + ' ' + sName + ']"');
};
var fAMLExporter_toString	= fAMLExporter_toStringFunction("toString");
fAMLExporter_toString.toString	= fAMLExporter_toString;
function fAMLExporter_toStringMember(vObject, fToString) {
	if (!vObject.hasOwnProperty("toString")) {
		vObject.toString	= fToString;
		vObject.toString.toString	= fAMLExporter_toString;
	}
};
function fAMLExporter_wrap(vObject, sName) {
	fAMLExporter_toStringMember(vObject, (vObject instanceof cFunction ? fAMLExporter_toStringFunction : fAMLExporter_toStringObject)(sName));
	for (sName in vObject)
		if (vObject.hasOwnProperty(sName) && vObject[sName] instanceof cFunction)
			fAMLExporter_wrapMember(vObject[sName], sName);
};
function fAMLExporter_wrapMember(fFunction, sName) {
	fAMLExporter_toStringMember(fFunction, fAMLExporter_toStringFunction(sName));
};
function fAMLExporter_exportMember(oObject, fFunction, sName) {
	fAMLExporter_wrapMember(fFunction, sName);

	// publish to object
	oObject[sName]	= fFunction;
};
function fAMLExporter_export(cObject, sName) {
	// Class
	fAMLExporter_wrap(cObject, sName);
	if (cObject.prototype)	// Required in IE
		fAMLExporter_wrap(cObject.prototype, sName);

	// Publish to window
	window[sName]	= cObject;
};

// publish classes to window
// DOM-Events
fAMLExporter_export(cAMLEvent,				"AMLEvent");
fAMLExporter_export(cAMLCustomEvent,		"AMLCustomEvent");
fAMLExporter_export(cAMLUIEvent,			"AMLUIEvent");
fAMLExporter_export(cAMLTextEvent,			"AMLTextEvent");
fAMLExporter_export(cAMLKeyboardEvent,		"AMLKeyboardEvent");
fAMLExporter_export(cAMLMouseEvent,			"AMLMouseEvent");
fAMLExporter_export(cAMLMouseWheelEvent,	"AMLMouseWheelEvent");
fAMLExporter_export(cAMLMutationEvent,		"AMLMutationEvent");
// Touch/Gesture
fAMLExporter_export(cAMLGestureEvent,		"AMLGestureEvent");
fAMLExporter_export(cAMLTouchEvent,			"AMLTouchEvent");

// DOM-Core
fAMLExporter_export(cAMLStringList,			"AMLStringList");
fAMLExporter_export(cAMLNode,				"AMLNode");
fAMLExporter_export(cAMLAttr,				"AMLAttr");
fAMLExporter_export(cAMLCDATASection,		"AMLCDATASection");
fAMLExporter_export(cAMLCharacterData,		"AMLCharacterData");
fAMLExporter_export(cAMLComment,			"AMLComment");
fAMLExporter_export(cAMLConfiguration,		"AMLConfiguration");
fAMLExporter_export(cAMLDocument,			"AMLDocument");
fAMLExporter_export(cAMLDocumentFragment,	"AMLDocumentFragment");
fAMLExporter_export(cAMLElement, 			"AMLElement");
fAMLExporter_export(cAMLEntityReference,	"AMLEntityReference");
fAMLExporter_export(cAMLException,			"AMLException");
fAMLExporter_export(cAMLError, 				"AMLError");
fAMLExporter_export(cAMLImplementation,		"AMLImplementation");
fAMLExporter_export(cAMLNodeList,			"AMLNodeList");
fAMLExporter_export(cAMLProcessingInstruction,	"AMLProcessingInstruction");
fAMLExporter_export(cAMLText,				"AMLText");
// Touch/Gesture
fAMLExporter_export(cAMLTouch,				"AMLTouch");
fAMLExporter_export(cAMLTouchList,			"AMLTouchList");

// Ample objects
//fAMLExporter_export(cAMLNamespace,		"AMLNamespace");
fAMLExporter_export(cAMLQuery,			"AMLQuery");
//fAMLExporter_export(cAMLSerializer,	"AMLSerializer");
//fAMLExporter_export(cAMLTreeWalker,	"AMLTreeWalker");
//fAMLExporter_export(cAMLWindow,		"AMLWindow");
// Drag&Drop
fAMLExporter_export(cAMLDataTransfer,	"AMLDataTransfer");
fAMLExporter_export(cAMLDragEvent,		"AMLDragEvent");
// Resize
fAMLExporter_export(cAMLResizeEvent,	"AMLResizeEvent");
// History
fAMLExporter_export(cAMLHashChangeEvent,"AMLHashChangeEvent");
// Selectors
fAMLExporter_export(cAMLNodeSelector,	"AMLNodeSelector");
//->Source
//Range
fAMLExporter_export(cAMLRange,			"AMLRange");
//<-Source

// XML Objects
if (!window.DOMParser)
	fAMLExporter_export(cDOMParser,		"DOMParser");
if (!window.XMLSerializer)
	fAMLExporter_export(cXMLSerializer,	"XMLSerializer");
if (!window.XSLTProcessor)
	fAMLExporter_export(cXSLTProcessor,	"XSLTProcessor");
if (bTrident)
	fAMLExporter_export(cXMLHttpRequest,"XMLHttpRequest");
//fAMLExporter_export(cRPCClient,	"RPCClient");
//
//if (!window.JSONRequest)
//	fAMLExporter_export(cJSONRequest,	"JSONRequest");
//if (!window.SoapRequest)
//	fAMLExporter_export(cSoapRequest,	"SoapRequest");
if (!window.JSON)
	fAMLExporter_export(oJSON,	"JSON");

// Special virtual type
fAMLExporter_wrapMember(cArguments,	"Arguments");
// Tweaks and tricks
fAMLExporter_wrap(oAmple.prefixes,	"prefixes");
fAMLExporter_wrap(fAmple_resolver,	"resolver");
fAMLExporter_wrap(oAmple.documentElement.$getContainer,		"$getContainer");

//
fAMLExporter_export(oAmple,	"ample");

// JavaScript 1.5
if (!cArray.prototype.push)
	fAMLExporter_exportMember(cArray.prototype, function(vValue) {
		this[this.length]   = vValue;
		return this.length;
	}, "push");

if (!cArray.prototype.pop)
	fAMLExporter_exportMember(cArray.prototype, function() {
		var vValue  = this[this.length-1];
		this.length--;
		return vValue;
	}, "pop");

// JavaScript 1.6
//
if (!cArray.prototype.indexOf)
	fAMLExporter_exportMember(cArray.prototype, function(oElement, nIndex) {
		// Validate arguments
		fGuard(arguments, [
			["element",	cObject, false, true],
			["index",	cNumber, true, false]
		]);

		// adjust nIndex
		var nLength = this.length;
		if (nIndex == null) {
			nIndex = 0;
		} else {
			if (nIndex < 0)
				nIndex = nLength + nIndex;
			if (nIndex < 0)
				nIndex = 0;
		}
		// search
		for (var vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (vValue === oElement)
					return nIndex;
		return -1;
	}, "indexOf");

if (!cArray.prototype.lastIndexOf)
	fAMLExporter_exportMember(cArray.prototype, function(oElement, nIndex) {
		// Validate arguments
		fGuard(arguments, [
			["element",	cObject, false, true],
			["index",	cNumber, true, false]
		]);

		// adjust nIndex
		var nLength = this.length;
		if (nIndex == null) {
			nIndex = nLength - 1;
		} else {
			if (nIndex < 0)
				nIndex = nLength + nIndex;
			if (nIndex < 0)
				nIndex = -1;
			else
			if (nIndex >= nLength)
				nIndex = nLength - 1;
		}
		// search
		for (var vValue; nIndex >= 0; nIndex--)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (vValue === oElement)
					return nIndex;
		return -1;
	}, "lastIndexOf");

//
if (!cArray.prototype.filter)
	fAMLExporter_exportMember(cArray.prototype, function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, aResult = [], vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (fCallback.call(oReceiver, vValue, nIndex, this))
					aResult.push(vValue);
		return aResult;
	}, "filter");

if (!cArray.prototype.forEach)
	fAMLExporter_exportMember(cArray.prototype, function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				fCallback.call(oReceiver, vValue, nIndex, this);
	}, "forEach");

if (!cArray.prototype.every)
	fAMLExporter_exportMember(cArray.prototype, function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (!fCallback.call(oReceiver, vValue, nIndex, this))
					return false;
		return true;
	}, "every");

if (!cArray.prototype.map)
	fAMLExporter_exportMember(cArray.prototype, function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, aResult = new cArray(nLength), vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				aResult[nIndex] = fCallback.call(oReceiver, vValue, nIndex, this);
		return aResult;
	}, "map");

if (!cArray.prototype.some)
	fAMLExporter_exportMember(cArray.prototype, function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (fCallback.call(oReceiver, vValue, nIndex, this))
					return true;
		return false;
	}, "some");

// JavaScript 1.7
// generators, iterators, array comprehensions, let expressions, and destructuring assignment

// JavaScript 1.8
// Expression closures, Generator expressions
if (!cArray.prototype.reduce)
	fAMLExporter_exportMember(cArray.prototype, function(fCallback/*, initial*/) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction]
		]);

		var nLength = this.length >>> 0,
			nIndex	= 0,
			aValue;

		// no value to return if no initial value and an empty array
		if (nLength == 0 && arguments.length == 1)
			throw new cTypeError;

		if (arguments.length >= 2)
			aValue	= arguments[1];
		else {
			do {
				if (nIndex in this)	{
					aValue = this[nIndex++];
					break;
				}
				// if array contains no values, no initial value to return
				if (++nIndex >= nLength)
					throw new cTypeError;
			}
			while (true);
		}

		for (; nIndex < nLength; nIndex++)
			if (nIndex in this)
				aValue = fCallback.call(null, aValue, this[nIndex], nIndex, this);

		return aValue;
	}, "reduce");

if (!cArray.prototype.reduceRight)
	fAMLExporter_exportMember(cArray.prototype, function(fCallback/*, initial*/) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction]
		]);

		var nLength = this.length >>> 0,
			nIndex	= nLength - 1,
			aValue;
		// no value to return if no initial value and an empty array
		if (nLength == 0 && arguments.length == 1)
			throw new cTypeError;

		if (arguments.length >= 2)
			aValue	= arguments[1];
		else {
			do {
				if (nIndex in this)	{
					aValue = this[nIndex--];
					break;
				}
				// if array contains no values, no initial value to return
				if (--nIndex < nLength)
					throw new cTypeError;
			}
			while (true);
		}

		for (; nIndex >= 0; nIndex--)
			if (nIndex in this)
				aValue = fCallback.call(null, aValue, this[nIndex], nIndex, this);

		return aValue;
	}, "reduceRight");

// JavaScript 1.8.1
// Object.getPrototypeOf(), Native JSON, String methods
if (!cString.prototype.trim)
	fAMLExporter_exportMember(cString.prototype, function() {
		return this.replace(/^\s+|\s+$/g, '');
	}, "trim");

if (!cString.prototype.trimLeft)
	fAMLExporter_exportMember(cString.prototype, function(fCallback, oReceiver) {
		return this.replace(/^\s+/, '');
	}, "trimLeft");

if (!cString.prototype.trimRight)
	fAMLExporter_exportMember(cString.prototype, function(fCallback, oReceiver) {
		return this.replace(/\s+$/, '');
	}, "trimRight");

// JSON
function fJSON_doublizeInteger(n) {
	// Format integers to have at least two digits.
	return n < 10 ? '0' + n : n;
};

if (!cDate.prototype.toJSON)
	fAMLExporter_exportMember(cDate.prototype, function(sKey) {
		return this.getUTCFullYear()	+ '-' +
			fJSON_doublizeInteger(this.getUTCMonth() + 1)	+ '-' +
			fJSON_doublizeInteger(this.getUTCDate())		+ 'T' +
			fJSON_doublizeInteger(this.getUTCHours())		+ ':' +
			fJSON_doublizeInteger(this.getUTCMinutes())		+ ':' +
			fJSON_doublizeInteger(this.getUTCSeconds())		+ 'Z';
	}, "toJSON");

if (!cString.prototype.toJSON)
	fAMLExporter_exportMember(cString.prototype, function(sKey) {
		return this.valueOf();
	}, "toJSON");

if (!cNumber.prototype.toJSON)
	fAMLExporter_exportMember(cNumber.prototype, function(sKey) {
		return this.valueOf();
	}, "toJSON");

if (!cBoolean.prototype.toJSON)
	fAMLExporter_exportMember(cBoolean.prototype, function(sKey) {
		return this.valueOf();
	}, "toJSON");
