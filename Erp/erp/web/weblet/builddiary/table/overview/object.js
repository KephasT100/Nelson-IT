{
  var ivalues = 
  {
     report2 : 'mne_builddiary_detail',
     delbutton : 'exports',
     multiselect : false
  }

  var svalues = 
  {
  }

  weblet.initDefaults(ivalues, svalues);

  weblet.loadbase('weblet/allg/table/filter', weblet);
  weblet.obj.mkbuttons.push( { id : 'print2', value : weblet.txtGetText('#mne_lang#Bautagebuch drucken'), behind : 'print' });
  weblet.obj.mkbuttons.push( { id : 'print3', value : weblet.txtGetText('#mne_lang#Blatt drucken') });
  weblet.obj.mkbuttons.push( { id : 'exports', value : weblet.txtGetText('#mne_lang#Exportieren'), space : 'before' });
  
  weblet.obj.enablebuttonsvalue.push('print3');
  
  weblet.print2 = function()
  {
      var p = {};

      if ( this.obj.inputs.orderid.value == '' )
      {
        this.error("#mne_lang#Kein Auftrag ausgewählt");
        return false;
      }
      
      p.schema = "";
      p.query  = "";
      p.table = "";
      p["orderidInput.old"] = this.obj.inputs.orderid.value;
      p["timeidInput.old"] = '';
      p["timeidOp.old"] = "is not null";
      
      return MneAjaxWeblet.prototype.print.call(this,p, this.initpar.report2);
  }

  weblet.print3 = function()
  {
      var p = {};

      p.schema = "";
      p.query  = "";
      p.table = "";
      p["orderidInput.old"] = this.obj.inputs.orderid.value;
      p["timeidInput.old"] = this.act_values.timeid;
      p["macro0"] = "Brownum," + this.act_values.rownum;
      
      return MneAjaxWeblet.prototype.print.call(this,p, this.initpar.report2);
  }

}
