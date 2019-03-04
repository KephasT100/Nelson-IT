<?php 
// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Alle Rechte vorbehalten
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================

require 'mne_imagescale.php';

function MneImageSave($filename, $newfilename, $xsize = 0, $ysize = 0)
{
	if ( ! is_string($filename) )
        return "dateiname ist falsch";
		
    if ( file_exists( $filename ) )
	{		
		$size = MneImagescale($filename, $xsize, $ysize, $origx, $origy);
		printf("Filetype: %d %s\n", $size[2], image_type_to_mime_type($size[2]));
		switch ( $size[2] )
		{
		    case IMAGETYPE_GIF:
			    $im = imagecreatefromgif( $filename);
				break;
		    case IMAGETYPE_JPEG:
				$im = imagecreatefromjpeg( $filename);
				break;
		    case IMAGETYPE_PNG:
			    $im = imagecreatefrompng( $filename);
				break;
		    case IMAGETYPE_WBMP:
			    $im = imagecreatefromwbmp( $filename);
				break;
		    case IMAGETYPE_XBM:
			    $im = imagecreatefromxbm( $filename);
				break;
			default:
			    return "dateiformat wird nicht unterstützt";
		}

        $newim = imagecreatetruecolor($size[0], $size[1]);
	    imagecopyresized($newim, $im, 0, 0, 0, 0, $size[0], $size[1], ImagesX($im), ImagesY($im));
		imagepng ( $newim, $newfilename );
		imagedestroy($newim);
		imagedestroy($im);
		return true;
	}
	
	return "datei " . $filename . " existiert nicht";

}
?>