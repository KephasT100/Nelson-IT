// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dav/share/shares/table
// ================================================================================
{
  var i,str;
  
  var ivalues = 
  {
      addschema : 'mne_system',
      addfunction : 'share_add',
      
      delschema : 'mne_system',
      delfunction : 'share_del',
      
      okpost : '/sysexec/shares/enable',
      
      showlabel : { 'de' : 'Hinzufügen', 'en' : '#mne_lang#Hinzufügen#' },
      
      notclose : true
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadbase('/weblet/allg/table/filter', weblet);
  
  weblet.onbtnclickfilter = weblet.onbtnclick; 
  weblet.onbtnclick = function(id, button)
  {    
	  
    if ( this.inputlist == null && id == 'ok'  )
    {
      var p =
      {
          schema : this.initpar.addschema,
          name : this.initpar.addfunction,
          
          typ0 : "text",
          typ1 : "text",
          
          sqlend : 1   
      }
      
      p = this.addParam(p, "par0", this.act_values.folderid);
      p = this.addParam(p, "par1", button.weblet.act_values.personid);


      MneAjaxWeblet.prototype.func.call(this, p, "", null, null, 'ok');
      this.refresh();
    }
    
    this.onbtnclickfilter(id, button)
  }
  
  weblet.del = function()
  {
	  var p =
	  {
		schema : this.initpar.delschema,
		name : this.initpar.delfunction,

		typ0 : "text",
		typ1 : "text",

		sqlend : 1   
	  }

	  p = this.addParam(p, "par0", this.act_values.folderid);
	  p = this.addParam(p, "par1", this.act_values.personid);


	  MneAjaxWeblet.prototype.func.call(this, p, "", null, null, 'ok');
	  this.refresh();
	  
	  return false;
  }
  
  weblet.refreshfilter = weblet.refresh;
  weblet.refresh = function()
  {
    var retval = weblet.refreshfilter();
    return retval;
  }
  
}