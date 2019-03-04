// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/command/result
// ================================================================================
{
  var i;
  var str = "";
  
  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");
  weblet.obj.contentframe.innerHTML = '<div id="contentTable" style="width: 10px; white-space:nowrap;"></div>';
  weblet.obj.mkbuttons = [];

  weblet.findIO({});

  weblet.showValue = function(weblet, param)
  {
    var i,k;
    var str = "";
    if ( weblet == null) return;
    
   this.obj.tables.content.clear();
   
   for ( i in weblet.ids )
     str = str + "'" + this.txtMascarade(weblet.names[weblet.ids[i]]) + "',";

   str = str.substring(0, str.length - 1);
   if ( str == "" ) str = "'#mne_lang#Ergebnis'";
   eval("this.obj.tables.content.addHead(" + str + ")");

   for ( i = 0; i<weblet.values.length; i++ )
    {
     str = "";
     for ( k=0; k<weblet.values[i].length; k++ )
       str = str + "'" + this.txtMascarade(this.txtFormat.call(this, weblet.values[i][k], weblet.typs[k])) + "',";
     str = str.substring(0, str.length - 1);
     eval("r = this.obj.tables.content.add(" + str + ")");
    }
   
    if ( weblet.values.length == 0 )
    {
      this.obj.tables.content.add(weblet.req.responseXML.getElementsByTagName("result").item(0).firstChild.firstChild.data);
    }

    return false;
  }

  weblet.add = function()
  {
  }
  
  weblet.ok = function(setdepend)
  {
  }
  
}