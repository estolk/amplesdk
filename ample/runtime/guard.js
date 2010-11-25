/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

/*
 * Syntaxis:
 * fGuard(arguments, [
 * 		[sArgumentName,	cArgumentType, bOptional, bNullAllowed]
 * ]);
 */
//->Debug
var oGuard_endings	= 'st-nd-rd-th'.split('-'),
	rGuard_function	= /function ([^\s]+)\(/,
	oGuard_types	= fUtilities_stringToHash('0:Node;1:Element;9:Document');
//<-Debug

//->Guard
function fGuard(aArguments, aParameters, oObject) {
	if (!oDOMConfiguration_values["ample-enable-guard"])
		return;

	var fCallee	= aArguments.callee,
		fCaller	= null;
	// Has to be wrapped in try/catch because Firebug throws "Permission denied to get property on Function.caller" in XMLHttpRequest
	try {
		fCaller	= fCallee.caller;
	} catch (oException) {}
//->Debug
	var sFunction	= cString(fCallee).match(rGuard_function) ? cRegExp.$1 : "anonymous";
//<-Debug

	// Check constructor
	if (oObject && fCaller && oObject instanceof fCaller)
		throw new cDOMException(cDOMException.GUARD_CANNOT_ACCESS_DOM_ERR, fCaller);

	// Iterate over parameters list
	for (var nIndex = 0, nLength = aArguments.length, aParameter, vValue; aParameter = aParameters[nIndex]; nIndex++) {
		vValue	= aArguments[nIndex];
//->Debug
		var sArgument	=(nIndex + 1)+ oGuard_endings[nIndex < 3 ? nIndex : 3];
//<-Debug
		// see if argument is missing
		if (typeof vValue == "undefined" && !aParameter[2])
			throw new cDOMException(cDOMException.GUARD_ARGUMENT_MISSING_ERR, fCaller
//->Debug
								, [sArgument, aParameter[0], sFunction]
//<-Debug
			);

		if (nLength > nIndex) {
			if (vValue === null) {
				// See if null is allowed
				if (!aParameter[3])
					throw new cDOMException(cDOMException.GUARD_ARGUMENT_NULL_ERR, fCaller
//->Debug
										, [sArgument, aParameter[0], sFunction]
//<-Debug
					);
			}
			else
			// see if argument has correct type
			if (!fGuard_instanceOf(vValue, aParameter[1]))
				throw new cDOMException(cDOMException.GUARD_ARGUMENT_WRONG_TYPE_ERR, fCaller
//->Debug
									, [sArgument, aParameter[0], sFunction, oGuard_types[aParameter[1]] ||(cString(aParameter[1]).match(rGuard_function) ? cRegExp.$1 : "anonymous")]
//<-Debug
				);
		}
	}
};
//<-Guard

function fGuard_instanceOf(vValue, cType) {
	var sType	= typeof vValue;
	switch (cType) {
		// Primitive types
		case cString:
			return sType == "string" || vValue instanceof cType;
		case cBoolean:
			return sType == "boolean" || vValue instanceof cType;
		case cNumber:
			return(sType == "number" || vValue instanceof cType) &&!fIsNaN(vValue);
		// Virtual types
		case cXMLNode:
			return vValue &&!fIsNaN(vValue.nodeType);
		case cXMLElement:
			return vValue && vValue.nodeType == 1;
		case cXMLDocument:
			return vValue && vValue.nodeType == 9;
		// Special type Arguments (pseudo type for JavaScript arguments object)
		case cArguments:
			return sType == "object" && "callee" in vValue;
		// Object and Complex types
		default:
			return cType == cObject ? true : vValue instanceof cType;
	}
};
/*
function fGuard_typeof(vValue) {
	if (typeof vValue == "string" || vValue instanceof cString)
		return cString;
	else
	if (typeof vValue == "boolean" || vValue instanceof cBoolean)
		return cBoolean;
	else
	if (typeof vValue == "number" || vValue instanceof cNumber)
		return cNumber;
	else
	if (typeof vValue == "object" && "callee" in vValue)
		return cArguments;
	else
		return vValue.constructor;
};
*/