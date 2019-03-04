// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorBasic(obj)
{
  obj.sprintf = function(str)
  {
	var result = str;
	var arg = this.sprintf.arguments;
	var i,s;
	  
	for ( i=1; i<arg.length; i++ )
	{
	  s = "$" + i ;
	  result = result.replace(s, arg[i] );
	}
	return result;
  };
  
  obj.getText = function(str)
  {
	if (typeof str != 'string' ) return str;
	if ( str.indexOf('#mne_lang') == 0 ) return str.substring(10, str.length);
	
	return str;
  };
  
  obj.message = function(str)
  {
    if ( typeof this.win.mnePrint != 'undefined'  ) this.win.mnePrint.message(this.getText(str));
    else if ( typeof this.weblet  != 'undefined'  ) this.weblet.message(this.getText(str));
    else alert(this.getText(str));
    return;
  };
  
  obj.warning = function(str)
  {
    if ( typeof this.win.mnePrint != 'undefined'  ) this.win.mnePrint.warning(this.getText(str));
    else if ( typeof this.weblet  != 'undefined'  ) this.weblet.warning(this.getText(str));
    else alert(this.getText(str));
    return;
  };
  
  obj.error = function(str)
  {
    if ( typeof this.win.mnePrint != 'undefined'  ) this.win.mnePrint.error(this.getText(str));
    else if ( typeof this.weblet  != 'undefined'  ) this.weblet.error(this.getText(str));
    else alert(this.getText(str));
    return;
  };
  
  obj.exception = function(str, e)
  {
    if ( this.parameter.ignore_exception == true ) return;
    
    if ( typeof this.win.mnePrint != 'undefined'  ) this.win.mnePrint.exception(str, e);
    else if ( typeof this.weblet  != 'undefined'  ) this.weblet.exception(str, e);
    else alert(e);
    return;
  };

  obj.getWeblet = function(url)
  {
    var req;
    if ( this.win.XMLHttpRequest ) req  = new this.win.XMLHttpRequest; else req  = new ActiveXObject("Microsoft.XMLHTTP");
	
	req.open("GET", url, false);
	try { req.send(null); } catch (err) { this.error(err); return ""; }
    return req.responseText;
  };
  
  obj.insertAfter = function (node, after)
  {
    if ( node.nextSibling != null ) node.parentNode.insertBefore(after, node.nextSibling );
	else node.parentNode.appendChild(after);
  };
  
  obj.insertBefore = function (node, after)
  {
    node.parentNode.insertBefore(after, node );
  };

}