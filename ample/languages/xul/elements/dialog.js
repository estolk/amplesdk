/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_dialog	= function(){
    // Collections
    this.buttons	= {};
    //
    var that	= this;
    this.contentFragment	= ample.createDocumentFragment();
	// Accept
    this.buttons.accept	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:button"));
    this.buttons.accept.addEventListener("DOMActivate", function(oEvent) {
		that.acceptDialog();
	}, false);
    this.buttons.accept.setAttribute("label", ample.locale.localize("dialog.button.accept"));
    this.buttons.accept.setAttribute("class", "accept");
	// Cancel
	this.buttons.cancel	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:button"));
	this.buttons.cancel.addEventListener("DOMActivate", function(oEvent) {
		that.cancelDialog();
	}, false);
	this.buttons.cancel.setAttribute("label", ample.locale.localize("dialog.button.cancel"));
	this.buttons.cancel.setAttribute("class", "cancel");
	// Help
	this.buttons.help	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:button"));
	this.buttons.help.addEventListener("DOMActivate", function(oEvent) {
        var oEvent2    = that.ownerDocument.createEvent("Events");
        oEvent2.initEvent("dialoghelp", true, true);
        that.dispatchEvent(oEvent2);
	}, false);
	this.buttons.help.setAttribute("label", ample.locale.localize("dialog.button.help"));
	this.buttons.help.setAttribute("class", "help");
	// Extra1
	this.buttons.extra1	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:button"));
	this.buttons.extra1.addEventListener("DOMActivate", function(oEvent) {
		that.extra1();
	}, false);
	this.buttons.extra1.setAttribute("label", "Extra1");
	this.buttons.extra1.setAttribute("class", "extra1");
	// Extra2
	this.buttons.extra2	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:button"));
	this.buttons.extra2.addEventListener("DOMActivate", function(oEvent) {
		that.extra2();
	}, false);
	this.buttons.extra2.setAttribute("label", "Extra2");
	this.buttons.extra2.setAttribute("class", "extra2");
};
cXULElement_dialog.prototype	= new cXULWindowElement("dialog");
cXULElement_dialog.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;
cXULElement_dialog.prototype.buttons	= null;

// Attributes Defaults
cXULElement_dialog.attributes	= {};
cXULElement_dialog.attributes.buttons	= "accept" + "," + "cancel";
cXULElement_dialog.attributes.orient	= "vertical";
cXULElement_dialog.attributes.flex		= "1";
cXULElement_dialog.attributes.width		= "400";
cXULElement_dialog.attributes.height	= "300";

// Public Methods
cXULElement_dialog.prototype.acceptDialog    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogaccept", true, true);
    if (this.dispatchEvent(oEvent2))
    	this.hide();
};

cXULElement_dialog.prototype.cancelDialog    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogcancel", true, true);
    if (this.dispatchEvent(oEvent2))
        this.hide();
};

cXULElement_dialog.prototype.extra1    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogextra1", true, true);
    this.dispatchEvent(oEvent2);
};

cXULElement_dialog.prototype.extra2    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogextra2", true, true);
    this.dispatchEvent(oEvent2);
};

cXULElement_dialog.prototype.centerWindowOnScreen    = function()
{
	var oElementDOM	= this.$getContainer(),
    	oPosition	= this.getBoundingClientRect();
	oElementDOM.style.left	=(document.body.clientWidth - oPosition.right + oPosition.left) / 2;
	oElementDOM.style.top	=(document.body.clientHeight - oPosition.bottom + oPosition.top) / 2;
};

// Class Events Handlers
cXULElement_dialog.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			var sValue	= oEvent.newValue || '';
			switch (oEvent.attrName) {
				case "title":
					this.$getContainer("title").innerHTML = sValue;
					break;

				case "buttons":
					this.buttons["help"].setAttribute("hidden", !sValue || sValue.indexOf("help")    ==-1 ? "true" : "false");
					this.buttons["cancel"].setAttribute("hidden", !sValue || sValue.indexOf("cancel")  ==-1 ? "true" : "false");
					this.buttons["accept"].setAttribute("hidden", !sValue || sValue.indexOf("accept")  ==-1 ? "true" : "false");
					this.buttons["extra1"].setAttribute("hidden", !sValue || sValue.indexOf("extra1")  ==-1 ? "true" : "false");
					this.buttons["extra2"].setAttribute("hidden", !sValue || sValue.indexOf("extra2")  ==-1 ? "true" : "false");
					break;

				case "buttonalign":
			        if (oEvent.newValue == "start")
			            this.$getContainer("foot").align  = "left";
			        else
			        if (oEvent.newValue == "center")
			            this.$getContainer("foot").align  = "center";
			        else
			            this.$getContainer("foot").align  = "right";
			        break;

				case "buttonlabelhelp":
					this.buttons["help"].setAttribute("label", sValue);
					break;

				case "buttonlabelaccept":
					this.buttons["accept"].setAttribute("label", sValue);
					break;

				case "buttonlabelcancel":
					this.buttons["cancel"].setAttribute("label", sValue);
					break;

				case "buttonlabelextra1":
					this.buttons["accept"].setAttribute("label", sValue);
					break;

				case "buttonlabelextra2":
					this.buttons["extra2"].setAttribute("label", sValue);
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
	}
};

// Element Renders
cXULElement_dialog.prototype.$getTagOpen	= function()
{
	return '<div class="xul-dialog' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="' +
				(this.attributes["width"] ? 'width:' + this.attributes["width"] + 'px;' : '') +
				(this.attributes["height"] ? 'height:' + (this.attributes["height"] - 40) + 'px;' : '') +
				(this.attributes["hidden"] == "true" ? 'display:none;' : '') +
				(this.attributes["style"] ? this.attributes["style"] : '') + '">\
				<div class="xul-dialog--head" ' +(this.attributes["hidechrome"] == "true" ? ' style="display:none"': '')+ '>\
					<table cellpadding="0" cellspacing="0" border="0" width="100%">\
						<tbody>\
							<tr>\
								<td class="xul-dialog--title">' +(this.attributes["title"] || " ")+ '</td>\
							</tr>\
						</tbody>\
					</table>\
				</div>\
				<div class="xul-dialogheader xul-dialog--header" style="display:none"><div class="xul-dialogheader--title xul-dialog--label"></div><div class="xul-dialogheader--description xul-dialog--description"></div></div>\
				<div class="xul-dialog--body" style="height:100%">';
};

// Element Render: close
cXULElement_dialog.prototype.$getTagClose	= function()
{
	if (this.attributes["buttons"].indexOf("accept") ==-1)
		this.buttons.accept.attributes["hidden"]= "true";
	if (this.attributes["buttonlabelaccept"])
		this.buttons.accept.attributes["label"]	= this.attributes["buttonlabelaccept"];
	if (this.attributes["buttons"].indexOf("cancel") ==-1)
		this.buttons.cancel.attributes["hidden"]= "true";
	if (this.attributes["buttonlabelcancel"])
		this.buttons.cancel.attributes["label"]	= this.attributes["buttonlabelcancel"];
	if (this.attributes["buttons"].indexOf("help") ==-1)
		this.buttons.help.attributes["hidden"]	= "true";
	if (this.attributes["buttonlabelhelp"])
		this.buttons.help.attributes["label"]	= this.attributes["buttonlabelhelp"];
	if (this.attributes["buttons"].indexOf("extra1") ==-1)
		this.buttons.extra1.attributes["hidden"]= "true";
	if (this.attributes["buttonlabelextra1"])
		this.buttons.extra1.attributes["label"]	= this.attributes["buttonlabelextra1"];
	if (this.attributes["buttons"].indexOf("extra2") ==-1)
		this.buttons.extra2.attributes["hidden"]= "true";
	if (this.attributes["buttonlabelextra2"])
		this.buttons.extra2.attributes["label"]	= this.attributes["buttonlabelextra2"];

	return '	</div>\
				<div class="xul-dialog--footer">\
					<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%" align="' +(this.attributes["buttonalign"] == "start" ? "left" : this.attributes["buttonalign"] == "center" ? "center" : "right")+ '">\
						<tbody>\
							<tr>\
								<td width="100%">' + this.buttons['help'].$getTag() + '</td>\
								<td>' + this.buttons['extra1'].$getTag() + '</td>\
								<td>' + this.buttons['extra2'].$getTag() + '</td>\
								<td>' + this.buttons['accept'].$getTag() + '</td>\
								<td>' + this.buttons['cancel'].$getTag() + '</td>\
							</tr>\
						</tbody>\
					</table>\
				</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_dialog);
