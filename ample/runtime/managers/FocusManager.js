/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Properties
var oFocusManager_focusGroup	= null;

//
function fFocusManager_focus(oElement) {
	if (oElement != oFocusManager_focusGroup) {
		// Blur old element
		if (oFocusManager_focusGroup)
			fFocusManager_blur(oFocusManager_focusGroup);

		// Focus element
		if (oDocument_all[oElement.uniqueID]) {
			// Set active element
			oFocusManager_focusGroup	= oElement;

			// Set document active element
			oAmple.activeElement	= oElement;

			// Add :focus pseudo-class
			fElement_setPseudoClass(oElement, "focus", true);

			var oEvent	= new cFocusEvent;
			oEvent.initFocusEvent("focus", false, false, window, null, null);
			fNode_dispatchEvent(oElement, oEvent);

			var oEvent	= new cFocusEvent;
			oEvent.initFocusEvent("DOMFocusIn", true, false, window, null, null);
			fNode_dispatchEvent(oElement, oEvent);
		}
	}
};

function fFocusManager_blur(oElement) {
	if (oElement == oFocusManager_focusGroup) {
		// Blur element
		if (oDocument_all[oElement.uniqueID]) {
			// Unset active element
			oFocusManager_focusGroup	= null;

			// Unset document active element
			oAmple.activeElement	= oBrowser_modalNode || oAmple_root;

			// Remove :focus pseudo-class
			fElement_setPseudoClass(oElement, "focus", false);

			// If element has not been removed from DOM
			var oEvent	= new cFocusEvent;
			oEvent.initFocusEvent("blur", false, false, window, null, null);
			fNode_dispatchEvent(oElement, oEvent);

			var oEvent	= new cFocusEvent;
			oEvent.initFocusEvent("DOMFocusOut", true, false, window, null, null);
			fNode_dispatchEvent(oElement, oEvent);
		}
	}
};

/* Focus Group */
function fFocusManager_getFocusGroupNext(oElement, nTabIndex) {
	for (var oParent = oElement, oFocusGroup/*, aChildren*/; oParent; oParent = oParent.parentNode) {
		if (oParent == oElement) {
			if (oParent.firstChild && (oFocusGroup = fFocusManager_getFocusGroupNextChild(oParent.firstChild, nTabIndex)))
				return oFocusGroup;
			if (oParent.contentFragment && (oFocusGroup = fFocusManager_getFocusGroupNextChild(oParent.contentFragment.firstChild, nTabIndex)))
				return oFocusGroup;
//			if ((aChildren = oParent.$childNodesAnonymous) && aChildren.length &&(oFocusGroup = fFocusManager_getFocusGroupNextChild(aChildren[0], nTabIndex, true)))
//				return oFocusGroup;
		}
		if (oParent == oBrowser_modalNode)
			break;
		if (oParent.nextSibling && (oFocusGroup = fFocusManager_getFocusGroupNextChild(oParent.nextSibling, nTabIndex)))
			return oFocusGroup;
	}
};

function fFocusManager_getFocusGroupNextChild(oElement, nTabIndex, bDeep) {
	for (var oSibling = oElement, oFocusGroup/*, aChildren*/; oSibling; oSibling = oSibling.nextSibling) {
		if (fFocusManager_isTabStop(oSibling, nTabIndex, bDeep))
			return oSibling;
		else
		if (oSibling.contentFragment && (oFocusGroup = fFocusManager_getFocusGroupNextChild(oSibling.contentFragment.firstChild, nTabIndex)))
			return oFocusGroup;
		else
		if (oSibling.firstChild && (oFocusGroup = fFocusManager_getFocusGroupNextChild(oSibling.firstChild, nTabIndex)))
			return oFocusGroup;
//		else
		/* Walk into the anonymous tree */
//		if ((aChildren = oSibling.$childNodesAnonymous) && aChildren.length &&(oFocusGroup = fFocusManager_getFocusGroupNextChild(aChildren[0], nTabIndex, true)))
//			return oFocusGroup;
	}
};

function fFocusManager_getFocusGroupPrevious(oElement, nTabIndex) {
	for (var oParent = oElement, oFocusGroup/*, aChildren*/; oParent; oParent = oParent.parentNode) {
		if (oParent != oElement) {
			if (fFocusManager_isTabStop(oParent, nTabIndex))
				return oParent;
//			if (oParent.contentFragment &&(oFocusGroup = fFocusManager_getFocusGroupPreviousChild(oParent.contentFragment.lastChild, nTabIndex)))
//				return oFocusGroup;
//			if ((aChildren = oParent.$childNodesAnonymous) && aChildren.length &&(oFocusGroup = fFocusManager_getFocusGroupPreviousChild(aChildren[aChildren.length - 1], nTabIndex, true)))
//				return oFocusGroup;
		}
		if (oParent == oBrowser_modalNode)
			break;
		if (oParent.previousSibling && (oFocusGroup = fFocusManager_getFocusGroupPreviousChild(oParent.previousSibling, nTabIndex)))
			return oFocusGroup;
	}
};

function fFocusManager_getFocusGroupPreviousChild(oElement, nTabIndex, bDeep) {
	for (var oSibling = oElement, oFocusGroup/*, aChildren*/; oSibling; oSibling = oSibling.previousSibling)
		/* Walk into the anonymous tree */
//		if ((aChildren = oSibling.$childNodesAnonymous) && aChildren.length &&(oFocusGroup = fFocusManager_getFocusGroupPreviousChild(aChildren[aChildren.length-1], nTabIndex, true)))
//			return oFocusGroup;
//		else
		if (oSibling.contentFragment &&(oFocusGroup = fFocusManager_getFocusGroupPreviousChild(oSibling.contentFragment.lastChild, nTabIndex)))
			return oFocusGroup;
		else
		if (oSibling.lastChild && (oFocusGroup = fFocusManager_getFocusGroupPreviousChild(oSibling.lastChild, nTabIndex)))
			return oFocusGroup;
		else
		if (fFocusManager_isTabStop(oSibling, nTabIndex, bDeep))
			return oSibling;
};

function fFocusManager_isTabStop(oElement, nTabIndex, bDeep) {
	return oElement.tabIndex >-1 && (bDeep || oElement.tabIndex == nTabIndex) && oElement.$isAccessible() && fFocusManager_isVisible(oElement);
};

function fFocusManager_isVisible(oElement) {
	// Algorythm 2 (faster but ignores visibility:hidden and will fail if this style was used)
	for (var oElementDOM; oElement.nodeType != 9 /* cNode.DOCUMENT_NODE */; oElement = oElement.parentNode)
		if (oElementDOM = oElement.$getContainer())
			return oElementDOM.offsetHeight > 0;

	// Algorythm 1
//	for (var oElementDOM = oElement.$getContainer(); oElementDOM.nodeType != 9 /* cNode.DOCUMENT_NODE */; oElementDOM = oElementDOM.parentNode)
//		if (fBrowser_getComputedStyle(oElementDOM).display == "none")
//			return false;
	return true;
};

function fFocusManager_onMouseDown(oEvent) {
	// Check if default action is prevented
	if (oEvent.defaultPrevented)
		return;

	// Find new element to focus
	var oFocusGroup	= null;
    for (var oElement = oEvent.target; oElement.nodeType != 9 /* cNode.DOCUMENT_NODE */ && !oFocusGroup; oElement = oElement.parentNode)
    	if (fFocusManager_isTabStop(oElement, 0, true))
    		oFocusGroup = oElement;

	//
    if (oFocusGroup)
    	fFocusManager_focus(oFocusGroup);
    else
    if (oFocusManager_focusGroup)
		fFocusManager_blur(oFocusManager_focusGroup);
};

function fFocusManager_onKeyDown(oEvent) {
	// Check if default action is prevented
	if (oEvent.defaultPrevented)
		return;

	// Prevent system tab combinations handling
	if (oEvent.keyIdentifier == "Tab" && (oEvent.altKey || oEvent.ctrlKey))
		return;

	if (oEvent.keyIdentifier == "Tab") {
		var oFocusGroup	= null,
			nTabIndexCurrent	= 0;

		// If there are items with the same tabIndex value
		if (oFocusManager_focusGroup) {
			nTabIndexCurrent	= oFocusManager_focusGroup.tabIndex;
			if (oEvent.shiftKey)
				oFocusGroup	= fFocusManager_getFocusGroupPrevious(oFocusManager_focusGroup, nTabIndexCurrent);
			else
				oFocusGroup	= fFocusManager_getFocusGroupNext(oFocusManager_focusGroup, nTabIndexCurrent);
		}

		// Otherwise
		if (!oFocusGroup) {
			var oRoot	= oBrowser_modalNode || this.documentElement,
				nTabIndexMax	=-nInfinity,
				nTabIndexMin	= nInfinity,
				nTabIndexNext	= nTabIndexMin,
				nTabIndexPrev	= nTabIndexMax;

			for (var nIndex = 0, nTabIndex, oElement, aElements = fElement_getElementsByTagName(oRoot, '*'); oElement = aElements[nIndex]; nIndex++) {
				nTabIndex	= oElement.tabIndex;
				if (nTabIndex >-1) {
					if (nTabIndex > nTabIndexMax)
						nTabIndexMax	= nTabIndex;
					if (nTabIndex < nTabIndexMin)
						nTabIndexMin	= nTabIndex;
					if (nTabIndex < nTabIndexCurrent && nTabIndex > nTabIndexPrev)
						nTabIndexPrev	= nTabIndex;
					if (nTabIndex > nTabIndexCurrent && nTabIndex < nTabIndexNext)
						nTabIndexNext	= nTabIndex;
				}
			}
			if (nTabIndexNext == nInfinity)
				nTabIndexNext	= 0;
			if (nTabIndexPrev ==-nInfinity)
				nTabIndexPrev	= 0;
			//
			if (oEvent.shiftKey)
				oFocusGroup	= fFocusManager_getFocusGroupPreviousChild(oRoot, nTabIndexPrev) || fFocusManager_getFocusGroupPreviousChild(oRoot, nTabIndexMax);
			else
				oFocusGroup	= fFocusManager_getFocusGroupNextChild(oRoot, nTabIndexNext) ||fFocusManager_getFocusGroupNextChild(oRoot, nTabIndexMin);
		}

		// Use setTimeout to fix tabbed navigation in Opera)
/*	setTimeout(function() {  */
		// Focus new element
		if (oFocusGroup)
			fFocusManager_focus(oFocusGroup);
/*	}, 0);	*/
		// Prevents browser-based focus manager
		oEvent.preventDefault();
	}
};

// Attaching to implementation
cElement.prototype.tabIndex	=-1;

cElement.prototype.focus	= function() {
	fFocusManager_focus(this);
};

cElement.prototype.blur	= function() {
	fFocusManager_blur(this);
};

// Registering Event Handlers
fEventTarget_addEventListener(oAmple_document,	"mousedown",	fFocusManager_onMouseDown,	false);
fEventTarget_addEventListener(oAmple_document,	"keydown",		fFocusManager_onKeyDown,	false);
