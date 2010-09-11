/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tabs	= function() {
    // Collections
    this.items      = new AMLNodeList;
};
cXULElement_tabs.prototype   = new cXULElement("tabs");

// Accessibility
cXULElement_tabs.prototype.tabIndex	= 0;
cXULElement_tabs.prototype.$selectable	= false;

// Public Properties
cXULElement_tabs.prototype.selectedIndex	=-1;    // Not implemented
cXULElement_tabs.prototype.selectedItem		= null; // Not implemented

// Public Methods
cXULElement_tabs.prototype.advanceSelectedTab    = function(nDir) {
    if (nDir == 1)
        this.goTo(this.parentNode.selectedIndex + 1);
    else
    if (nDir ==-1)
        this.goTo(this.parentNode.selectedIndex - 1);
};

cXULElement_tabs.prototype.goTo      = function(nIndex) {
    // TODO
    if (this.parentNode.selectedIndex != nIndex && this.items[nIndex]) {
        // send onselect event
        var oEvent  = this.ownerDocument.createEvent("Events");
        oEvent.initEvent("beforeselect", false, true);
        if (this.dispatchEvent(oEvent) == false)
            return;

        // Deselect old tab
        if (this.parentNode.selectedTab)
            this.parentNode.selectedTab.setAttribute("selected", "false");
        if (this.parentNode.selectedPanel)
            this.parentNode.selectedPanel.setAttribute("hidden", "true");

        // Select new tab
        this.parentNode.selectedTab      = this.items[nIndex];
        this.parentNode.selectedTab.setAttribute("selected", "true");
        if (this.parentNode.tabpanels && this.parentNode.tabpanels.items[nIndex]) {
            this.parentNode.selectedPanel    = this.parentNode.tabpanels.items[nIndex];
            this.parentNode.selectedPanel.setAttribute("hidden", "false");
        }

        this.parentNode.selectedIndex    = nIndex;

        // send onselect event
        var oEvent  = this.ownerDocument.createEvent("Events");
        oEvent.initEvent("select", false, true);
        this.dispatchEvent(oEvent);
    }
};

cXULElement_tabs.prototype.appendItem    = function(sLabel, sValue) {
    this.insertItemAt(this.items.length, sLabel, sValue);
};

cXULElement_tabs.prototype.insertItemAt  = function(nIndex, sLabel, sValue) {
    // TODO
};

cXULElement_tabs.prototype.removeItemAt  = function(nIndex) {
    // TODO
};

// Class events handlers
cXULElement_tabs.handlers	= {
	"keydown":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
			case "Left":
				var oTabBox	= this.parentNode;
				if (oTabBox.selectedTab && oTabBox.selectedTab.previousSibling)
					oTabBox.selectedTab.previousSibling.$activate();
				break;

			case "Right":
				var oTabBox	= this.parentNode;
				if (oTabBox.selectedTab && oTabBox.selectedTab.nextSibling)
					oTabBox.selectedTab.nextSibling.$activate();
				break;
		}
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabbox)
			this.parentNode.tabs = this;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabbox)
			this.parentNode.tabs = null;
	}
};

// Element Render: open
cXULElement_tabs.prototype.$getTagOpen	= function() {
	return '<div class="xul-tabs">\
    			<table class="xul-tabs--table" cellpadding="0" cellspacing="0" border="0">\
					<tbody>\
						<tr class="xul-tabs--gateway">\
							<td class="xul-tab-separator"><img width="1" height="1" /></td>';
};

// Element Render: close
cXULElement_tabs.prototype.$getTagClose	= function() {
	return '				<td class="xul-tab-remainder"><img width="1" height="1" /></td>\
						</tr>\
					</tbody>\
				</table>\
			</div>';
};

// Register Element
ample.extend(cXULElement_tabs);
