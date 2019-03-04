// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/calendar/select/day
// ================================================================================
{
  var i;
  var str = "";
  
  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");

  var ivalues = 
  {
      styleName    : 'style.css',
      datename     :'date',
      closepopupok : true
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  weblet.delbuttons('add,del');
  weblet.obj.mkbuttons.push({ id : 'today', value : weblet.txtGetText('#mne_lang#Heute#'), space : 'before' } );
  
  var attr = 
  {
      hinput     : false,
      monthInput : { selectlist : "monthname",  onchange : function() { this.weblet.setMonth(this.value); } },
      yearInput  : { minValue : 1902, maxValue : 2037, inputtyp : "integer", onreturn : function() { return this.weblet.setYear(this.value); } }
  }

  weblet.findIO(attr);
    
  weblet.obj.tables.month.clickCb["body"] = function(tab) { tab.weblet.clickBody.call(tab.weblet); };
  weblet.obj.tables.month.dblclickCb["body"] = function(tab) { tab.weblet.dblclickBody.call(tab.weblet); };
  weblet.obj.tables.month.ignoreUnselect = true;
  weblet.obj.tables.month.selectRows = false;
 
  weblet.showMonth = function(month, year, day)
  {
    var m = new Date(year, month, 1, 0, 0, 0);
    var i,j,k;
    var jc,kc;
    var str;
    
    this.act_values.year = year;
    this.act_values.month = month;
    this.act_values.day = day;
    
    this.obj.inputs.month.value = month;
    this.obj.inputs.year.value = year;
    
    this.obj.tables.month.clear();
    this.obj.tables.month.addHead(this.txtGetText('#mne_lang#So'), this.txtGetText('#mne_lang#Mo'), this.txtGetText('#mne_lang#Di'), this.txtGetText('#mne_lang#Mi'), this.txtGetText('#mne_lang#Do'), this.txtGetText('#mne_lang#Fr'), this.txtGetText('#mne_lang#Sa'))  
    str = "";
    
    for ( i=0; i<m.getDay(); i++ )
        str = str + "'',";
    
    k = 0;
    j = m.getDay();
    for ( i=0; i<31 && m.getMonth() == month; i++)
    {
      var act_day;
      act_day = m.getDate();
      
      str = str + act_day + ",";
      
      if ( m.getDate() == day )
      {
        jc = j;
        kc = k;
        this.act_values.date = m.getTime() / 1000;
        this.act_values.daytext = this.txtFormat.call(this, "" + (parseInt(m.getDay()) + 1), 'day'); 
      }
 
      m.setTime(m.getTime() + 86400000);
      while ( m.getDate() == act_day ) m.setTime(m.getTime() + 3600);
      j++;
      
      if ( m.getDay() == 0 )
      {
        eval("this.obj.tables.month.add(" + str.substring(0,str.length-1) + ")" );
        str = "";
        k++;
        j = 0;
      }
    }
    
    if ( str != '' )
      eval("this.obj.tables.month.add(" + str.substring(0,str.length-1) + ")" );
    
    this.obj.tables.month.findCell(this.obj.tables.month.body.rows[kc].cells[jc], false, false);
    this.clearModify();
    
    if (typeof this.popup != 'undefined') this.popup.resize(true,false);
  }

  weblet.showValue = function(weblet)
  {
    var date = new Date();
    if ( weblet != null && typeof weblet.obj.inputs[this.initpar.datename] != 'undefined' && typeof weblet.obj.inputs[this.initpar.datename].mne_timevalue != 'undefined' && weblet.obj.inputs[this.initpar.datename].mne_timevalue != '' )
    {   
      if ( weblet.obj.inputs[this.initpar.datename].mne_timevalue != 0 )
        date.setTime(weblet.obj.inputs[this.initpar.datename].mne_timevalue * 1000);
    }
    
    if ( weblet != null && typeof weblet.act_values[this.initpar.datename] != 'undefined')
    {   
      if ( weblet.act_values[this.initpar.datename] != 0 )
        date.setTime(weblet.act_values[this.initpar.datename] * 1000);
    }
    
    this.showMonth(date.getMonth(), date.getFullYear(), date.getDate());
  }    

  weblet.add = function()
  {
    return false;
  }
  
  weblet.cancel = function()
  {
    if (typeof this.popup != 'undefined') this.popup.hidden();
    return false;
  }

  weblet.clickBody = function()
  {
    this.act_values.day = this.obj.tables.month.act_text;
    var d = new Date(this.act_values.year, this.act_values.month, this.act_values.day );

    this.act_values.date = d.getTime() / 1000;
    this.act_values.daytext = this.txtFormat.call(this,"" + (parseInt(d.getDay()) + 1), 'day'); 
    return false;
  }
  
  weblet.dblclickBody = function()
  {
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
    
    if ( this.initpar.closepopup == true )
    {
      this.onbtnobj = {};
      if (typeof this.popup != 'undefined') this.popup.hidden();
    }
  }

  weblet.ok = function()
  {
    return false;
  }
  
  weblet.today = function()
  {
    this.showValue(null);
    return false;
  }
  
  weblet.setMonth = function(month)
  {
    this.act_values.month = month;
    this.showMonth(this.act_values.month, this.act_values.year, this.act_values.day)
  }
  
  weblet.setYear = function(year)
  {
    this.act_values.year = year;
    this.showMonth(this.act_values.month, this.act_values.year, this.act_values.day);
    return true;
  }
  
  weblet.mprev = function()
  {
    this.act_values.month--;
    if ( this.act_values.month < 0 )
    {
      this.act_values.month = 11;
      this.act_values.year--;
    }
    this.showMonth(this.act_values.month, this.act_values.year, this.act_values.day);
    return false;
  }

  weblet.mnext = function()
  {
    this.act_values.month++;
    if ( this.act_values.month > 11 )
    {
      this.act_values.month = 0;
      this.act_values.year++;
    }
    this.showMonth(this.act_values.month, this.act_values.year, this.act_values.day);
    return false;
  }
  
  weblet.yprev = function()
  {
    this.act_values.year--;
    this.showMonth(this.act_values.month, this.act_values.year, this.act_values.day);
    return false;
  }
  
  weblet.ynext = function()
  {
    this.act_values.year++;
    this.showMonth(this.act_values.month, this.act_values.year, this.act_values.day);
    return false;
  }
  
}
