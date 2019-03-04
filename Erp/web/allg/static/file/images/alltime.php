<?php
header ( "Content-type: text/plain" );

date_default_timezone_set ( 'Europe/Zurich' );

require 'mne_errorhandler.php';

function my_touch($file, $time)
{
    if ($time < 0) $time = 1;
    
    if (filemtime ( $file ) != $time)
    {
        rename ( $file, $file . ".old" );
        copy ( $file . ".old", $file );
        touch ( $file, $time );
        unlink ( $file . ".old" );
    }
}

function set_time($file)
{
    $exif = @exif_read_data ( $file, 0, true );
    if (ISSET ( $exif ["IFD0"] ) && ISSET ( $exif ["IFD0"] ["DateTime"] ))
    {
        $t = strtotime ( $exif ["IFD0"] ["DateTime"] );
        my_touch ( $file, $t );
    }
    else if (ISSET ( $exif ["EXIF"] ) && ISSET ( $exif ["EXIF"] ["DateTimeOriginal"] ))
    {
        $t = strtotime ( $exif ["EXIF"] ["DateTimeOriginal"] );
        my_touch ( $file, $t );
    }
    else if (ISSET ( $exif ["EXIF"] ) && ISSET ( $exif ["EXIF"] ["DateTimeDigitized"] ))
    {
        $t = strtotime ( $exif ["EXIF"] ["DateTimeDigitized"] );
        my_touch ( $file, $t );
    }
}

$dir1 = $_GET ['root'] . '/' . $_GET ['dirInput_old'];
if ($dir1 [strlen ( $dir1 ) - 1] != '/') $dir1 = $dir1 . '/';

foreach ( scandir ( $dir1 ) as $i )
    if ($i != '.' && $i != '..') set_time ( $dir1 . $i );

echo 'ok';
exit ( 0 );
?>