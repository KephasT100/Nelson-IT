// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorXml(editor, param)
{
  editor.xml_save = function(iv, parent)
  {
    var i,j;
	var tag;
	var str;
	var endtag;
	var v = iv;
	
	for ( i=0; i<parent.childNodes.length; i++ )
	{
	  tag = parent.childNodes[i];
	  endtag = "";
	  
	  switch(tag.tagName)
	  {
	    case "SPAN":
			str = "<text";
			if ( tag.className.indexOf("mne_bold") >= 0  ) str += ' weight="bold"';
			if ( tag.className.indexOf("mne_italic") >=0 ) str += ' style="italic"';
	        if ( tag.className.indexOf("mne_font")   >= 0 ) str = str + ' size="' + tag.className.match(/mne_font[^ ]*/).toString().substr(8) + '"'; else str += ' size="n"';
			str += ">";
			
			var t = this.getRawTextContent(tag);
	        t = t.replace(/>/g, "&gt;");
	        t = t.replace(/</g, "&lt;");
			
			v = v + str + t + "</text>";
		  break;
		  
	   case "DIV":
          str = "<part";
          if ( tag.className.indexOf("mne_alignc") >= 0 ) str += ' align="center"';
          if ( tag.className.indexOf("mne_alignr") >= 0 ) str += ' align="right"';
          if ( tag.className.indexOf("mne_alignl") >= 0 ) str += ' align="left"';
		  str += ">";
		  v = v + str;
		  endtag = "</part>";
		  break;
		  
	   case "UL":
	     v = v + "<itemize>";
		 endtag = "</itemize>";
		 break;

	   case "OL":
	     v = v + "<enumerate>";
		 endtag = "</enumerate>";
		 break;

	   case "LI":
	     v = v + "<item>";
		 endtag = "</item>";
		 break;

	   case "TABLE":
	     str = "<table";
         if ( tag.className.indexOf("mne_borderno") >= 0 ) str += ' border="0"'; else str += ' border="1"';
         if ( tag.className.indexOf("mne_padding") >= 0 ) str += ' padding="1"'; else str += ' padding="0"';
         if ( tag.className.indexOf("mne_alignc") >= 0 ) str += ' align="center"';
         if ( tag.className.indexOf("mne_alignr") >= 0 ) str += ' align="right"';
         if ( tag.className.indexOf("mne_alignl") >= 0 ) str += ' align="left"';

         str += ">";
          v = v + str;

		 endtag = "</table>";
		 break;
	   case "TR":
	     v = v + "<tr>";
		 endtag = "</tr>";
		 break;
		 
	   case "TD":
	     {
	     var w;
	     str = "<td";
	     w = tag.style.width;
	     if ( typeof w == 'undefined' || parseInt(w) == 0  || parseInt(w).toString() == "NaN")
	     {
	       var j;
	       for ( j=0; j<tag.childNodes.length; j++)
	       {
	         if ( tag.childNodes[j].tagName == 'UL' || tag.childNodes[j].tagName == "OL")
	           w = tag.offsetWidth;
	       }
	     }
	     if ( typeof  w != 'undefined' && parseInt(w) != 0  && parseInt(w).toString() != "NaN" ) str += ' relwidth="'  + parseInt(parseFloat(w) / MneMisc.prototype.posGetWidth(this.editarea) * 100 )  + '"'; 
	     if ( tag.className.indexOf("mne_padding") >= 0 ) str += ' padding="1"'; else str += ' padding="0"';
         if ( tag.className.indexOf("mne_valignt") >= 0 ) str += ' valign="top"';
         if ( tag.className.indexOf("mne_valignm") >= 0 ) str += ' valign="middle"';
         if ( tag.className.indexOf("mne_valignb") >= 0 ) str += ' valign="bottom"';
         str += ">";
		 v = v + str;
		 endtag = "</td>";
		 break;
	     }
	  }
	  
	  if ( tag.tagName != "SPAN" ) v = this.xml_save(v, tag) + endtag;
    }
	return v;
  };
  
  editor.output = param.output;
  editor.save = function(nochange)
  {
    if (this.output == null ) return;

    if ( this.clearNode(null) != true )
       this.output.value = this.xml_save("", this.editarea);
    else
      this.output.value = '';
    
    if ( nochange != true )
      this.buttons.setModify(false);

  };
}