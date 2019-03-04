// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Alle Rechte vorbehalten
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================

window.MneAjaxMonthTable = function(dtab, mtab, classname, names, start)
{
  var i,j,k;
  var jc,kc;
  var str1,str2;
  var act_row;
  
  this.dblclick = 0;
  this.timeout = null;
  
  this.dtable = dtab;
  this.mtable = mtab;
  this.classname = classname;
  this.slotstart = 28800;
  this.slotsize = 7200;
  this.slotnum = 4;
  this.start = start;
  this.weblet = null;
  this.act_num = -1;
  this.no_select = 0;
  
  this.dayname = new Array("#mne_lang#So", "#mne_lang#Mo", "#mne_lang#Di", "#mne_lang#Mi", "#mne_lang#Do", "#mne_lang#Fr", "#mne_lang#Sa" )

  mtab.clear();
  mtab.ignoreEvent = true;

  dtab.clear();
  dtab.ignoreEvent = true;

  k = 0;
  str1 = str2 = "";

  for ( i=start; i<names.length; i++)
  {
    str1 += '"",';
    str2 += '"' + names[i] + '",';
  }

  eval("dtab.addHead(" + str1.substring(0,str1.length-1) + ")" );
  eval("dtab.addHead(" + str2.substring(0,str2.length-1) + ")" );

  for ( act_row = 0; act_row < 2; act_row++)
  {
    for ( k = 0; k < dtab.head.rows[act_row].cells.length; k++)
    {
      this.eleMkClass(dtab.head.rows[act_row].cells[k], classname + " " + classname + "name " + classname + "namehead", true);
    }
  }

  this.win.mneDocevents.addInterest("mouseup", this);
  this.win.mneDocevents.addInterest("mousedown", this);

  this.mk_month = function(month, year)
  {
    var i,j,k;
    var jc,kc;
    var str1,str2;
    var act_row;

    var m = new Date(year, month, 1, 0, 0, 0);
    this.startday = m.getDay();

    this.starttimes = new Array();
    this.clocktimes = new Array();
    this.startobjs = new Array();
    

    this.mtable.clear();
    str1 = str2 = "";
    for ( i=0; i<31 && m.getMonth() == month; i++)
    {
      var act_day;
      act_day = m.getDate();
    
      str1 = str1 + "'" + act_day + "',";
      str2 = str2 + "'" + this.dayname[m.getDay()] + "',";

      for ( k = 0; k < this.slotnum; k++)
      {
        this.starttimes[this.starttimes.length] = m.getTime() / 1000;
        this.clocktimes[this.clocktimes.length] = this.slotstart + k * this.slotsize;
      }
    
      m.setTime(m.getTime() + 86400000);
      while ( act_day == m.getDate() ) m.setTime(m.getTime() + 3600);
      this.endtime = m.getTime() / 1000;
    }

    eval("this.mtable.addHead(" + str1.substring(0,str1.length-1) + ")" );
    eval("this.mtable.addHead(" + str2.substring(0,str2.length-1) + ")" );

    j = this.startday;
    for ( k = 0; k < mtab.head.rows[0].cells.length; k++)
    {
      this.eleMkClass(this.mtable.head.rows[0].cells[k], classname + " " + classname + "month " + classname + "head " + classname + "td" + j, true);
      this.eleMkClass(this.mtable.head.rows[1].cells[k], classname + " " + classname + "month " + classname + "head " + classname + "td" + j, true);
      j++;
      if ( j == 7 ) j = 0;
    }
  }
  
  this.dadd = function(num, values, color)
  {
    var i,j,k;
    var act_row;
    var str;
    
    if ( typeof color != 'undefined' ) str = '"",'; else str = '';
    for ( i=this.start; i < values.length; i++ )
      str += "'" + values[i] + "',";

    eval("this.dtable.add(" + str.substring(0,str.length-1) + ")");
    
    act_row = this.dtable.body.rows.length - 1;
    
    for ( k = 0; k < this.dtable.body.rows[act_row].cells.length; k++)
    {
      try
      {
        this.dtable.body.rows[act_row].cells[k].weblet = this.weblet;
      this.dtable.body.rows[act_row].cells[k].num= num;
      this.dtable.body.rows[act_row].cells[k].section = this.dtable.body;
      this.dtable.body.rows[act_row].cells[k].onclick = function()
      {
        var i,j;
        try { this.weblet.dselect(this.num) }
        catch(e) { this.weblet.exception("MneAjaxMonth::select_name:", e); }
        
        for ( i=0; i<this.section.rows.length; i++)
          if ( i != this.num )
            for ( j=0; j<this.section.rows[i].cells.length; j++)
              this.weblet.elements.mkClass(this.section.rows[i].cells[j], "active", false);
          else
            for ( j=0; j<this.section.rows[i].cells.length; j++)
              this.weblet.elements.mkClass(this.section.rows[i].cells[j], "active", true);
      };
      
      if ( typeof color != 'undefined' && color != '' ) this.dtable.body.rows[act_row].cells[0].style.backgroundColor = "#" + color;
      
      this.eleMkClass(this.dtable.body.rows[act_row].cells[k], this.classname + "name", true);
      }
      catch(e)
      {
        this.weblet.exception('MneAjaxMonthTable::dadd', e);
      }
    }

  }
  
  this.madd = function()
  {
    var i,j,k,act_row;
    this.mtable.add(" ");
    act_row = this.mtable.body.rows.length - 1;
    j = this.startday;
    this.startobjs[act_row] = new Array();
    for ( k = 0; k < this.mtable.body.rows[act_row].cells.length; k++)
    {
      var cell = this.mtable.body.rows[act_row].cells[k];
      cell.innerHTML='<div class="' + this.classname + 'slot"></div>';
      for ( i =0; i<this.slotnum; i++)
      {
        cell.firstChild.appendChild(this.doc.createElement("div"));
        this.eleMkClass(cell.firstChild.lastChild, this.classname + "slotelement " + this.classname + "slotelement" + i, true);
        cell.firstChild.lastChild.mtab = this;
        cell.firstChild.lastChild.weblet = this.weblet;
        cell.firstChild.lastChild.act_values = new Object;
        cell.firstChild.lastChild.act_values.num = act_row;
        cell.firstChild.lastChild.act_values.tindex = k * this.slotnum + i;
        this.startobjs[act_row][k * this.slotnum + i] = cell.firstChild.lastChild;
        if ( this.no_select == 0 )
        {
          cell.firstChild.lastChild.onmousemove = function(evt) { try { this.mtab.cellmousemove(evt,this) } catch(e) { this.weblet.exception("Monthtable::mousemove:", e); return false;} };
        }
        
        cell.firstChild.lastChild.onmousedown = function(evt) { try { this.mtab.cellmousedown(evt,this) } catch(e) { this.weblet.exception("Monthtable::mousedown:", e); return false;} };
        cell.firstChild.lastChild.onmouseup   = function(evt) { try { this.mtab.cellmouseup(evt,this) } catch(e) { this.weblet.exception("Monthtable::mouseup:", e); return false;} };
      }
      
      this.eleMkClass(cell, this.classname + " " + this.classname + "month " + this.classname + "body " + this.classname + "td" + j, true);
      
      j++;
      if ( j == 7 ) j = 0;
    }
  }
  
  this.timeoutcb = function()
  {
    this.timeout = null;
    this.weblet.mselect(this.act_num, this.act_id);
    this.act_num = -1;
  }
  
  this.mouseup = function(evt)
  {
    if ( this.no_select == 0 && this.have_mouseup == 0 ) this.cellmouseup();
    return true;
  }

  this.mousedown = function(evt)
  {
    if ( evt.target.mtab == this ) return false;
    else return true;
  }
    
  this.cellmousedown = function(evt, obj)
  {
    this.act_num = obj.act_values.num;       
    if ( this.no_select == 0 ) this.eleMkClass(obj, "active", true);

    this.start_tindex = obj.act_values.tindex;
    this.act_tindex = obj.act_values.tindex;
    this.act_id = obj.id;
    this.have_mouseup = 0;    
  }
  
  this.cellmousemove = function(evt,obj)
  {
    if ( this.timeout != null )
    {
      window.clearTimeout(this.timeout);
      this.timeout = null;
    }
   
    if ( this.act_num == -1  ) return;
   
    this.act_move = 1;
    if ( this.act_tindex < obj.act_values.tindex )
    {
      while ( this.act_tindex <= obj.act_values.tindex )
        this.eleMkClass(this.startobjs[this.act_num][this.act_tindex++], "active", true);
    }
    else
    {
      while ( this.act_tindex > obj.act_values.tindex )
        this.eleMkClass(this.startobjs[this.act_num][this.act_tindex--], "active", false);
    }
  }
  
  this.cellmouseup = function(evt, obj)
  {
    var s,e;
    
    this.have_mouseup = 1;
    if ( this.act_num == -1 ) return;
    if ( this.no_select !== 0 ) this.weblet.mselect(this.act_num, this.act_id);
    
    if ( this.start_tindex < this.act_tindex )
    {
      s = this.start_tindex;
      e = this.act_tindex;
    }
    else
    {
      e = this.start_tindex;
      s = this.act_tindex;
    }

    if ( e != s ) this.act_move = 1;
    
    if ( this.act_id != "" && this.act_move == 0 )
    {
      if ( this.timeout != null )
      {
        window.clearTimeout(this.timeout);
        this.timeout = null;
        try { this.weblet.mdel( this.act_num, this.act_id); } catch(e) { this.weblet.exception("MneMonthtable:dbclick", e); }
        this.act_num = -1;
      }
      else
      {
        var self = this;
        var timeout = function() { self.timeoutcb.call(self); }
        this.timeout = window.setTimeout(timeout, 200);
      }
    }
    else
    {
      try { this.weblet.mselect(this.act_num, this.act_id, this.starttimes[s], this.clocktimes[s], this.slotsize * ( e - s + 1) ); }
      catch(e) { this.weblet.exception("MneMonthtable", e); }
      this.act_num = -1;
    }
    
    this.act_move = 0;
  }
  

  this.clearElements = function(num)
  {
    var i,j;
    for ( i =0; i < this.starttimes.length; i++)
    {
      this.startobjs[num][i].innerHTML = '';
      this.startobjs[num][i].style.backgroundColor = '';
      this.startobjs[num][i].id = '';
      this.eleMkClass(this.startobjs[num][i], "active", false);

    }
  }
  
  this.color =
  {
      0 : "F",
      1 : "E",
      2 : "D",
      3 : "C",
      4 : "B",
      5 : "A",
      6 : "9",
      7 : "8",
      8 : "7",
      9 : "6",
      A : "5",
      B : "4",
      C : "3",
      D : "2",
      E : "1",
      F : "0"
  }
      
  this.setElement = function(num, id, starttime, clocktime, duration, color, text)
  {
    var i,j;
    var s = parseInt(starttime) + parseInt(clocktime);
    var e = s + parseInt(duration);
    
    var fg = "";

    for ( i =0; i< color.length; i++ )
      fg  += this.color[color[i]];
    
    for ( i = 0; i < this.starttimes.length; i++)
    {
      if ( this.starttimes[i] + this.clocktimes[i] >= s && this.starttimes[i] + this.clocktimes[i] < e )
      {
        for ( j = 0; j * this.slotsize < duration; j++ )
        {
          this.startobjs[num][i+j].style.backgroundColor = "#" + color;
          this.startobjs[num][i+j].style.color = "#" + fg;
          this.startobjs[num][i+j].id = id;
          if ( j == 0 ) this.startobjs[num][i+j].innerHTML = text;
        }
        break;
      }
    }
  }
}

window.MneAjaxMonthTable.prototype = new MneMisc(window);