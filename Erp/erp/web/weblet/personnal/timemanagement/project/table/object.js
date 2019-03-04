// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/timemanagement/project/table
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");
  weblet.loadClass("MneAjaxMonthTable", "time/mne_amonth.js");

  var ivalues = 
  {
      schema    : 'mne_personnal',
      query     : 'orderproducttimemanagement',
      table     : 'orderproducttime',

      orderlistschema : 'mne_crm',
      orderlistquery  : 'order_detail',
      orderlistcols   : 'refname,ordernumber,description',
      orderlistwcol   : 'closed',
      orderlistwval   : 'false',
      orderlistwop    : '=',
      orderlistscols  : 'refname,ordernumber,description',

      styleName : 'style.css'
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  weblet.obj.mkbuttons = [];

  var attr = 
  {
      hinput : true,
      monthInput : { selectlist : "monthname",  onchange : function() { this.weblet.setMonth(this.value); } },
      yearInput  : { onreturn   : function() { return this.weblet.setYear(this.value);} },
      namesTable : { "style.overflow" : "auto" },
      timesTable : { "style.overflow" : "auto" }
  }
  
  weblet.findIO(attr);
  //weblet.showLabel();
  weblet.obj.title = null;
  weblet.create_checkpopup(weblet.obj.inputs.year, { reg : new RegExp("[12][0-9][0-9][0-9]"), help : "#mne_lang#Bitte eine Jahreszahl eingeben"});

  weblet.showValue = function(weblet)
  {
    if ( typeof this.act_month == 'undefined' )
    {
      var m = new Date();
      this.act_month = m.getMonth();
      this.act_year = m.getFullYear()
    }
    if ( weblet == null || typeof weblet.act_values.orderid == 'undefined' )
    {
      this.readOrderlist();
      this.obj.ptable = new MneAjaxMonthTable(this.obj.tables.names, this.obj.tables.times, "personnal_timemanagement_project", this.names, 1);
      this.obj.ptable.weblet = this;
      this.obj.ptable.start = 2;
      this.obj.ptable.no_select = 1;
      this.obj.ptable.mk_month(this.act_month, this.act_year);
      this.obj.inputs.month.value = this.act_month;
      this.obj.inputs.year.value = this.act_year;
      this.showOrders();
    }
    else
    {
      var i,j;
      for ( i=0; i<this.obj.orders.length; i++)
        if ( this.obj.orders[i].orderid == weblet.act_values.orderid)
        {
          this.mk_ordertime(i);
          this.setDepends("showValue");
          break;
        }        
    }
    this.clearModify();
  }    

  weblet.readOrderlist = function() 
  {
    var param =
    {
        "schema" : this.initpar.orderlistschema,
        "query"  : this.initpar.orderlistquery,
        "cols"   : "orderid,color," + this.initpar.orderlistcols,
        "scols"  : this.initpar.orderlistscols,
        "wcol"   : this.initpar.orderlistwcol,
        "wop"    : this.initpar.orderlistwop,
        "wval"   : this.initpar.orderlistwval,
        "sqlend" : 1
    };
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param );

  }

  weblet.readOrder = function() 
  {
    var param =
    {
        "schema" : this.initpar.schema,
        "query"  : this.initpar.query,
        "cols"   : "timemanagementid,startday,starttime,duration,timetyp,color,position",
        "scols"  : "position",
        "wcol"   : "orderid,timemanagementid",
        "wop"    : "=,!=",
        "wval"   : this.act_values.orderid + ",",
        "sqlend" : 1
    };
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param );
  }

  weblet.showOrders = function()
  {
    var i;
    
    this.obj.orders = new Array();
    
    for ( i=0; i<this.values.length; i++)
    {
      var str = "";
      
      this.obj.orders[i] = new Object;
      this.obj.orders[i].orderid = this.values[i][0];
     
      this.obj.ptable.dadd(i, this.values[i], this.values[i][1]);
      this.obj.ptable.madd();
    }

    for ( i = 0; i<this.obj.orders.length; i++)
    {
      try { this.mk_ordertime(i); } catch(e) { this.exception("showorders", e) };
    }
  }

  weblet.mk_ordertime = function(num)
  {
    var i,j;
    var obj = this.obj.orders[num];

    this.act_values.orderid = obj.orderid;
    obj.ids = new Array();
    obj.typs = new Array();
    obj.names = new Array();
    obj.values = new Array();
    this.readOrder();

    for ( i in this.ids )
    {
      obj.ids[obj.ids.length] = i; 
      obj.typs[i] = this.typs[this.ids[i]];
      obj.names[i] = this.names[this.ids[i]];
    }
    
    this.obj.ptable.clearElements(num);
    for ( j=0; j<this.values.length; j++ )
    {
      obj.values[j] = new Object;
      for ( i in this.ids )
      {
        obj.values[j][i] = this.values[j][this.ids[i]]; 
        this.obj.ptable.setElement(num,this.values[j][this.ids['timemanagementid']], this.values[j][this.ids['startday']],this.values[j][this.ids['starttime']],this.values[j][this.ids['duration']], this.values[j][this.ids['color']], '')
      }
    }
  }
  
  weblet.dselect = function(num)
  {
    this.act_values = {};
    for ( i in this.obj.orders[num])
      this.act_values[i] = this.obj.orders[num][i];
    
    this.setDepends("dselect");
  }
  
  weblet.mselect = function(num, id)
  {
    this.act_values = {};
    for ( i in this.obj.orders[num])
      this.act_values[i] = this.obj.orders[num][i];
    
    this.setDepends("mselect");
  }
  
  weblet.setMonth = function(month)
  {
    this.act_month = month;
    this.obj.ptable.mk_month(this.act_month, this.act_year);

    this.obj.inputs.month.value = this.act_month;
    this.obj.inputs.year.value = this.act_year;

    for ( i = 0; i<this.obj.orders.length; i++)
    {
      this.obj.ptable.madd();
      this.mk_ordertime(i);
    }
   
    return true;
  }
  
  weblet.setYear = function(value)
  {
    this.act_year = value;
    weblet.setMonth(this.act_month);
    return false;
    
  }
  
  weblet.next = function()
  {
    this.act_month++;
    if ( this.act_month == 12 )
    {
      this.act_month = 0;
      this.act_year++;
    }
    weblet.setMonth(this.act_month);
    return false;
  }
  
  weblet.prev = function()
  {
    this.act_month--;
    if ( this.act_month == -1 )
    {
      this.act_month = 11;
      this.act_year--;
    }
    
    weblet.setMonth(this.act_month);
    return false;
 }

}
