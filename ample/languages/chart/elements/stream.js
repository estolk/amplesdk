/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_stream	= function(){};
cChartElement_stream.prototype	= new cChartElement;

// Register Element with language
oChartNamespace.setElement("stream", cChartElement_stream);