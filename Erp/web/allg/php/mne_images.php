<?php
// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
// Die Software darf unter den Bedingungen
// der APGL ( Affero Gnu Public Licence ) genutzt werden
//
// ================================================================================
require 'mne_imagescale.php';

function MneImageRead($filename, &$type)
{
    if (file_exists ( $filename ))
    {
        $type = exif_imagetype($filename);
        switch ($type)
        {
            case IMAGETYPE_GIF :
                $im = imagecreatefromgif ( $filename );
                break;
            case IMAGETYPE_JPEG :
                $im = imagecreatefromjpeg ( $filename );
                break;
            case IMAGETYPE_PNG :
                $im = imagecreatefrompng ( $filename );
                break;
            case IMAGETYPE_WBMP :
                $im = imagecreatefromwbmp ( $filename );
                break;
            case IMAGETYPE_XBM :
                $im = imagecreatefromxbm ( $filename );
                break;
            default :
                trigger_error ( "image type unknown", E_USER_ERROR );
        }
        return $im;
    }
    trigger_error ( "file " . $filename . " not found", E_USER_ERROR );
}

function MneImageWrite($im, $filename, $type = IMAGETYPE_JPEG )
{
        switch ($type)
        {
            case IMAGETYPE_GIF :
                $im = imagegif ( $im,  $filename );
                break;
            case IMAGETYPE_JPEG :
                $im = imagejpeg ( $im, $filename, 100 );
                break;
            case IMAGETYPE_PNG :
                $im = imagepng ( $im, $filename, 9 );
                break;
            case IMAGETYPE_WBMP :
                $im = imagewbmp ( $im, $filename );
                break;
            case IMAGETYPE_XBM :
                $im = imagexbm ( $im, $filename );
                break;
            default :
                trigger_error ( "image type unknown", E_USER_ERROR );
    }
}

?>