// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: hoai/import
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : '',
    query     : '',
    table     : '',
    styleName : 'style.css'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();
  weblet.delbuttons('add,cancel,del');
  weblet.obj.mkbuttons.push({ id: 'read', value : weblet.txtGetText('#mne_lang#Lesen#')})

  var attr = 
  {
      hinput : true,
      yearInput : { notclear : 1, value : '2013' },
      sendframe : { weblet : weblet },
      dataframe : { weblet : weblet },
   
  }

  weblet.findIO(attr);
  // weblet.showLabel();

  weblet.showids = new Array();
  weblet.titleString.add = weblet.txtGetText("#mne_lang#hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#bearbeiten");
       
  weblet.obj.tables.data.addHead("Anrechenbare Kosten","I von","I bis","II von", "HII bis", "III von", "III bis", "IV von", "IV bis", "V von","V bis");

  weblet.sendready = function()
  {
    this.findIO({iconvInput : { selectlist : weblet.initpar.iconvlist }}, this.frame, this.frame.sendframe.contentDocument.getElementById('iconvInput'));
    this.create_selectlist(this.obj.inputs.iconv);

    var body = this.frame.sendframe.contentDocument.getElementById("content");
    this.frame.sendframe.style.width  = ( body.offsetWidth)+ "px";
    this.frame.sendframe.style.height = ( body.offsetHeight) + "px";
    this.frame.sendframe.style.overflow = "hidden";
    
    if ( typeof this.popup != 'undefined') this.popup.resize(true,false);
  };
  
  weblet.dataready = function()
  {
    try {
      var i;
      var obj = this.eleGetById(this.frame.dataframe.contentDocument, "data");
      this.act_values.data = decodeURIComponent(obj.value).replace(/\r*\n+/g,"\n").split("\n");
      
      var law = this.eleGetById(this.frame.sendframe.contentDocument, "data").value;

      law = law.split('/');
      law = law[law.length - 1];
      law = law.split('\\');
      law = law[law.length - 1];
      law = law.split('.')[0];
      
      this.obj.inputs.lawid.value = '2013_' + law.split(' ')[0];
      this.obj.inputs.law.value = law;
      
      for ( i=0; i<this.act_values.data.length; i++)
      {
        this.addline(this.act_values.data[i]);
      }
      
      var t = this.obj.tables.data.body.data[0];
      for ( i =1; i< t.length; i++)
      {
        if ( t[i] == '' ) break;
      }
      this.obj.inputs.zonen.value = parseInt( i / 2 );
      
      if ( typeof this.popup != 'undefined') this.popup.resize(true,true);
    }
    catch(e)
    {
      this.exception("MneImport::dataread:", e);
    }
  };

  weblet.showValue = function(weblet)
  {
    this.frame.sendframe.src = this.path + "/send.html";
  }
  
  weblet.read = function()
  {
    var form = this.eleGetById(this.frame.sendframe.contentDocument, "fileimport");

    this.act_values = {};
    this.obj.tables.data.clearBody();
    this.obj.tables.data.max_rownum = 50;
    this.obj.tables.data.max_rownum_step = 20;

    if ( form != null ) form.submit();
    
    return false;
  };

  weblet.addline = function(s)
  {
    var t = this.obj.inputs.trenner.value;
    var str = '"';
    var i;
    var ignore = false;
    
    if ( s == '' ) return;
    for ( i = 0; i<s.length; i++)
    {
      if ( s[i] == '"' )
        ignore = ! ignore;
      else if ( ignore != true && s[i] == t )
        str += '","';
      else
        str += s[i];
    }

    eval ("this.obj.tables.data.add(" + str + '")');
  };

  weblet.ok = function()
  {
    var param = {
        schema : 'mne_hoai',
        table  : 'feename',
        feenameidInput    : this.obj.inputs.lawid.value,
        lawInput    : this.obj.inputs.law.value,
        yearInput    : this.obj.inputs.year.value,
        rollback    : true
    }

    if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/insert.xml",  param ) != 'ok') return true;

    var param = {
        schema : 'mne_hoai',
        table  : 'fee',
        lawInput    : this.obj.inputs.lawid.value,
        rollback    : true
    }
    var t = this.obj.tables.data.body;
    
    for ( i = 0; i< t.rows.length; i++ )
    {
      for ( j = 0; j < parseInt(this.obj.inputs.zonen.value); j++)
      {
        var cells = t.rows[i].cells;
        param.feeidInput = "################";
        param.zoneInput = j + 1;
        param.costInput = cells[0].innerHTML.replace(/\s+/g,"").replace(new RegExp("\\.", "g"), this.win.mne_config.locale.decimal_point).replace(new RegExp("\\,", "g"), this.win.mne_config.locale.decimal_point);
        param.startfeeInput = cells[j*2 + 1].innerHTML.replace(/\s+/g,"").replace(new RegExp("\\.", "g"), this.win.mne_config.locale.decimal_point).replace(new RegExp("\\,", "g"), this.win.mne_config.locale.decimal_point);
        param.endfeeInput = cells[j *2 + 2].innerHTML.replace(/\s+/g,"").replace(new RegExp("\\.", "g"), this.win.mne_config.locale.decimal_point).replace(new RegExp("\\,", "g"), this.win.mne_config.locale.decimal_point);

        if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/insert.xml",  param ) != 'ok') return true;

      }
    }
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml", {});
    return false;
  }
}
