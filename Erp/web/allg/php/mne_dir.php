<?php 
// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================

function MneShowdir( $dn, $p_print, $ignore_subdirs = false, $init_deep = true )
{
    static $deep = 0;
	if ( $init_deep )
	    $deep = 0;
		
    if ( file_exists( $dn . '/dirname.txt' ) )
	{
		$file = fopen( $dn . '/dirname.txt', "r" );
		$dirname = chop(fgets($file, 1024));
		if ( $dirname == false )
		    $dirname = $dn;
		fclose($file);
	}
	else
	{
	    $dirname = $dn;
	}

    if ( substr($dn, 0, 1 ) == "/" )
	    $root = $_SERVER['DOCUMENT_ROOT'];
	else
	    $root = "";
		
	$dir=opendir( $root . $dn);
    while ($name = readdir ($dir))
    {
        if ($name != "." && $name != ".." && $name != "dirname.txt" & $name[0] != '.' )
	    {
            if ( is_dir( $root . $dn . '/' . $name ) )
			{
			    if ( ! $ignore_subdirs )
				{
				    MNE_showdir ( $dn . '/' . $name, false, false );
				}
				else
				{
					if ( file_exists( $root . $dn . '/' . $name . '/dirname.txt' ) )
                	{
		                $file = fopen( $root . $dn . '/' . $name . '/dirname.txt' , "r" );
		                $out = chop(fgets($file, 1024));
		                if ( $out == false )
		                    $out = $name;
		                fclose($file);
						$out = $out;
	                }
	                else
	                {
	                    $out = $name;
	                }
					$p_print($dn, $dirname, $name, $out, $deep );
				}
			}
			else
			{
			    $p_print($dn, $dirname, $name, $name, $deep);
			}
        }
    }
    closedir($dir);
}

function MneRmdir( $dn )
{
	$root = $_SERVER['DOCUMENT_ROOT'];
	
	if ( file_exists($dn) )
	{
	    $dirname = $dn;
	    $dir=opendir( $dn);
	}
    else
	{
	    $dir=opendir( $root . $dn);
		$dirname = $root . $dn;
	}
    
	while ($name = readdir ($dir))
    {
        if ($name != "." && $name != ".." )
	    {
            if ( is_dir($dirname . '/' . $name ) )
			{
				    MneRmdir ( $dn . '/' . $name );
			}
	        else
	        {
	            unlink($dirname . "/" . $name );
			}
        }
    }
    closedir($dir);
	rmdir($dirname);
}

?>