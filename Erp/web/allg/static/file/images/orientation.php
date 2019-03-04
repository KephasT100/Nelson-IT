<?php 

header ( "Content-type: text/xml" );

function getOrientation($file)
{
    $exif = @exif_read_data ( $file, 0, true );
    if ( ISSET($exif["IFD0"]) && ISSET($exif["IFD0"]["Orientation"]))
        return $exif["IFD0"]["Orientation"];
    return "0";
}
$orientation = "0";
if ( isset ( $_GET ['filenameInput_old'] ) && $_GET ['filenameInput_old'] != 'null' && $_GET ['filenameInput_old'] != '')
{
    $file = $_GET ['root'] . '/' . $_GET ['dirInput_old'] . '/' . $_GET ['filenameInput_old'];
    $orientation = getOrientation ( $file );
}

echo '<?xml version="1.0" encoding="utf-8"?><result><head>';
echo '<d><id>value</id><typ>2</typ><name>Wert</name><regexp><reg></reg><help></help><mod></mod></regexp></d>';
echo '</head><body>';
printf ( "<r><v>%s</v></r>\n", $orientation );
echo '</body></result>';


?>
