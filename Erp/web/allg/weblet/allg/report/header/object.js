// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/report/header
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      typelist : "mne_reportheader_typ"
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  
  weblet.delbuttons('add,del');

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      typeInput : { selectlist : weblet.initpar.typlist },
      reportheaderresult : { weblet             : weblet, 
                             onload             : function() { if ( typeof this.weblet.showResult == 'function' ) this.weblet.showResult(this.contentDocument);},
                             "style.position"   : "absolute",
                             "style.width"      : "0px",
                             "style.height"     : "0px",
                             "style.border"     : "0px"
                           }
  };

  weblet.findIO(attr);

  weblet.showids = new Array();
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Überschriften hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Überschriften bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Überschriften <$1> wirklich löschen ?");
  weblet.titleString.delid = 'name';     
  
  
  weblet.showValue = function(weblet)
  {
    this.obj.inputs.companyownprefix.value = weblet.act_values.companyownprefix;
  };
  
  weblet.ok = function()
  {
    this.frame.querySelector('#reportheader').submit();
  }

  weblet.showResult = function(doc)
  {
	  var result = this.txtGetTextContent(doc.body);
	  if ( result.substr(0,2) == '')
	  {
		  this.obj.inputs.data.value = "";
	  }
	  else if ( result.substr(0,2) == 'ok')
	  {
		  this.message("#mne_lang#Überschriftdatei übertragen");
		  this.obj.inputs.data.value = "";
	  }
	  else
	  {
		  this.error(result);
	  }
  };

}
