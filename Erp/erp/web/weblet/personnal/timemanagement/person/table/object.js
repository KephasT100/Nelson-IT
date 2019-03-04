// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/timemanagement/person/table
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");
  weblet.loadClass("MneAjaxMonthTable", "time/mne_amonth.js");

  var ivalues = 
  {
      schema    : 'mne_personnal',
      query     : 'persontimemanagement',
 
      listschema    : 'mne_personnal',
      listquery     : 'personskill',
 
      listcols   : 'lastname,firstname',
      listwcol   : 'skillid',
      listwval   : '%',
      listwop    : 'like',
      listscols  : 'lastname,firstname',

      styleName : 'style.css',
      
      dweblet : 'time'
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  
  weblet.obj.mkbuttons = [];

  var attr = 
  {
      hinput : false,
      monthInput : { selectlist : "monthname",  onchange : function() { this.weblet.setMonth(this.value); } },
      yearInput  : { onreturn   : function() { return this.weblet.setYear(this.value);} },
      namesTable : { "style.overflow" : "auto" },
      timesTable : { "style.overflow" : "auto" }
  }
  
  weblet.findIO(attr);
  //weblet.showLabel();
  weblet.obj.title = null;
  weblet.obj.act_num = -1;
  
  weblet.create_checkpopup(weblet.obj.inputs.year, { reg : new RegExp("[12][0-9][0-9][0-9]"), help : "#mne_lang#Bitte eine Jahreszahl eingeben"});
  
  weblet.showValue = function(weblet)
  {
    if ( typeof this.act_month == 'undefined' )
    {
      var m = new Date();
      this.act_month = m.getMonth();
      this.act_year = m.getFullYear()
    }
    if ( weblet == null || typeof weblet.act_values.personid == 'undefined' )
    {
      this.readPersonlist();
      this.obj.ptable = new MneAjaxMonthTable(this.obj.tables.names, this.obj.tables.times, "personnal_timemanagement_person", this.names, 1);
      this.obj.ptable.start = 2;
      this.obj.ptable.weblet = this;
      this.obj.ptable.mk_month(this.act_month, this.act_year);
      this.obj.inputs.month.value = this.act_month;
      this.obj.inputs.year.value = this.act_year;
      this.showPersons();
    }
    else
    {
      var i,j;
      for ( i=0; i<this.obj.persons.length; i++)
        if ( this.obj.persons[i].personid == weblet.act_values.personid)
        {
          this.mk_persontime(i);
          break;
        }        
    }
    this.clearModify();
  }    

  weblet.readPersonlist = function() 
  {
    var param =
    {
        "schema" : this.initpar.listschema,
        "query"  : this.initpar.listquery,
        "cols"   : "personid,color," + this.initpar.listcols,
        "scols"  : this.initpar.listscols,
        "wcol"   : this.initpar.listwcol,
        "wop"    : this.initpar.listwop,
        "wval"   : this.initpar.listwval,
        "distinct" : true,
        "sqlend" : 1
    };
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param );

  }

  weblet.readPersontime = function() 
  {
    var param =
    {
        "schema" : this.initpar.schema,
        "query"  : this.initpar.query,
        "cols"   : "timemanagementid,startday,starttime,duration,timetyp,color,position",
        "scols"  : "start",
        "wcol"   : "personid",
        "wop"    : "=",
        "wval"   : this.act_values.personid,
        "sqlend" : 1
    };
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param );
  }

  weblet.showPersons = function()
  {
    var i,j;
    
    this.obj.persons = new Array();
    
    for ( i=0; i<this.values.length; i++)
    {
      var str = "";
      
      this.obj.persons[i] = new Object;
      for ( j in this.ids )
        this.obj.persons[i][j] = this.values[i][this.ids[j]];
      
      this.obj.ptable.dadd(i, this.values[i], this.values[i][1]);
      this.obj.ptable.madd();
    }

    for ( i = 0; i<this.obj.persons.length; i++)
      this.mk_persontime(i);
    
  }

  weblet.mk_persontime = function(num)
  {
    var i,j;
    var obj = this.obj.persons[num];

    this.act_values.personid = obj.personid;
    obj.ids = new Array();
    obj.typs = new Array();
    obj.names = new Array();
    obj.values = new Array();
    this.readPersontime();

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
        obj.values[j][i] = this.values[j][this.ids[i]]; 

      this.obj.ptable.setElement(num,this.values[j][this.ids['timemanagementid']], this.values[j][this.ids['startday']],this.values[j][this.ids['starttime']],this.values[j][this.ids['duration']], this.values[j][this.ids['color']],this.values[j][this.ids['position']])
    }
  }
  
  weblet.dselect = function(num)
  {
    this.act_values = {};
    for ( i in this.obj.persons[num])
      this.act_values[i] = this.obj.persons[num][i];

    this.parent.weblets[this.initpar.dweblet].setPerson(this);
  }
  
  weblet.mselect = function(num, id, startdate, clocktime, duration)
  {
    this.act_values = {};
    for ( i in this.obj.persons[num])
      this.act_values[i] = this.obj.persons[num][i];

    if ( typeof id != 'undefined' && id != '' )
      this.parent.weblets[this.initpar.dweblet].showValue({ act_values: { timemanagementid : id}});
    else
      this.parent.weblets[this.initpar.dweblet].add();
      
    this.parent.weblets[this.initpar.dweblet].setPerson(this);

    if ( typeof startdate != 'undefined' )
    {
      this.parent.weblets[this.initpar.dweblet].setTime(startdate, clocktime, duration);
      this.parent.weblets[this.initpar.dweblet].ok();
    }
  }
  
  weblet.mdel = function(num, id )
  {
    this.parent.weblets[this.initpar.dweblet].showValue({ act_values: { timemanagementid : id}});
    this.parent.weblets[this.initpar.dweblet].del();
  }
   
  
  weblet.setSkill = function(weblet)
  {
    this.initpar.listwval = weblet.act_values.skillid;
    {
      var self = this;
      var timeout = function() { self.showValue(null); }
      window.setTimeout(timeout, 500);
    }
  }
  
  
  weblet.starttime = function(obj)
  {
    this.obj.act_num = obj.act_num;
    this.obj.act_starttime = obj.act_starttime;
    this.obj.act_endtime = obj.act_endtime;
    
    this.dselect(obj.act_num);
  }
  
  weblet.setMonth = function(month)
  {
    this.act_month = month;
    this.obj.ptable.mk_month(this.act_month, this.act_year);

    this.obj.inputs.month.value = this.act_month;
    this.obj.inputs.year.value = this.act_year;

    for ( i = 0; i<this.obj.persons.length; i++)
    {
      this.obj.ptable.madd();
    }
    for ( i = 0; i<this.obj.persons.length; i++)
    {
      this.mk_persontime(i);
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