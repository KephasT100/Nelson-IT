<?php
header ( "Content-type: text/xml" );

if (! isset($_GET['filenameInput_old']) || $_GET ['filenameInput_old'] == 'null' || $_GET ['filenameInput_old'] == '')
{
    echo '<?xml version="1.0" encoding="utf-8"?><result><head></head><body>ok</body></result>';
    return;
}
$file = $_GET ['root'] . '/' . $_GET ['dirInput_old'] . '/' . $_GET ['filenameInput_old'];
$needkey = '';
if ( isset($_GET['key']) ) $needkey = $_GET['key'];

echo '<?xml version="1.0" encoding="utf-8"?><result><head>';
echo '<d><id>name</id><typ>2</typ><name>Name</name><regexp><reg></reg><help></help><mod></mod></regexp></d>';
echo '<d><id>value</id><typ>2</typ><name>Wert</name><regexp><reg></reg><help></help><mod></mod></regexp></d>';
echo '</head><body>';
$exif = exif_read_data ( $file, 0, true );

foreach ( $exif as $key => $section )
{
    foreach ( $section as $name => $val )
    {
        $val = @iconv ( mb_detect_encoding ( $val, mb_detect_order (), true ), "UTF-8", $val );
        if ($needkey == '' || $needkey == $key ."." . $name)
        {
            if (ctype_print ( $val ))
                printf ( "<r><v>%s.%s</v><v>%s</v></r>\n", $key, $name, $val );
            else
                printf ( "<r><v>%s.%s</v><v>binary</v></r>\n", $key, $name );
        }
    }
}

echo '</body></result>';
