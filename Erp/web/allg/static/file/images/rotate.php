<?php
header ( "Content-type: text/xml" );

require 'mne_images.php';
require_once ('autoload.php');

$rotate = $_GET ["rotate"];
$root = $_GET ["realpath"];
$name = $_GET ["filenameInput_old"];

$filename = $root . "/" . $name;

$pelJpeg = new lsolesen\pel\PelJpeg ( $filename );
$pelExif = $pelJpeg->getExif ();
if ($pelExif == null)
{
    $pelExif = new lsolesen\pel\PelExif ();
    $pelJpeg->setExif ( $pelExif );
}

$pelTiff = $pelExif->getTiff ();
if ($pelTiff == null)
{
    $pelTiff = new lsolesen\pel\PelTiff ();
    $pelExif->setTiff ( $pelTiff );
}

$pelIfd0 = $pelTiff->getIfd ();
if ($pelIfd0 == null)
{
    $pelIfd0 = new lsolesen\pel\PelIfd ( lsolesen\pel\PelIfd::IFD0 );
    $pelTiff->setIfd ( $pelIfd0 );
}

$pelorient = $pelIfd0->getEntry ( lsolesen\pel\PelTag::ORIENTATION );
if ($pelorient == null)
{
$pelorient = new lsolesen\pel\PelEntryShort(lsolesen\pel\PelTag::ORIENTATION, 1);
$pelIfd0->addEntry($pelorient);
}

$orientation = $pelorient->getValue();
switch ($orientation)
{
    case 1 :
        if ( $rotate == -90 )  $orientation = 6;
        if ( $rotate == 90 ) $orientation = 8;
        break;
    case 2 :
        if ( $rotate == -90 )  $orientation = 5;
        if ( $rotate == 90 ) $orientation = 7;
        break;
    case 3 :
        if ( $rotate == -90 )  $orientation = 8;
        if ( $rotate == 90 ) $orientation = 6;
        break;
    case 4 :
        if ( $rotate == -90 )  $orientation = 7;
        if ( $rotate == 90 ) $orientation = 5;
        break;
    case 5 :
        if ( $rotate == -90 )  $orientation = 4;
        if ( $rotate == 90 ) $orientation = 2;
        break;
    case 6 :
        if ( $rotate == -90 )  $orientation = 3;
        if ( $rotate == 90 ) $orientation = 1;
        break;
    case 7 :
        if ( $rotate == -90 )  $orientation = 2;
        if ( $rotate == 90 ) $orientation = 4;
        break;
    case 8 :
        if ( $rotate == -90 )  $orientation = 1;
        if ( $rotate == 90 ) $orientation = 3;
        break;
}

$pelorient->setValue($orientation);
$pelJpeg->saveFile ( $filename );

echo '<?xml version="1.0" encoding="utf-8"?><result><body>ok</body></result>';
exit ( 0 );
?>

