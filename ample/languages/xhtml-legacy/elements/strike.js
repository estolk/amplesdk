/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_strike	= function(){};
cXHTMLElement_strike.prototype	= new cXHTMLElement;

// Register Element with language
oXHTMLNamespace.setElement("strike", cXHTMLElement_strike);
