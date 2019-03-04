// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/text/simpleedit
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      editid : "text",
      ewidth  : "400",
      eheight : "300",
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  var attr = 
  {
      editareaInput : { spellcheck : false, 'style.width' : weblet.initpar.ewidth + 'px', 'style.height' : weblet.initpar.eheight + 'px' }
  }
  weblet.findIO(attr);

  weblet.delbuttons(['add', 'del']);

  weblet.showValue = function(weblet)
  {
    if ( weblet != null && typeof weblet.act_values[this.initpar.editid] != 'undefined')
      this.obj.inputs.editarea.value = weblet.act_values[this.initpar.editid];

    if ( typeof this.initpar.delimiter != 'undefined')
    {
      this.obj.inputs.editarea.value = this.obj.inputs.editarea.value.split(this.initpar.delimiter).join(",\n");
    }  
  }
  
  weblet.ok = function()
  {
    if ( typeof this.initpar.delimiter != 'undefined')
      this.obj.inputs.editarea.value = this.obj.inputs.editarea.value.replace(/\n/g,'');
    
    this.act_values[this.initpar.editid] = this.obj.inputs.editarea.value;
    try
    {
      if (typeof this.onbtnobj == 'object')
        if (typeof this.onbtnobj.onbtnok == 'function')
          this.onbtnobj.onbtnok({ weblet : this });
        else if ( typeof this.onbtnobj.onbtnclick == 'function')
          this.onbtnobj.onbtnclick('ok',{ weblet : this });
    }
    catch (e)
    {
      this.exception(this.onbtnobj.id + '.onbtnclick: ', e);
    }

    this.onbtnobj = {};
    if (typeof this.popup != 'undefined') this.popup.hidden();
    
    return false;
  }
  
  weblet.cancel = function()
  {
    this.onbtnobj = {};
    if (typeof this.popup != 'undefined') this.popup.hidden();
    
    return false;
  }    

}