// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: builddiary/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_builddiary',
    query     : 'time_detail',

    okschema : 'mne_builddiary',
    okfunction : 'bdtime_ok',
    
    delschema : 'mne_builddiary',
    delfunction : 'bdtime_del',
    
    report : 'mne_builddiary_detail',
    
    weatherlist : 'builddiary_weather'
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  
  weblet.obj.mkbuttons.push( { id : 'print2', value : weblet.txtGetText('#mne_lang#Blatt drucken#'), behind : 'print'});

  var attr = 
  {
      hinput            : weblet.initpar.hinput == true,
      clocktimeInput    : { inputtyp : 'time'},
      clocktimeendInput : { inputtyp : 'time'},
      orderidInput      : { notclear : true, inputcheckobject : 'ordernumber'  },
      ordernumberOutput : { notclear : true  },     
      prevButton        : { onmousedown : function() { this.weblet.eleMkClass(this, 'docprevdown', true)}, onmouseup : function() { this.weblet.eleMkClass(this, 'docprevdown', false)}},
      nextButton        : { onmousedown : function() { this.weblet.eleMkClass(this, 'docnextdown', true)}, onmouseup : function() { this.weblet.eleMkClass(this, 'docnextdown', false)}},
      orderdescriptionOutput : { notclear : true  }   
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("timeid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Bautagebucheintrag hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Bautagebucheintrag bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Bautagebucheintrag <$1> wirklich löschen ?");
  weblet.titleString.delid = 'date';     
  
  weblet.defvalues = { weather : 'bewölkt', clocktime : 0, clocktimeend : 0, date : parseInt(new Date().getTime() / 1000) };
  weblet.obj.timevalues = null;
  
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.timeid == 'undefined' || weblet.act_values.timeid == null || weblet.act_values.timeid == '################' )
      this.add();
    else
      MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    
  
  weblet.ok = function()
  {
    var duration;
    var retval;
    
    var value  = parseInt(this.act_values.date) + parseInt(this.obj.inputs.clocktime.mne_timevalue);
    if ( ( "" + value ) == "NaN" || this.obj.inputs.clocktime.getModify() == 'modifywrong' )
    {
      this.error("#mne_lang#Bitte die Zeiteingaben überprüfen");
      return '';
    }

    duration = parseInt(this.act_values.date) + parseInt(this.obj.inputs.clocktimeend.mne_timevalue) - value;
    if ( ( "" + duration ) == "NaN" || this.obj.inputs.clocktimeend.getModify() == 'modifywrong' )
    {
      this.error("#mne_lang#Bitte die Zeiteingaben überprüfen");
      return '';
    }

    var p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,

        typ0 : "text",
        typ1 : "text",
        typ2 : "long",
        typ3 : "long",
        typ4 : "text",
        typ5 : 'long',

        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.timeid);
    p = this.addParam(p, "par1", this.obj.inputs.orderid);
    p = this.addParam(p, "par2", value);
    p = this.addParam(p, "par3", duration);
    p = this.addParam(p, "par4", this.obj.inputs.weather);
    p = this.addParam(p, "par5", this.obj.inputs.temperature);

    retval = MneAjaxWeblet.prototype.func.call(this, p, 'timeid');
    return retval;

  }
   
  weblet.del = function()
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
     return false;
    
    this.obj.timeidlist = null;
    
    var p =
    {
        schema : this.initpar.delschema,
        name : this.initpar.delfunction,
        
        par0 : this.getParamValue(this.obj.inputs.timeid),
        typ0 : "text",
        
        sqlend : 1   
    }
    return MneAjaxWeblet.prototype.func.call(this, p);
  }

  weblet.print = function()
  {
      var p = {};

      p.schema = "";
      p.query  = "";
      p.table = "";
      p["orderidInput.old"] = this.obj.inputs.orderid.value;
      p["timeidInput.old"] = '';
      p["timeidOp.old"] = "is not null";
      
      return MneAjaxWeblet.prototype.print.call(this,p);
  }

  weblet.print2 = function()
  {
      var p = {};

      p.schema = "";
      p.query  = "";
      p.table = "";
      p["orderidInput.old"] = this.obj.inputs.orderid.value;
      p["timeidInput.old"] = this.act_values.timeid;
      p["macro0"] = "Brownum," + this.act_values.rownum;
      
      return MneAjaxWeblet.prototype.print.call(this,p);
  }

  weblet.readtimeids = function(prev)
  {
    if ( this.obj.timelist == null || this.obj.timelist.length == 0 )
    {
      var i;
      var p =
      {
          schema : this.initpar.schema,
          query  : this.initpar.query,

          cols   : "timeid,start",
          scols  : "start",
          "orderidInput.old" : this.obj.inputs.orderid.value
      };
      
      this.obj.timelist = new Array();
      
      var data = new MneAjaxData(this.win);
      data.read("/db/utils/query/data.xml", p)
      
      for ( i=0; i< data.values.length; i++)
      {
        this.obj.timelist[this.obj.timelist.length] = data.values[i][0];
      }

      this.obj.timelistpos = ( prev ) ? this.obj.timelist.length - 1 : 0 ;
    }
  } 
  
  weblet.prev = function()
  {
    var i;
    this.readtimeids(true);

    if ( this.act_values.timeid == '################' )
      this.obj.timelistpos = 1;
    else
    {

      while ( this.obj.timelistpos > 0 && this.obj.timelist[this.obj.timelistpos] != this.act_values.timeid )
      {
        this.obj.timelistpos--;
      }
    }

    if ( this.obj.timelistpos != 0 )
    {
      this.act_values.timeid = this.obj.timelist[--this.obj.timelistpos];
      this.showValue(this);
      this.setDepends('prev');
    }
    else
    {
      this.obj.timelist = null;
    }

    return false;
  }

  weblet.next = function()
  {
    var i;
    this.readtimeids();

    if ( this.act_values.timeid == '################' )
      this.obj.timelistpos = -1;
    else
    {
      while ( this.obj.timelistpos < this.obj.timelist.length && this.obj.timelist[this.obj.timelistpos] != this.act_values.timeid )
      {
        this.obj.timelistpos++;
      }
    }

    if ( this.obj.timelistpos < ( this.obj.timelist.length - 1 ) )
    {
      this.act_values.timeid = this.obj.timelist[++this.obj.timelistpos];
      this.showValue(this);
      this.setDepends('next');
    }
    else
    {
      this.obj.timelist = null;
    }

    return false;
  }
  
  weblet.onbtnok = function(button)
  {
    if ( button.weblet.oid  == 'selectday' || button.weblet.oid == ( this.oid + "inputlistordernumber" ) )
    {
      var inputlist = this.inputlist;
      this.add();
      this.inputlist = inputlist;
    }
    
    return MneAjaxWeblet.prototype.onbtnok.call(this, button);
  }

}
