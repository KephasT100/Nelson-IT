<?php
header ( "Content-type: text/plain" );

require 'mne_errorhandler.php';

$format = $_GET ['formatInput'];
$start = $_GET['start'];

$dir1 = $_GET ['root'] . '/' . $_GET ['dirInput_old'];
$dir2 = $_GET ['root'] . '/' . $_GET ['dirInput'];

if ($_GET ['dirInput'] == "") $dir2 = $dir2 . "soriert";
if ($dir1 [strlen ( $dir1 ) - 1] != '/') $dir1 = $dir1 . '/';
if ($dir2 [strlen ( $dir2 ) - 1] != '/') $dir2 = $dir2 . '/';
if ($format == '') $format = "Bild%'04d";

if ( $dir1 == $dir2 )
{
	trigger_error("Verzeichnisse sind gleich", E_USER_ERROR);
}

$format = $format . ".%s";
if ($start == 0)
{
    if (file_exists ( $dir2 ) && isset ( $_GET ['overwriteInput'] ) && $_GET ['overwriteInput'] != 0)
    {
        foreach ( scandir ( $dir2 ) as $i )
            if ($i != '.' && $i != '..') unlink ( $dir2 . $i );
    }
    else if (file_exists ( $dir2 ))
    {
        foreach ( scandir ( $dir2 ) as $i )
            if ($i != '.' && $i != '..') trigger_error ( "Ordner exisiert", E_USER_NOTICE );
    }
    else
    {
        mkdir ( $dir2, 0775, true );
    }
}

for($i = $start; isset ( $_GET ['pic' . $i . 'Input_old'] ); $i++)
{
    $file1 = $_GET ['pic' . $i . 'Input_old'];
    $f = explode ( '.', $file1 );
    $ftyp = strtolower(array_pop ( $f ));
    
    $file2 = sprintf ( $format, $i, $ftyp );
    
    link ( $dir1 . $file1, $dir2 . $file2 );
}

echo 'ok';
exit ( 0 );
?>