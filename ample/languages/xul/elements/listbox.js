/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listbox	= function() {
    // Collections
    this.items  = new AMLNodeList;
	this.selectedItems	= new AMLNodeList;
};
cXULElement_listbox.prototype    = new cXULSelectElement("listbox");

//
cXULElement_listbox.prototype.head	= null; // Reference to oXULElement_listhead
cXULElement_listbox.prototype.body	= null; // Reference to oXULElement_listitems

// Public Methods

// Class Events Handlers
cXULElement_listbox.handlers	= {
	"keydown":	function(oEvent) {
	    if (this.currentItem) {
	        if (oEvent.keyIdentifier == "Up") {
	            // Key: Up
	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;
	            if (nIndex > 0) {
	                if (oEvent.shiftKey) {
	                    // Jump over the only selected item
	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex > this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex++;

	                    this.toggleItemSelection(this.items[nIndex-1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex-1]);

	                // Scroll to item if not visible
	                this.scrollToIndex(nIndex-1);
	            }

	            // Forbid vertical scrolling
	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Down") {
	            // Key: Down
	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;
	            if (nIndex < this.items.length-1) {
	                if (oEvent.shiftKey) {
	                    // Jump over the only selected item
	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex < this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex--;

	                    this.toggleItemSelection(this.items[nIndex+1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex+1]);

	                // Scroll to item if not visible
	                this.scrollToIndex(nIndex+1);
	            }

	            // Forbid vertical scrolling
	            oEvent.preventDefault();
	        }
    	}
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "disabled":
					this.$setPseudoClass("disabled", true);
					break;

				case "seltype":
					// TODO
					break;

				case "type":
					// TODO
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Static Methods
cXULElement_listbox.sort   = function(oInstance, nCell, bDir) {
    // correct for different types
    if (oInstance.attributes["type"] != "radio" && oInstance.attributes["type"] != "checkbox")
        nCell++;

    if (oInstance.items.length) {
		var aElements	= [];
		for (var nIndex = 0; nIndex < oInstance.items.length; nIndex++)
			aElements.push(oInstance.items[nIndex]);
		aElements.sort(function(oElement1, oElement2){return oElement1.cells[nCell-1].attributes["label"] > oElement2.cells[nCell-1].attributes["label"] ? bDir ? 1 :-1 : oElement1.cells[nCell-1].attributes["label"] == oElement2.cells[nCell-1].attributes["label"] ? 0 : bDir ?-1 : 1;});
		oInstance.items	= new AMLNodeList;
		for (var nIndex = 0; nIndex < aElements.length; nIndex++)
			oInstance.items.$add(aElements[nIndex]);

        var oElementDOM	= oInstance.body.$getContainer("gateway");
        for (var nIndex = 0; nIndex < oInstance.items.length; nIndex++) {
            oElementDOM.appendChild(oInstance.items[nIndex].$getContainer());
            if (oInstance.items[nIndex].attributes["selected"] == "true")
            	oInstance.items[nIndex].setAttribute("selected", "true");
        }
    }
};

// Element Render: open
cXULElement_listbox.prototype.$getTagOpen	= function() {
	var sHeight	= this.attributes["height"],
		sWidth	= this.attributes["width"];
    return '<div class="xul-listbox' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + (!this.$isAccessible() ? " xul-listbox_disabled" : "") + '" style="' + (sHeight ? 'height:' + (sHeight * 1 == sHeight ? sHeight + "px" : sHeight) + ';' : '') + (sWidth ? 'width:' + (sWidth * 1 == sWidth ? sWidth + "px" : sWidth) + ';' : '') + (this.attributes["style"] ? this.attributes["style"] + '' : '') + '">\
    			<div style="position:relative;height:100%;top:0;padding-bottom:inherit;">\
    				<div class="xul-listbox--resizer" style="height:100%;position:absolute;top:0px;display:none;z-index:1"></div>\
    				<table cellpadding="0" cellspacing="0" border="0" height="' +(sHeight ? sHeight : '100%')+ '" width="' +(sWidth ? sWidth : '100%')+ '" style="position:absolute">\
						<tbody class="xul-listbox--gateway">';
};

// Element Render: close
cXULElement_listbox.prototype.$getTagClose	= function() {
    return 				'</tbody>\
    				</table>\
   				</div>\
    		</div>';
};

// Register Element
ample.extend(cXULElement_listbox);
