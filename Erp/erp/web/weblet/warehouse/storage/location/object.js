// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/storage/location
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'storagelocation',
    table     : 'storagelocation',
    
    storageschema : 'mne_warehouse',
    storagequery  : 'storage'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      storageidInput : { notclear : true },
      storagedescriptionOutput : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("storagelocationid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lagerplatz hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lagerplatz bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    var result;
    if ( weblet == null || typeof weblet.act_values.storagelocationid == 'undefined')
    {
      if ( weblet != null && weblet != this )
      {
        this.obj.xname = weblet.act_values.xname;
        this.obj.yname = weblet.act_values.yname;
        this.obj.zname = weblet.act_values.zname;
        this.act_values.storageid = weblet.act_values.storageid;
        this.showInput(this.obj.inputs.storageid, weblet.act_values.storageid);

        if ( typeof weblet.act_values.storagedescription == 'undefined' )
        {
          var w = new MneAjaxData(this.win);
          var param =
          {
              "schema" : this.initpar.storageschema,
              "query"  : this.initpar.storagequery,
              "cols"   : "description",
              "storageidInput.old" : weblet.act_values.storageid,
              "sqlend" : 1
          };

          MneAjaxData.prototype.read.call(w, "/db/utils/query/data.xml",  param)
          if ( w.values.length > 0 )
          {
            this.showOutput(this.obj.outputs.storagedescription, w.values[0][0]);
          }
          else
          {
            this.showOutput(this.obj.outputs.storagedescription, "#mne_lang#Lager unbekannt");
          }
        }
        else
        {
          this.showOutput(this.obj.outputs.storagedescription, weblet.act_values.storagedescription);

        }
      }
      this.add();
      return;
    }
    
    result = MneAjaxWeblet.prototype.showValue.call(this,weblet);

    this.obj.xname = weblet.act_values.xname;
    this.obj.yname = weblet.act_values.yname;
    this.obj.zname = weblet.act_values.zname;
    
    return result;
  }
  
  weblet.add = function(setdepend)
  {
    var result = MneAjaxWeblet.prototype.add.call(this,setdepend);
    if ( typeof this.obj.xname != 'undefined' )
    {
      this.obj.outputs.xname.innerHTML = this.obj.xname;
      this.obj.outputs.yname.innerHTML = this.obj.yname;
      this.obj.outputs.zname.innerHTML = this.obj.zname;
    }
    return result;
  }
  
  weblet.cancel = function()
  {
    var result = MneAjaxWeblet.prototype.cancel.call(this);

    if ( typeof this.obj.xname != 'undefined' )
    {
      this.obj.outputs.xname.innerHTML = this.obj.xname + ":";
      this.obj.outputs.yname.innerHTML = this.obj.yname + ":";
      this.obj.outputs.zname.innerHTML = this.obj.zname + ":";
    }
    return result;
  }
}
