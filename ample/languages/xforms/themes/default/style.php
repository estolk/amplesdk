<?php
	$aFiles		= array();
//    $aFiles[]	= "elements.css";

    $sOutput	= "@namespace xforms \"http://www.w3.org/2002/xforms\";\n";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: text/css");

	//
	include("../../../../../build/resources/compiler/cCSSCompiler.php");
/*
	$oCSSCompiler	= new cCSSCompiler;
	$oCSSCompiler->readFromString($sOutput);
	$oCSSCompiler->stripComments();
	$oCSSCompiler->stripSpaces();
	$oCSSCompiler->obfuscate();
	$sOutput	= $oCSSCompiler->getOutput();
*/
	echo $sOutput;
?>