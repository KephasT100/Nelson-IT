// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: hoai/compute/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_hoai',
    query     : 'workphase',
    
    law      : '2013_35',
    feetable : 'fee',
    
    vschema  : 'mne_hoai',
    vquery   : 'offer',
    
    vokschema  : 'mne_hoai',
    voktable   : 'offer',
    
    okfunction : '',
    
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.delbuttons('add,cancel,del');
  weblet.obj.mkbuttons.push( { id : "compute", value : weblet.txtGetText("#mne_lang#Berechnen#") } );

  var attr = 
  {
      hinput : false,
      yearInput : { weblet : weblet, onchange : function() { this.weblet.change_year(this.weblet); return false }},
      lawInput  : { weblet : weblet, onchange : function() { this.weblet.showValue(this.weblet); return false }}
  }

  weblet.findIO(attr);
  weblet.showLabel();
  
  weblet.obj.zone = weblet.eleGetById(weblet.frame, 'zone_input');
  weblet.obj.ansatz = weblet.eleGetById(weblet.frame, 'ansatz_input');

  weblet.obj.kosten = weblet.eleGetById(weblet.frame, 'kosten_input');
  weblet.inClear(weblet.obj.kosten);
  weblet.create_checkpopup(weblet.obj.kosten, weblet.inChecktype.float);
  
  weblet.obj.zuschlag = weblet.eleGetById(weblet.frame, 'zuschlag_input');
  weblet.inClear(weblet.obj.zuschlag);
  weblet.create_checkpopup(weblet.obj.zuschlag, weblet.inChecktype.float);

  weblet.obj.zeit = weblet.eleGetById(weblet.frame, 'zeit_input');
  weblet.inClear(weblet.obj.zeit);
  weblet.create_checkpopup(weblet.obj.zeit, weblet.inChecktype.float);
  
  weblet.obj.besonders = weblet.eleGetById(weblet.frame, 'besonders_input');
  weblet.inClear(weblet.obj.besonders);
  weblet.create_checkpopup(weblet.obj.besonders, weblet.inChecktype.float);

  weblet.obj.zusatz = weblet.eleGetById(weblet.frame, 'zusatz_input');
  weblet.inClear(weblet.obj.zusatz);
  weblet.create_checkpopup(weblet.obj.zusatz, weblet.inChecktype.float);
 
  weblet.obj.nebenkosten = weblet.eleGetById(weblet.frame, 'nebenkosten_input');
  weblet.inClear(weblet.obj.nebenkosten);
  weblet.create_checkpopup(weblet.obj.nebenkosten, weblet.inChecktype.float);

  weblet.obj.leistung = weblet.eleGetById(weblet.frame, 'leistung_input');
  weblet.obj.zuschlagr = weblet.eleGetById(weblet.frame, 'zuschlagr_input');
  weblet.obj.nebenkostenr = weblet.eleGetById(weblet.frame, 'nebenkostenr_input');
  weblet.obj.gesammt = weblet.eleGetById(weblet.frame, 'gesammt_input');

  weblet.obj.pauschal = weblet.eleGetById(weblet.frame, 'pauschal_input');

  weblet.obj.leistung.disabled = true;
  weblet.obj.zuschlagr.disabled = true;
  weblet.obj.nebenkostenr.disabled = true;
  weblet.obj.gesammt.disabled = true;

  weblet.obj.l1 = weblet.eleGetById(weblet.frame, 'value1r_output');
  weblet.obj.l2 = weblet.eleGetById(weblet.frame, 'value2r_output');
  weblet.obj.l3 = weblet.eleGetById(weblet.frame, 'value3r_output');
  weblet.obj.l4 = weblet.eleGetById(weblet.frame, 'value4r_output');
  weblet.obj.l5 = weblet.eleGetById(weblet.frame, 'value5r_output');
  weblet.obj.l6 = weblet.eleGetById(weblet.frame, 'value6r_output');
  weblet.obj.l7 = weblet.eleGetById(weblet.frame, 'value7r_output');
  weblet.obj.l8 = weblet.eleGetById(weblet.frame, 'value8r_output');
  weblet.obj.l9 = weblet.eleGetById(weblet.frame, 'value9r_output');

  weblet.obj.zonename = new Array('I', 'II', 'III', 'IV', 'V');
  weblet.obj.ansatzname = new Array({name : 'Mindestansatz', value : 0}, {name : 'Viertelansatz', value : 0.25},{name : 'Halbansatz', value : 0.5},{name : 'Dreiviertelansatz', value : 0.75},{name : 'Höchstansatz', value : 1});

  for ( i = 0; i< weblet.obj.ansatzname.length; i++)
  {
    weblet.obj.ansatz.appendChild(weblet.doc.createElement('option'));
    weblet.obj.ansatz.lastChild.appendChild(weblet.doc.createTextNode(weblet.obj.ansatzname[i].name));
    weblet.obj.ansatz.lastChild.value = weblet.obj.ansatzname[i].value;
  }

  weblet.showids = new Array('law');
       
  weblet.showValue = function(weblet)
  {
    var i,endzone;
    
    if ( this.obj.inshowValue == true ) return;
    
    try
    {
      this.obj.inshowValue = true;

      if ( weblet == null || typeof weblet.act_values.law == 'undefined')
      {
        this.obj.inputs.year.value = '2013';
        this.change_year();
        this.obj.inputs.law.value = this.initpar.law;
      }

      if ( weblet != null && weblet != this )
        this.obj.refid = weblet.act_values[this.initpar.refid];

      this.act_values.law = this.obj.inputs.law.value;
      MneAjaxWeblet.prototype.showValue.call(this,this);

      var param =
      {
          schema : this.initpar.schema,
          table  : this.initpar.feetable,

          cols : 'zone',
          scols : 'zone',

          distinct : '1',

          "lawInput.old" : this.act_values.law,
          sqlend : 1
      }

            
      var ajax = new MneAjaxData(this.win);
      endzone = 0;
      ajax.read('/db/utils/table/data.xml', param);
      if ( ajax.values.length > 0 ) endzone = ajax.values[ajax.values.length-1][0];

      while ( this.obj.zone.firstChild != null ) this.obj.zone.removeChild(this.obj.zone.firstChild);
      for ( i = 0; i< endzone; i++)
      {
        this.obj.zone.appendChild(this.doc.createElement('option'));
        this.obj.zone.lastChild.appendChild(this.doc.createTextNode(this.obj.zonename[i]));
        this.obj.zone.lastChild.value = i + 1;

      }
      for ( i = 1; i<10; i++ ) this.obj['l' + i].innerHTML = '';

      this.obj.leistung.value = '';
      this.obj.zuschlagr.value = '';
      this.obj.nebenkostenr.value = '';
      this.obj.gesammt.value = '';

      this.obj.buttons.ok.disabled = true;

      if ( weblet != null && weblet != this )
      {
        var param =
        {
            schema : this.initpar.vschema,
            query  : this.initpar.vquery,

            cols: 'l1,l2,l3,l4,l5,l6,l7,l8,l9,ansatz,besonders,kosten,law,neben,zeit,zone,zusatz,zuschlag,pauschal,year',

            distinct : '1',

            sqlend : 1
        }

        param[this.initpar.refid + "Input.old"] = this.obj.refid;


        ajax.read('/db/utils/query/data.xml', param);

        if ( ajax.values.length > 0 )
        {
          this.showInput(this.obj.inputs.year, ajax.values[0][19]);
          if ( this.act_values.year != ajax.values[0][19] )
          {
            this.act_values.year = ajax.values[0][19];
            this.change_year();
          }
          
          this.showInput(this.obj.inputs.law, ajax.values[0][12]);
          this.act_values.law = ajax.values[0][12];

          this.obj.ansatz.value = ajax.values[0][9];
          this.obj.besonders.value =ajax.values[0][10];
          this.obj.kosten.value = ajax.values[0][11];
          this.obj.nebenkosten.value = ajax.values[0][13];
          this.obj.zeit.value = ajax.values[0][14];
          this.obj.zone.value =ajax.values[0][15];
          this.obj.zusatz.value = ajax.values[0][16];
          this.obj.zuschlag.value = ajax.values[0][17];
          this.showInput(this.obj.pauschal, ajax.values[0][18]);

          this.obj.inputs.value1.value = ajax.values[0][0];
          this.obj.inputs.value2.value = ajax.values[0][1];
          this.obj.inputs.value3.value = ajax.values[0][2];
          this.obj.inputs.value4.value = ajax.values[0][3];
          this.obj.inputs.value5.value = ajax.values[0][4];
          this.obj.inputs.value6.value = ajax.values[0][5];
          this.obj.inputs.value7.value = ajax.values[0][6];
          this.obj.inputs.value8.value = ajax.values[0][7];
          this.obj.inputs.value9.value = ajax.values[0][8];

          {
            var w = this;
            this.win.setTimeout(function() { w.showInput(w.obj.inputs.law, w.act_values.law); w.compute(true);}, 0);
          }

        }
      }
    }
    catch(e)
    {
      this.obj.inshowValue = false;
      throw(e);
    }
    
    this.obj.inshowValue = false;
    
  }

  weblet.change_year = function()
  {
    var i;
    var data = new Array(this.obj.inputs.law.id, 'mne_hoai', 'fee', '', 'year', '=', this.obj.inputs.year.value, 'feenameid,law', 'feenameid', 'feenameid', '', '', '');
    this.create_inputlist_select(this.obj.inputs.law, 'law', data );

    for ( i = 1; i<10; i++ ) this.obj['l' + i].innerHTML = '';
    for ( i = 1; i<10; i++ ) this.obj.inputs['value' + i].value = '';

    this.obj.leistung.value = '';
    this.obj.zuschlagr.value = '';
    this.obj.nebenkostenr.value = '';
    this.obj.gesammt.value = '';

    this.obj.buttons.ok.disabled = true;
    return false;
  }

  weblet.compute = function(modifyno)
  {
    var i;
    var result;
    var param = 
    {
        schema : this.initpar.schema,
        table  : this.initpar.feetable,
        
        cols   : 'startfee,endfee,cost',
        wcol   : 'law,cost,zone',
        scols  : '!cost',
        
        sqlend : "1"
    }
    
    var k = this.txtMkValue(this.obj.kosten.value)
    if ( k.indexOf('.') != -1 ) k = k.substr(0, k.indexOf("."));
    
    param.wop = '=,<,=';
    param.wval = this.obj.inputs.law.value + ',' + k + ',' + this.obj.zone.value;
    
    MneAjaxData.prototype.read.call(this,'/db/utils/table/data.xml', param);
    if ( this.values.length == 0 )
    {
      this.warning("Honorar kann frei vereinbart werden");
      return false;
    }
        
    mne_config.locale.thousands_sep
    
    var lmin  = parseFloat(this.txtMkValue(this.values[0][0]));
    var lmax  = parseFloat(this.txtMkValue(this.values[0][1]));
    var lcost = parseFloat(this.txtMkValue(this.values[0][2]));

    param.wop = '=,>=,=';
    param.scols = 'cost';
        
    MneAjaxData.prototype.read.call(this,'/db/utils/table/data.xml', param);
    if ( this.values.length == 0 )
    {
      this.warning("Honorar kann frei vereinbart werden");
      return false;
    }

    var umin  = parseFloat(this.txtMkValue(this.values[0][0]));
    var umax  = parseFloat(this.txtMkValue(this.values[0][1]));
    var ucost = parseFloat(this.txtMkValue(this.values[0][2]));

    var cost = parseFloat(this.txtMkValue(this.obj.kosten.value));
    
    var minsatz = lmin + (( umin - lmin ) / ( ucost - lcost )) * ( cost - lcost );
    var maxsatz = lmax + (( umax - lmax ) / ( ucost - lcost )) * ( cost - lcost );
      
    var satz = minsatz + (( maxsatz - minsatz ) * parseFloat(this.obj.ansatz.value));
    
    if ( modifyno != true )
      this.obj.pauschal.checked = ( satz < 10000 );
    
    if ( this.obj.zuschlag.value == '' ) this.obj.zuschlag.value = 0;
    if ( this.obj.zeit.value == '' ) this.obj.zeit.value = 0;
    if ( this.obj.besonders.value == '' ) this.obj.besonders.value = 0;
    if ( this.obj.zusatz.value == '' ) this.obj.zusatz.value = 0;
    if ( this.obj.nebenkosten.value == '' ) this.obj.nebenkosten.value = 0;

    this.obj.leistung.value = this.txtMkIValue(parseFloat(parseInt(satz * 100.0)) / 100.0);
    this.obj.zuschlagr.value = this.txtMkIValue(parseInt((parseFloat(this.txtMkValue(this.obj.zuschlag.value)) / 100.0 * satz) * 100 ) / 100.0);
    this.obj.nebenkostenr.value = parseInt((parseFloat(this.obj.nebenkosten.value) / 100 ) * ( satz + (parseFloat(this.obj.zuschlag.value) / 100.0 * satz) + parseFloat(this.obj.zusatz.value) + parseFloat(this.obj.besonders.value) + parseFloat(this.obj.zeit.value)) * 100) / 100;
    this.obj.gesammt.value = parseInt(( satz + parseFloat(this.obj.zuschlagr.value) + parseFloat(this.obj.zusatz.value) + parseFloat(this.obj.besonders.value) + parseFloat(this.obj.zeit.value) + parseFloat(this.obj.nebenkostenr.value)) * 100) / 100;

    this.obj.nebenkostenr.value = this.txtMkIValue(parseInt((parseFloat(this.txtMkValue(this.obj.nebenkosten.value)) / 100 ) * ( satz + (parseFloat(this.txtMkValue(this.obj.zuschlag.value)) / 100.0 * satz) + parseFloat(this.txtMkValue(this.obj.zusatz.value)) + parseFloat(this.txtMkValue(this.obj.besonders.value)) + parseFloat(this.txtMkValue(this.obj.zeit.value))) * 100) / 100);
    this.obj.gesammt.value = this.txtMkIValue(parseInt(( satz + parseFloat(this.txtMkValue(this.obj.zuschlagr.value)) + parseFloat(this.txtMkValue(this.obj.zusatz.value)) + parseFloat(this.txtMkValue(this.obj.besonders.value)) + parseFloat(this.txtMkValue(this.obj.zeit.value)) + parseFloat(this.txtMkValue(this.obj.nebenkostenr.value))) * 100) / 100);

    if ( this.obj.inputs.value1.value != '' ) this.obj.l1.innerHTML = '= ' + this.txtMkIValue(parseInt(( satz * parseFloat(this.txtMkValue(this.obj.inputs.value1.value)) / 100.0 ) * 100 + 0.5) / 100);
    if ( this.obj.inputs.value2.value != '' ) this.obj.l2.innerHTML = '= ' + this.txtMkIValue(parseInt(( satz * parseFloat(this.txtMkValue(this.obj.inputs.value2.value)) / 100.0 ) * 100 + 0.5) / 100);
    if ( this.obj.inputs.value3.value != '' ) this.obj.l3.innerHTML = '= ' + this.txtMkIValue(parseInt(( satz * parseFloat(this.txtMkValue(this.obj.inputs.value3.value)) / 100.0 ) * 100 + 0.5) / 100);
    if ( this.obj.inputs.value4.value != '' ) this.obj.l4.innerHTML = '= ' + this.txtMkIValue(parseInt(( satz * parseFloat(this.txtMkValue(this.obj.inputs.value4.value)) / 100.0 ) * 100 + 0.5) / 100);
    if ( this.obj.inputs.value5.value != '' ) this.obj.l5.innerHTML = '= ' + this.txtMkIValue(parseInt(( satz * parseFloat(this.txtMkValue(this.obj.inputs.value5.value)) / 100.0 ) * 100 + 0.5) / 100);
    if ( this.obj.inputs.value6.value != '' ) this.obj.l6.innerHTML = '= ' + this.txtMkIValue(parseInt(( satz * parseFloat(this.txtMkValue(this.obj.inputs.value6.value)) / 100.0 ) * 100 + 0.5) / 100);
    if ( this.obj.inputs.value7.value != '' ) this.obj.l7.innerHTML = '= ' + this.txtMkIValue(parseInt(( satz * parseFloat(this.txtMkValue(this.obj.inputs.value7.value)) / 100.0 ) * 100 + 0.5) / 100);
    if ( this.obj.inputs.value8.value != '' ) this.obj.l8.innerHTML = '= ' + this.txtMkIValue(parseInt(( satz * parseFloat(this.txtMkValue(this.obj.inputs.value8.value)) / 100.0 ) * 100 + 0.5) / 100);
    if ( this.obj.inputs.value9.value != '' ) this.obj.l9.innerHTML = '= ' + this.txtMkIValue(parseInt(( satz * parseFloat(this.txtMkValue(this.obj.inputs.value9.value)) / 100.0 ) * 100 + 0.5) / 100);

    var mod = "modifyok";
    
    if ( modifyno == true )
        mod = "modifyno"

    this.eleMkClass(this.obj.l1, mod, true, "modify");
    this.eleMkClass(this.obj.l2, mod, true, "modify");
    this.eleMkClass(this.obj.l3, mod, true, "modify");
    this.eleMkClass(this.obj.l4, mod, true, "modify");
    this.eleMkClass(this.obj.l5, mod, true, "modify");
    this.eleMkClass(this.obj.l6, mod, true, "modify");
    this.eleMkClass(this.obj.l7, mod, true, "modify");
    this.eleMkClass(this.obj.l8, mod, true, "modify");
    this.eleMkClass(this.obj.l9, mod, true, "modify");
    
    this.inClear(this.obj.kosten);
    this.inClear(this.obj.zuschlag);
    this.inClear(this.obj.zeit);
    this.inClear(this.obj.besonders);
    this.inClear(this.obj.zusatz );
    this.inClear(this.obj.nebenkosten);

    this.clearModify();

    this.obj.buttons.ok.disabled = false;
    return false;
  }

  weblet.ok = function()
  {
    var p;
    
    if ( typeof this.obj.refid == 'undefined' ) 
    {
      this.error('#mne_lang#Keine Referenz ausgewählt#');
      return true;
    }
    
    p =
    {
        schema : this.initpar.schema,
        name  : this.initpar.okfunction,
        typ0  : "text",
        typ1  : "text",
        typ2  : "double",
        typ3  : "double",
        typ4  : "double",
        typ5  : "double",
        typ6  : "double",
        typ7  : "double",
        typ8  : "double",
        typ9  : "double",
        typ10 : "double",
        typ11 : "double",
        typ12 : "double",
        typ13 : "double",
        typ14 : "double",
        typ15 : "double",
        typ16 : "double",
        typ17 : "bool"
    }
 
    p = this.addParam(p, "par0", this.obj.refid);
    p = this.addParam(p, "par1", this.obj.inputs.law);
    p = this.addParam(p, "par2", this.obj.leistung.value);
    p = this.addParam(p, "par3", this.obj.zuschlagr.value);
    p = this.addParam(p, "par4", this.obj.zeit.value);
    p = this.addParam(p, "par5", this.obj.besonders.value);
    p = this.addParam(p, "par6", this.obj.zusatz.value);
    p = this.addParam(p, "par7", this.obj.nebenkostenr.value);
    p = this.addParam(p, "par8", this.obj.l1.innerHTML.substr(2));
    p = this.addParam(p, "par9", this.obj.l2.innerHTML.substr(2));
    p = this.addParam(p, "par10", this.obj.l3.innerHTML.substr(2));
    p = this.addParam(p, "par11", this.obj.l4.innerHTML.substr(2));
    p = this.addParam(p, "par12", this.obj.l5.innerHTML.substr(2));
    p = this.addParam(p, "par13", this.obj.l6.innerHTML.substr(2));
    p = this.addParam(p, "par14", this.obj.l7.innerHTML.substr(2));
    p = this.addParam(p, "par15", this.obj.l8.innerHTML.substr(2));
    p = this.addParam(p, "par16", this.obj.l9.innerHTML.substr(2));
    p = this.addParam(p, "par17", this.obj.pauschal.checked);
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok' )
    {
      var val = {};
      val['law'] = this.obj.inputs.law.value;
      val[this.initpar.refid] = this.obj.refid;
      
      p = 
        {
          schema : this.initpar.vokschema,
          table  : this.initpar.voktable,
          
          l1Input : this.obj.inputs.value1.value,
          l2Input : this.obj.inputs.value2.value,
          l3Input : this.obj.inputs.value3.value,
          l4Input : this.obj.inputs.value4.value,
          l5Input : this.obj.inputs.value5.value,
          l6Input : this.obj.inputs.value6.value,
          l7Input : this.obj.inputs.value7.value,
          l8Input : this.obj.inputs.value8.value,
          l9Input : this.obj.inputs.value9.value,
          
          ansatzInput    : this.obj.ansatz.value,
          besondersInput : this.obj.besonders.value,
          kostenInput    : this.obj.kosten.value,
          lawInput       : this.obj.inputs.law.value,
          nebenInput     : this.obj.nebenkosten.value,
          zeitInput      : this.obj.zeit.value,
          zoneInput      : this.obj.zone.value,
          zusatzInput    : this.obj.zusatz.value,
          zuschlagInput  : this.obj.zuschlag.value,
          pauschalInput  : this.obj.pauschal.checked,

          modifyinsert   : 1,
          sqlend : 1
        };
      
      p[this.initpar.refid + "Input"]     = this.obj.refid;
      p[this.initpar.refid + "Input.old"] = this.obj.refid;

      if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest['mod'],  p ) == 'ok' )
      {
        this.setDepends('ok');
        this.showValue({ act_values : val });
        return false;
      }
      
      return true;
    }
    
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {rollback: "true"} );
  }

}
