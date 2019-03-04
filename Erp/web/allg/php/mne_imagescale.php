<?php 
// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Alle Rechte vorbehalten
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================

function MneImagescale($name, &$xsize, &$ysize, &$x, &$y )
{
    $size = array ( 10, 10, false, "width=10 height=10" );		
    if ( is_string($name) )
	{
        if ( file_exists( $name) )
    	    $size = GetImageSize ( $name );
        else if ( file_exists( $_SERVER['DOCUMENT_ROOT'] . "/" . $name) )
    	    $size = GetImageSize ($_SERVER['DOCUMENT_ROOT'] . "/" . $name);
	}
	else if ( is_int($name) ) // vermutlich ein image aus gd extension
	{
		$size[0] = Imagesx($name);
        $size[1] = ImagesY($name);
		$size[3] = 0;
	}
		
	$x = $size[0];
    $y = $size[1];

    if ( $xsize != 0 && $ysize != 0 )
	{
    	$xscale = $xsize / $x;
	    $yscale = $ysize / $y;
    
	    if ( $xscale < $yscale )
	    {
	        $size[0] = $xsize;
		    $size[1] = floor($y * $xscale);
	    }
	    else
	    {
	        $size[0] = floor($x * $yscale);
		    $size[1] = $ysize;
	    }
	}

    $size[3] = sprintf("width=\"%d\" height=\"%d\"", $size[0], $size[1] );
	
	$xsize = $size[0];
	$ysize = $size[1];
	return $size;		
}
?>