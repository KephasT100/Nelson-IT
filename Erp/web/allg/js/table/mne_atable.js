//================================================================================

//Copyright: M.Nelson - technische Informatik
//Alle Rechte vorbehalten
//Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//Genehmigung gestattet. 

//================================================================================
window.MneAjaxTable = function( win, container, classname, selectRows, plain )
{
    MneMisc.call(this, win);
    
    this.frame = container;
    this.classname = classname;

    this.selectRows = selectRows;
    this.selectHead = true;
    this.sizeElement = false;
    this.ignoreUnselect = false;
    this.ignoreEvent = false;
    this.noshowActive = false;

    this.input = new Array();
    this.inputstyle = new Array();
    this.inputname = "Cell";

    this.plain = plain;
    this.fixcols = true;

    this.borderclass    = " border padding";
    this.mouseoverclass = "mouseover";
    this.tdclass = new Array();

    this.invisible = new Array();
    this.cellWidth = new Array();
    this.cellAlign = new Array();

    this.table = this.win.document.createElement("table");
    this.frame.appendChild(this.table);
    this.table.className = this.classname + " border";
    this.table.mne_table = this;

    this.head = null;

    this.body = this.win.document.createElement("tbody");
    this.body.className = this.classname;
    this.body.sname = 'body';
    this.body.data = new Array();
    this.body.origdata = new Array();
    this.table.appendChild(this.body);

    this.sections = new Array();
    this.sections["head"] = this.head;
    this.sections["body"] = this.body;

    this.clickCb = new Array();
    this.clickCb["head"] = null;
    this.clickCb["body"] = null;

    this.dblclickCb = new Array();
    this.dblclickCb["head"] = null;
    this.dblclickCb["body"] = null;

    this.multiselect = false;
    this.act_event = null;
    
    this.max_rownum = 10000;
    this.max_rownum_step = 500;
    

    this.next_button = null;
    this.modify_function = null;
    this.mkNextbutton = function()
    {
        if ( this.next_button != null )
            return;

        this.next_button = this.win.document.createElement("input");
        this.next_button.type = "button";
        this.next_button.value = "#mne_lang#weiter";
        try { this.next_button.appendChild(this.win.document.createTextNode(this.next_button.value)); } catch(e) {};
        this.next_button.mne_table = this;
        this.next_button.vtype = "button";
        this.next_button.onclick = function()
        {
            this.mne_table.show_next();
        };
        this.frame.appendChild(this.next_button);
    };

    this.act_rownums = new Array();
    this.reset = function()
    {
        var i;
        for ( i=0; i< this.act_rownums.length; i++)
          this.set_active(this.act_rownums[i], false);
        
        this.act_section = null;
        this.act_row = null;
        this.act_cell = null;
        this.act_text = "";
        this.act_selection = "";
        this.act_rownum = -1;
        this.act_colnum = -1;
        this.act_rownums = new Array();
    };
    
    this.reset();
    this.act_event = null;
    
    this.col2tab = function(col)
    {
        var tab_col;
        var r;
        for ( tab_col = col, r = 0; r < col; r++ )
            if ( this.invisible[r] == true ) tab_col--;
        return tab_col;
    };

    this.tab2col = function(tab_col)
    {
        var col;
        var r;

        for ( col = tab_col, r = 0; r <= col; r++ )
            if ( this.invisible[r] == true ) col++;
        return col;
    };

    this.set_active = function(rownum, active)
    {
      var c;
      var act_row = this.act_section.rows[rownum];
      for ( c=0; c < act_row.cells.length; c++ )
        this.eleMkClass(act_row.cells[c], 'active', active);
    }

    this.findCell = function(cell, dblclick, ignore_cb)
    {
        var r,c,s,ss;

        if ( cell == this.act_cell  && dblclick != true && this.multiselect != true ) return;

        ss = null;
        if ( this.act_cell != null && this.act_colnum >= 0 && this.noshowActive != true )
        {
            if ( this.selectRows == true )
            {
                if ( this.act_section.sname == 'head' )
                {
                    for ( ss in this.sections )
                        for ( r=0; r < this.sections[ss].rows.length; r++ )
                            this.eleMkClass(this.sections[ss].rows[r].cells[this.act_colnum], 'active', false);
                }
            }
            else
            {
                this.act_cell.className = this.classname + this.borderclass;	
                if ( typeof this.tdclass[this.act_cell.colnum] != 'undefined' )
                    this.eleMkClass(this.act_cell, this.tdclass[this.act_cell.colnum], true);

            }
        }

        if ( dblclick == true ) this.reset();
        else if ( this.ignoreUnselect == false && this.act_section != null &&
                ( cell == null || ( cell.section == this.act_section.sname && 
                        ( this.act_rownum == cell.rownum && this.selectRows == true && this.act_section.sname != 'head' ||
                                this.act_colnum == cell.colnum && this.selectRows == true && this.act_section.sname == 'head' ||
                                this.act_cell == cell ))) )
        {
            s = this.act_section.sname;
            this.reset();
            if ( ignore_cb != true && s != null && dblclick != true && this.clickCb[s] != null )
            {
              try { this.clickCb[s](this); } catch(e) { this.error("MneAjaxTable::clickCb: " + e.message); }
            }
            return;
        }

        if ( this.multiselect == false || (this.act_event != null && this.act_event.ctrlKey == false && this.act_event.shiftKey == false ))
           this.reset();
        
        if ( cell == null ) return;

        s = null;
        c = 0;
        r = 0;

        if ( cell.rownum < this.sections[cell.section].rows.length )
        {
          if ( cell.colnum < this.sections[cell.section].rows[cell.rownum].cells.length ) 
                if ( this.sections[cell.section].rows[cell.rownum].cells[cell.colnum] == cell )
                {
                    s = cell.section;
                    r = cell.rownum;
                    c = cell.colnum;
                }
        }

        if ( s == null )
        {
            for ( s in this.sections )
            {
                if ( this.sections[s] != null )
                {
                    for ( r=0; r<this.sections[s].rows.length; r++)
                    {
                        for ( c=0; c < this.sections[s].rows[r].cells.length; c++ )
                            if ( this.sections[s].rows[r].cells[c] == cell ) break;

                        if ( c < this.sections[s].rows[r].cells.length &&
                                this.sections[s].rows[r].cells[c] == cell ) break;
                    }
                    if ( r < this.sections[s].rows.length && this.sections[s].rows[r].cells[c] == cell ) break;
                }
            }

            if ( this.multiselect == true && this.sections[s] != this.act_section )
              this.reset();
        }  

        if ( this.sections[s].rows[r].cells[c] == cell  )
        {

          this.act_section = this.sections[s];
          this.act_colnum = c;
          this.act_rownum = r;
          this.act_row = this.sections[s].rows[r];
          this.act_cell = cell;

          if ( this.multiselect && s != 'head' && this.act_event != null && this.act_event.shiftKey == true && this.act_rownums.length > 0 )
            {
              var i = this.act_rownums[this.act_rownums.length - 1];
              if ( r < i )
              {
                while ( i > r )
                  this.act_rownums[this.act_rownums.length] = --i;
              }
              else
              {
                while ( i < r )
                  this.act_rownums[this.act_rownums.length] = ++i;
              }
            }
            else if ( this.multiselect && s != 'head' && this.act_event != null && this.act_event.ctrlKey == true )
            {
              var i;
              var act_rownums = new Array();

              for ( i = 0; i<this.act_rownums.length; i++ )
              {
                if ( this.act_rownums[i] == r ) break;
                act_rownums[i] = this.act_rownums[i];
              }
              if ( i == this.act_rownums.length )
              {
                this.act_rownum = r;
                this.act_rownums[this.act_rownums.length] = r;
              }
              else
              {
                this.set_active(this.act_rownums[i],false);
                while ( ++i < this.act_rownums.length )
                {
                  act_rownums[i-1] = this.act_rownums[i];
                }
                if ( act_rownums.length > 0  )
                {
                  this.act_rownums = act_rownums;
                }
                else
                {
                  this.reset();
                }
              }
            }
            else
            {
                this.act_rownum = r;
                this.act_rownums[this.act_rownums.length] = r;
            }
            
            this.act_rownums.sort();

            this.act_text = this.sections[s].data[r][this.tab2col(c)];
            this.act_selection = this.sections[s].data[r][0];

            if ( this.noshowActive != true )
            {

              if ( this.selectRows == true )
              {
                var i;
                if ( s == 'head' && this.selectHead == true )
                {
                  for ( ss in this.sections )
                    for ( i=0; i<this.sections[ss].rows.length; i++ )
                      this.eleMkClass(this.sections[ss].rows[i].cells[c], 'active', true);
                }
                else if ( s == 'body' )
                {
                  var i;
                  for ( i = 0; i<this.act_rownums.length; i++)
                    this.set_active(this.act_rownums[i], true);
                }
              }
              else
              {
                this.eleMkClass(cell, 'active', true);
              }
            }

            if ( ignore_cb != true && dblclick != true && this.clickCb[s] != null )
                try { this.clickCb[s](this); } catch(e) { this.error("MneAjaxTable::clickCb: " + e.message); }
                if ( ignore_cb != true && dblclick == true && this.dblclickCb[s] != null )
                    try { this.dblclickCb[s](this); } catch(e) { this.error("MneAjaxTable::dblclickCb: " + e.message); }
        }
    };

    this.mkContent = function(p_str, colnum, rownum)
    {
        var ityp = null;
        var name = null;
        var value = null;
        var limit = null;
        var secval = null;
        var minval = null;
        var maxval = null;
        var pos;
        var e, ee, errval;
        var str = p_str;
        errval = str;
        var retval;

        if ( this.plain == true  || typeof str.substr == 'undefined' ) return this.win.document.createTextNode(str);
        if ( this.input.length == 0 )
        {
            if ( str.substr(0,4) != '####' ) return this.win.document.createTextNode(str);

            str = str.substring(4, str.length);
            if ( (pos = str.indexOf('####' )) >= 0 )
            {
                ityp = str.substring(0,pos);
                name = str.substring(pos + 4, str.length);
            }

            if ( name != null && (pos = name.indexOf('####' )) >= 0 )
            {
                value = name.substring(pos + 4, name.length);
                name  = name.substring(0,pos);
            }

            if ( value != null && (pos = value.indexOf('####' )) >= 0 )
            {
                limit = value.substring(pos + 4, value.length);
                value = value.substring(0,pos);
            }

            if ( limit != null )
            {
                pos = limit.indexOf('%' );
                if ( pos != 0 ) minval = Number(limit.substring(0, pos ));
                if ( pos >= 0 ) maxval = Number(limit.substring(pos + 1, limit.length));
            }
        }
        else
        {
            if ( this.rowsection == this.head ) ityp = 'plain';
            else ityp = this.input[colnum];
            if ( typeof ityp != "string" ) ityp = "plain";

            name = this.inputname + rownum + "_" + colnum;
            value = str;
            if ( value != null && (pos = value.indexOf('::::' )) >= 0 )
            {
                secval = value.substring(pos + 4, value.length);
                value = value.substring(0,pos);
            }

        }
        if ( ityp != null )
        {
            switch(ityp)
            {
            case "":
            case "plain":
                retval = this.win.document.createElement('span')
                retval.textContent = str;
                retval.wrapper = retval;
                if ( this.rowsection == this.body && typeof this.weblet != 'undefined' && this.weblet != null )
                {
                    if ( typeof this.weblet.inputlist_data[this.weblet.rids[colnum]] != 'undefined' )
                    {
                      this.weblet.inputlist_data[name] = this.weblet.inputlist_data[this.weblet.rids[colnum]];
                      this.weblet.create_inputlist_output(retval, name, this.weblet.inputlist_data[name]["values"], 'table');
                    }
                }
              break;

            case "button":
                e = this.win.document.createElement("input");
                e.datafield = e;
                e.valuefield = e;
                e.type = "button";
                if ( value != null ) e.value = value;
                if ( name != null ) e.id = e.name = name;
                if ( this.navigator != "MSIE" )
                    e.appendChild(this.win.document.createTextNode(value));
                e.win = this.win;
                e.vtype = "button";
                retval = e;
                if ( this.inLength != 0 )
                {
                  e.weblet = this.weblet;
                  e.onclick = function() { try { this.weblet[this.weblet.rids[colnum]].call(this.weblet); } catch(e) { this.weblet.exception("MneTable::ButonPress", e) } };
                }
                  break;

            case "rdbool":
            case "bool":
            case "checkbox":
                e = this.win.document.createElement("input");
                e.type = 'checkbox';
                e.vtype = 'bool';
                e.defaultChecked = e.checked = ( value != null && value != "" && value != "0" && String(value).substr(0,1) != 'f' );
                if ( ityp == 'rdbool' ) e.disabled = "disabled";
                
                MneMisc.prototype.eleMkInputsSingle.call(this, e);
                if ( name != null ) e.wrapper.datafield.id = e.wrapper.datafield.name = name;
                e.wrapper.weblet = this.weblet;
                e.valuefield.value = ( e.defaultChecked ) ? "1" : "0";
               
                e.secvalfield = this.win.document.createElement("input");
                e.secvalfield.type = "hidden";
                e.secvalfield.vtype = "bool";
                e.secvalfield.checkbox = e.lastChild;
                e.secvalfield.value = secval;

                retval = e.wrapper;
                break;

            case "selection":
                var v;
                if ( name == null ) name = 'selection';
                e = this.win.document.createElement("select");
                MneMisc.prototype.eleMkSelectsSingle.call(this, e);
                e.wrapper.datafield = e;
                e.wrapper.valuefield = e;
                e.wrapper.weblet = this.weblet;
                e.id = e.name = name;
                e.vtype = "selection";
                e.win = this.win;
                e.onchange = MneMisc.prototype.inOnmodify;
                e.onmodify = this.modify_function;
                e.table = this;

                if ( this.input.length == 0 )
                {
                    while ( value != "" )
                    {
                        if ( ( pos = value.indexOf("#")) < 0 )
                        {
                            v = value;
                            value = "";
                        }
                        else
                        {
                            v = value.substring(0, pos);
                            value = value.substring(pos+1);
                        }
                        ee = this.win.document.createElement("option");
                        if ( ( pos = v.indexOf("%")) >= 0 )
                        {
                            ee.value = v.substring(0,pos);
                            v = v.substring(pos+1);
                            ee.text = v;
                        }
                        else
                        {
                            ee.value = v;
                            ee.text = v;
                        }
                        e.appendChild(ee);
                    }
                }
                else
                {
                    e.oldvalue = value;
                    if ( typeof this.weblet.inputlist_data[this.weblet.rids[colnum]] != 'undefined' )
                    {
                        this.weblet.inputlist_data[e.id] = this.weblet.inputlist_data[this.weblet.rids[colnum]];
                        ee = this.weblet.create_inputlist_select(e, e.id, this.weblet.inputlist_data[e.id]["values"], 'table', this.weblet.inputlist_data[e.id]["result"]);
                        ee.datafield = e;
                        e = ee;
                        this.weblet.inputlist_data[this.weblet.rids[colnum]].result = e.values;
                    }
                    e.wrapper.datafield.value = value;
                }
                retval = e.wrapper;
                break;

            case "hidden":
                e = this.win.document.createElement("div");
                e.appendChild(this.win.document.createTextNode(value));
                ee = this.win.document.createElement("input");
                ee.type = "hidden";
                ee.wrapper = ee;
                ee.wrapper.weblet = this.weblet;
                if ( name  != null ) ee.id = ee.name = name;
                e.datafield = ee;
                ee = e.appendChild(ee);
                ee.win = this.win;
                ee.vtype = "hidden";
                if ( name  != null ) ee.id = ee.name  = name;
                if ( value != null ) ee.value = value;

                e.vtype = "hidden";
                e.win = this.win;
                retval = e;
                break;

            case 'html':
              e = this.win.document.createElement("div");
              e.className = 'shtml';
              e.style.position = "relative";
              e.weblet = this.weblet;
              e.vtype = "html";

              e.datafield = this.win.document.createElement("input");
              e.datafield.type = "hidden";
              e.datafield.value = value;
              retval = e;
              
              if ( value != '' )
              {
                this.weblet.eleMkClass(e, 'modifywait', true, 'modify');
                e.innerHTML = '#mne_lang#warte auf Daten';
                var ajax = new MneAjax(this.win);
                ajax.loadReadyObj = e;
                ajax.loadReady = function()
                {
                  if ( this.req.readyState == 4 )
                    this.loadReadyObj.innerHTML = ajax.req.responseText;
                  this.loadReadyObj.weblet.eleMkClass(this.loadReadyObj, 'modifyno', true, 'modify');

                }
                ajax.load( "/xmltext/html.html", { xmltext : value, size : 504 }, true );
              }

              e.onmouseover = function()
              {
                var diff = this.offsetHeight - this.scrollHeight;
                
                if ( diff > 0 ) return;
                
                this.style.maxHeight = this.scrollHeight + "px";
                this.parentNode.style.height = this.scrollHeight + "px";
              }

              e.onmouseout = function()
              {
                this.style.maxHeight = '';
                this.parentNode.style.height = '';
              }

              break;

            case 'ehtml':
              e = this.win.document.createElement("div");
              e.weblet = this.weblet;
              e.className = 'ehtml';
              e.style.position = "relative";
              e.vtype = "html";
              
              e.aname = "ehtml_" + rownum + "_" + colnum;
              e.rownum = rownum;
              e.colnum = colnum;
              e.table = this;
              
              e.datafield = this.win.document.createElement("input");
              e.datafield.type = "hidden";
              e.datafield.value = value;
              e.datafield.aname = "ehtml_" + rownum + "_" + colnum;

              e.innerHTML = "&nbsp;";
                
              retval = e;
              
              e.onclick = function()
              {
                if ( typeof this.weblet != 'undefined' && this.weblet != null )
                {
                  if ( this.rownum != this.table.act_rownum )
                  {
                    var ele = this;
                    while(ele.tagName != "TD" && ele != null ) ele = ele.parentNode;
                    if ( ele != null ) this.table.findCell(ele);
                  }
                  {
                    var p = this.weblet.parent.popups['rte'];
                    var w = this.weblet;
                    var s = this;
                    window.setTimeout(function()
                        {
                           s.popup = p
                           p.show( p.weblet.initpar.popup_resize != false, p.weblet.initpar.popup_repos == true );
                           p.weblet.showValue(w, { datafield : s.datafield, htmlfield : s });
                           p.weblet.onbtnobj = w;
                           w.obj.rte = p;
                        },10) 
                  }
                }
              }
              
              e.onmouseover = function()
              {
                var diff = this.offsetHeight - this.scrollHeight;
                
                if ( diff > 0 ) return;
                
                this.style.maxHeight = this.scrollHeight + "px";
                this.parentNode.style.height = this.scrollHeight + "px";
              }
              
              e.onmouseout = function()
              {
                this.style.maxHeight = '';
                this.parentNode.style.height = '';
              }
              
              e.onbtnclick = function(id, button)
              {
                this.weblet.eleMkClass(this, 'modifyok', true, 'modify');
                this.popup.onbtnobj = null;
              }
              
              
              if ( value != '' )
              {
                this.weblet.eleMkClass(e, 'modifywait', true, 'modify');
                e.innerHTML = '#mne_lang#warte auf Daten';
                var ajax = new MneAjax(this.win);
                ajax.loadReadyObj = e;
                ajax.loadReady = function()
                {
                  if ( this.req.readyState == 4 )
                    this.loadReadyObj.innerHTML = ajax.req.responseText;
                  this.loadReadyObj.weblet.eleMkClass(this.loadReadyObj, 'modifyno', true, 'modify');

                }
                ajax.load( "/xmltext/html.html", { xmltext : value, size : 504 }, true );
              }

              
              break;
              
            case 'textarea':
                e = this.win.document.createElement("textarea");
                e.datafield = e;
                e.valuefield = e;
                e.onkeyup = MneMisc.prototype.inOnmodify;
                e.onkeydown = function(evt) 
                {
                    if ( evt.shiftKey && evt.keyCode == 13 && this.className.indexOf("modifywrong") < 0 )
                    {
                        if ( typeof this.onsave == 'function' )
                        {
                            window.MneDocEvents.prototype.cancelEvent (win,e);
                            if ( this.onsave() == false )
                            { MneMisc.prototype.eleMkClass(target, "modify", false, "modify"); }
                        }
                    }
                };
                e.onsave = this.return_function;
                e.table = this;
                e.win = this.win;
                if ( name != null ) e.id = e.name = name;
                if ( value != null ) e.value = value;
                e.onmodify = this.modify_function;
                this.eleMkClass(e, this.tdclass[colnum], true);
                ( value.indexOf("\n") != -1 ) ? this.eleMkClass(e,"multicol", true) : this.eleMkClass(e,"multicol", false);
                e.rownum = rownum;
                e.colnum = colnum;
                e.onfocus = function()
                {
                  if ( this.table.act_rownum != this.rownum )
                  {
                    this.table.findCell(this.table.body.rows[this.rownum].cells[this.table.col2tab(this.colnum)], false);
                    this.focus();
                  }
                };
                if ( typeof this.weblet != 'undefined' && this.weblet != null )
                {
                    if ( typeof this.weblet.inputlist_data[this.weblet.rids[colnum]] != 'undefined' )
                    {
                      this.weblet.inputlist_data[e.id] = this.weblet.inputlist_data[this.weblet.rids[colnum]];
                      ee = this.weblet.create_inputlist_select(e, e.id, this.weblet.inputlist_data[e.id]["values"], 'table');
                      ee.datafield = e;
                      e = ee;
                    }
                }
                retval = e;
                break;

            default:
              e = this.win.document.createElement("input");
            MneMisc.prototype.eleMkInputsSingle.call(this, e);
            e.wrapper.datafield = e;
            e.wrapper.valuefield = e;
            if ( typeof this.weblet != 'undefined' && this.weblet != null )
            {
              e.wrapper.weblet = this.weblet;
              e.weblet = this.weblet;
              e.mne_fieldnum =  this.weblet.obj.fields.length;
              this.weblet.obj.fields[this.weblet.obj.fields.length] = e;
            }
            switch(ityp)
            {

              case "float":
              case "double":
                e.type = "text";
                e.vtype = "float";
                e.onkeyup = MneMisc.prototype.inOnfloat;
                if ( minval != null ) e.minValue = minval;
                if ( maxval != null ) e.maxValue = maxval;
                break;

              case "integer":
                e.type = "text";
                e.vtype = "long";
                e.onkeyup = MneMisc.prototype.inOninteger;
                if ( minval != null ) e.minValue = minval;
                if ( maxval != null ) e.maxValue = maxval;
                break;

              case "time":
                e.type = "text";
                e.vtype = "time";
                e.onkeyup = MneMisc.prototype.inOntime;
                break;

              case "clocktime":
                e.type = "text";
                e.vtype = "time";
                e.onkeyup = MneMisc.prototype.inOnclocktime;
                break;

              case "date":
                e.type = "text";
                e.vtype = "date";
                e.onkeyup = MneMisc.prototype.inOndate;
                break;

              default:
              {
                e.onkeyup = MneMisc.prototype.inOnmodify;
                if ( typeof this.weblet != 'undefined' && this.weblet != null && typeof this.weblet.regexps[colnum] != 'undefined' )
                {
                  this.weblet.create_checkpopup(e, this.weblet.regexps[colnum]);
                }

                e.type = "text";
                e.vtype = ityp;
              }
            }

            e.table = this;
            e.inputtyp = ityp;
            e.onkeydown = MneMisc.prototype.inOnkeydown; 
            e.win = this.win;
            if ( name != null ) e.id = e.name = name;
            if ( value != null ) this.showInput(e, value, ityp);
            e.onmodify = this.modify_function;
            e.onreturn = this.return_function;
            this.eleMkClass(e, this.tdclass[colnum], true);
            e.rownum = rownum;
            e.colnum = colnum;
            e.onfocus = function() { this.table.findCell(this.table.body.rows[this.rownum].cells[this.table.col2tab(this.colnum)], false); };
            if ( typeof this.weblet != 'undefined' && this.weblet != null  )
            {
                if ( typeof this.weblet.inputlist_data[this.weblet.rids[colnum]] != 'undefined' )
                {
                  this.weblet.inputlist_data[e.id] = this.weblet.inputlist_data[this.weblet.rids[colnum]];
                  
                  if ( e.tagName == "SELECT" )
                  {
                    ee = this.weblet.create_inputlist_select(e, e.id, this.weblet.inputlist_data[e.id]["values"], 'table');
                  }
                  else
                  {
                    ee = this.weblet.create_inputlist_input(e, e.id, this.weblet.inputlist_data[e.id]["values"]);
                  }

                  ee.datafield = e;
                  e = ee;
                }
            }
            retval = e.wrapper;
            break;
            }
        } 
        else
        {
            this.error("MneTable::mkContent - Format <" + value + ":" + errval + "> ist falsch");
            return this.win.document.createTextNode("Format <" + value + ":" + errval + "> ist falsch");
        }
        return retval;
    };

    this.equal_table = function(section, arg )
    {
        var s,secs;
        var max_anzahl;
        var i,j,n;

        max_anzahl = arg.length;
        s = null;
        secs = null;

        for ( s in this.sections )
        {
            secs = this.sections[s];
            if ( secs != null && secs.data.length > 0 )
                if ( max_anzahl  < secs.data[0].length )
                    max_anzahl = secs.data[0].length;
        }

        for ( s in this.sections )
        {
            if ( secs != null && secs.data.length > 0 )
            {
                for( i=0; i<secs.data.length; i++ )
                {
                    for ( n=secs.data[i].length; n < max_anzahl; n++ )
                    {
                        if ( typeof this.invisible[n] == 'undefined' )
                            this.invisible[n] = false;

                        secs.data[i][n] = "";
                        if ( this.invisible[n] != true )
                        {
                            td = this.win.document.createElement("td");

                            td.className = this.classname + this.borderclass;
                            if ( typeof this.tdclass[n] != 'undefined' )
                                this.eleMkClass(td, this.tdclass[n], true);
                            td.table = this;
                            td.section = section.sname;
                            td.rownum = i;
                            td.colnum = n;
                            if ( this.ignoreEvent != true && this.classname != 'ignore' )
                            {
                              td.onclick     = function(e) { this.table.act_event = e; try { this.table.findCell(this); } catch(ex) { this.table.act_event = null;  throw ex}; this.table.act_event = null };
                              td.ondblclick  = function(e) { this.table.act_event = e; try { this.table.findCell(this,true); } catch(ex) { this.table.act_event = null;  throw ex}; this.table.act_event = null };
                              td.onmouseover = function(e) { this.table.eleMkClass(this, this.table.mouseoverclass, true); };
                              td.onmouseout  = function(e) { this.table.eleMkClass(this, this.table.mouseoverclass, false); };
                            }
                            td.style.whiteSpace = "nowrap";
                            td.style.emptyCells = "show";
                            if ( typeof this.cellWidth[n] != 'undefined' ) tr.cells[n].style.width = this.cellWidth[n];
                            if ( typeof this.cellAlign[n] != 'undefined' ) tr.cells[n].style.textAlign = this.cellAlign[n];

                            td.appendChild(this.mkContent(secs.data[i][n],n,i));
                            td.appendChild(this.win.document.createTextNode(" "));
                            td.datafield = td.firstChild.datafield;
                            td.secvalfield = td.firstChild.secvalfield;
                            
                            secs.rows[i].appendChild(td);
                        }
                    }
                }
            }
        }
        return max_anzahl;
    };

    this.addRowSection = function(section, arg)
    {
        var tr;
        var td;
        var r,i;
        var max_anzahl = 0;

        this.rowsection = section;

        if ( section.rows.length >= this.max_rownum )
        {
            r = section.data.length;
            this.mkNextbutton();
            section.data[r] = new Array();
            section.origdata[r] = new Array();
            for ( i=0; i<arg.length; i++ )
            {
                section.data[r][i] = new String(arg[i]);
                section.origdata[r][i] = arg[i];
            }
            return r;
        }

        if ( this.fixcols == true )
            max_anzahl = this.equal_table( section, arg );

        while ( section.data.length <= section.rows.length )
        {
            section.data[section.data.length] = new Array();    
            section.origdata[section.origdata.length] = new Array();  
        }
        r = section.rows.length;

        tr = this.win.document.createElement("tr");
        tr.className = this.classname;
        section.appendChild(tr);

        for ( i=0; i<arg.length; i++ )
        {
            if ( typeof this.invisible[i] == 'undefined' )
                this.invisible[i] = false;

            section.data[r][i] = new String(arg[i]);
            section.origdata[r][i] = arg[i];

            if ( this.invisible[i] != true )
            {
                td = this.win.document.createElement("td");

                td.className = this.classname + this.borderclass;
                if ( typeof this.tdclass[i] != 'undefined' )
                    this.eleMkClass(td, this.tdclass[i], true);
                td.table = this;
                td.section = section.sname;
                td.rownum = r;
                td.colnum = i;
                if ( this.ignoreEvent != true && this.classname != 'ignore' )
                {
                  td.onclick     = function(e) { this.table.act_event = e; try { this.table.findCell(this); } catch(ex) { this.table.act_event = null;  throw ex}; this.table.act_event = null };
                  td.ondblclick  = function(e) { this.table.act_event = e; try { this.table.findCell(this,true); } catch(ex) { this.table.act_event = null;  throw ex}; this.table.act_event = null };
                  td.onmouseover = function(e) { this.table.eleMkClass(this, this.table.mouseoverclass, true); };
                  td.onmouseout  = function(e) { this.table.eleMkClass(this, this.table.mouseoverclass, false); };
                }

                td.style.whiteSpace = "nowrap";
                td.style.emptyCells = "show";
                td.appendChild(this.mkContent(section.data[r][i].valueOf(),i,r));
                td.datafield = td.firstChild.datafield;
                td.secvalfield = td.firstChild.secvalfield;
                tr.appendChild(td);

                if ( arg[i] == "") td.appendChild(this.win.document.createTextNode(" "));
                if ( typeof this.cellWidth[i] != 'undefined' ) tr.cells[i].style.width = this.cellWidth[i];
                if ( typeof this.cellAlign[i] != 'undefined' ) tr.cells[i].style.textAlign = this.cellAlign[i];
            }
            else if ( this.rowsection == this.body )
            {
              if ( this.input[i] == 'hidden' )
              {
                section.data[r][i].datafield = this.doc.createElement("input");
                section.data[r][i].datafield.value = arg[i];
              }
            }
        }

        for ( ; i<max_anzahl; i++ )
        {
            section.data[r][i] = new String("");
            section.origdata[r][i] = "";
            if ( this.invisible[i] != true )
            {
                td = this.win.document.createElement("td");
                td.className = this.classname + this.borderclass;
                if ( typeof this.tdclass[i] != 'undefined' )
                    this.eleMkClass(td, this.tdclass[i], true);
                td.table = this;
                td.section = section.sname;
                td.rownum = r;
                td.colnum = i;
                if ( this.ignoreEvent != true && this.classname != 'ignore' )
                {
                  td.onclick     = function(e) { this.table.act_event = e; try { this.table.findCell(this); } catch(ex) { this.table.act_event = null;  throw ex}; this.table.act_event = null };
                  td.ondblclick  = function(e) { this.table.act_event = e; try { this.table.findCell(this,true); } catch(ex) { this.table.act_event = null;  throw ex}; this.table.act_event = null };
                  td.onmouseover = function(e) { this.table.eleMkClass(this, this.table.mouseoverclass, true); };
                  td.onmouseout  = function(e) { this.table.eleMkClass(this, this.table.mouseoverclass, false); };
                }
                td.style.whiteSpace = "nowrap";
                td.style.emptyCells = "show";
                if ( typeof this.cellWidth[i] != 'undefined' ) tr.cells[i].style.width = this.cellWidth[i];
                if ( typeof this.cellAlign[i] != 'undefined' ) tr.cells[i].style.textAlign = this.cellAlign[i];

                td.appendChild(this.win.document.createTextNode(""));
                td.appendChild(this.win.document.createTextNode(" "));
                tr.appendChild(td);

            }
        }
        return r;
    };

    this.addRow = function()
    {
        var arg = this.addRow.arguments;
        return this.addRowSection(this.body, arg );
    };

    this.add = function()
    {
        var arg = this.add.arguments;
        return this.addRowSection(this.body, arg );
    };

    this.addHead = function()
    {
        var arg = this.addHead.arguments;
        if ( this.head == null )
        {
            this.head = this.table.createTHead();
            this.head.className = this.classname;
            this.head.sname = 'head';
            this.head.data = new Array();
            this.head.origdata = new Array();
            this.sections["head"] = this.head;
        }
        return this.addRowSection(this.head, arg );
    };

    this.delRowSection = function(section, num)
    {
        var i,c,r;
        if ( num < 0 || num >= section.rows.length ) return;
        section.deleteRow(num);
        for ( i=num + 1; i<section.data.length; i++)
        {
            section.data[i - 1] = section.data[i];
            section.origdata[i - 1] = section.origdata[i];
        }
        delete section.data[i-1];
        delete section.origdata[i-1];

        section.data.length = section.data.length - 1;
        section.origdata.length = section.origdata.length - 1;

        for ( r=0; r<section.rows.length; r++ )
            for ( c=0; c<section.rows[r].cells.length; c++ )
            {
                section.rows[r].cells[c].rownum = r;
                section.rows[r].cells[c].cellnum = c;
            }
    };

    this.delRow = function(num)
    {
        this.reset();
        this.delRowSection(this.body, num);
    };

    this.delHead = function(num)
    {
        if ( this.head != null )
            this.delRowSection(this.head, num);
    };

    this.clearHead = function()
    {
        if ( this.head == null )
            return;

        if ( this.act_section == this.head)
            this.reset();

        try {
            if ( this.head.parentNode != null )
                this.table.removeChild(this.head);
        }
        catch(e)
        {
            this.exception("uuu",e);
        }
        this.sections["head"] = this.head = null;
    };

    this.clearBody = function()
    {
        this.reset();

        if ( this.next_button != null && this.next_button.parentNode != null )
        {
            this.frame.removeChild(this.next_button);
            this.next_button = null;
        }

        if ( this.body.parentNode != null )
            this.table.removeChild(this.body);
        this.body = this.win.document.createElement("tbody");
        this.table.appendChild(this.body);
        this.body.className = this.classname;
        this.body.sname = 'body';
        this.body.data = new Array();
        this.body.origdata = new Array();
        this.sections["body"] = this.body;

        this.max_rownum = 10000;
        this.max_rownum_step = 500;
    };

    this.clear = function()
    {
        this.clearHead();
        this.clearBody();
        this.reset();

    };

    this.getHead = function( row, col )
    {
        if ( this.head != null && row >= 0 && col >= 0 && row < this.head.data.length && col < this.head.data[0].length )
            return this.head.data[row][col];
        return null;
    };

    this.getDatafield = function( row, col )
    {
        if ( row >= 0 && col >= 0 && row < this.body.data.length && col < this.body.data[0].length )
        {
          if ( this.invisible[col] != true )
          {
            td = this.body.rows[row].cells[this.col2tab(col)];
            return ( typeof td.datafield == 'object') ? td.datafield : null;
          }
          else
          {
            return ( typeof this.body.data[row][col].datafield == 'object' ) ? this.body.data[row][col].datafield : null;
          }
        }
        return null;
    }

    this.getData = function( row, col, orig )
    {
        var retval = null;
        if ( row >= 0 && col >= 0 && row < this.body.data.length && col < this.body.data[0].length )
        {
            if ( typeof orig != 'undefined' && orig == true )
                retval = this.body.origdata[row][col];
            else if ( this.invisible[col] != true )
            {
              var td = this.body.rows[row].cells[this.col2tab(col)];
              if ( typeof td.datafield == 'object')
              {
                if ( td.datafield.mne_timevalue )
                  retval = td.datafield.mne_timevalue;
                else
                  retval = td.datafield.value;
              }
              else
              {
                retval = this.body.data[row][col].valueOf();
              }
            }
            else
            {
              retval = this.body.data[row][col].valueOf();
            }
        }
        return retval;
    };

    this.setData = function( row, col, value, typ )
    {
        var retval = null;
        if ( row >= 0 && col >= 0 && row < this.body.data.length && col < this.body.data[0].length )
        {
            var str = this.txtFormat.call(this, value, typ);
            var d = this.body.data[row][col].datafield;
            
            this.body.data[row][col] = new String(str);
            this.body.origdata[row][col] = value;

            if ( typeof d == 'object' )
            {
              d.value = str;
              this.body.data[row][col].datafield = d;
            }
            
            if ( this.invisible[col] != true )
            {
                var td = this.body.rows[row].cells[this.col2tab(col)];

                if ( typeof td.datafield == 'object' )
                  this.showInput(td.datafield, value, typ, true);
                else
                  this.showOutput(td, value, typ )

                retval = this.body.rows[row].cells[this.col2tab(col)];
            }
            

            return retval;
        }
        throw "#mne_lang#Zeilennummer oder Spaltennummer sind ausserhalb des Bereichs" + "[" + row + "][" + col + "]";
    };

    this.getLength = function()
    {
        return this.body.data.length;
    };

    this.getWidth = function()
    {
        if ( this.body.data.length >0 ) return this.body.data[0].length;
        return 0;
    };

    this.up = function(p_pos1, p_pos2)
    {
        var r1,r2;
        var tmp;

        var pos1 = p_pos1;
        var pos2 = p_pos2;

        if ( typeof pos1 != 'number' ) pos1 = 1; else pos1++;
        if ( typeof pos2 != 'number' ) pos2 = this.body.rows.length - 1;

        if ( this.act_section != this.body || this.act_rownum < pos1 || this.act_rownum > pos2 )
        {
            if ( this.act_rownum < 0 )
                alert("#mne_lang#keine Zeile ausgewählt");
            return;
        }

        r1 = this.body.rows[this.act_rownum];
        r2 = this.body.rows[this.act_rownum - 1];

        r1.parentNode.removeChild(r1);
        r2.parentNode.insertBefore(r1,r2);

        tmp = this.body.data[this.act_rownum];
        this.body.data[this.act_rownum] = this.body.data[this.act_rownum - 1];
        this.body.data[this.act_rownum - 1] = tmp;

        this.act_rownum--;
    };

    this.down = function(p_pos1, p_pos2)
    {
        var r1,r2;
        var tmp;

        var pos1 = p_pos1;
        var pos2 = p_pos2;

        if ( typeof pos1 != 'number' ) pos1 = 0;
        if ( typeof pos2 != 'number' ) pos2 = this.body.rows.length - 2; else pos2 = pos2 - 1;

        if ( this.act_section != this.body || this.act_rownum < pos1 || this.act_rownum > pos2 )
        {
            if ( this.act_rownum < 0 )
                alert("#mne_lang#keine Zeile ausgewählt");
            return;
        }

        r1 = this.body.rows[this.act_rownum];
        r2 = this.body.rows[this.act_rownum + 1];

        r2.parentNode.removeChild(r2);
        r1.parentNode.insertBefore(r2,r1);

        tmp = this.body.data[this.act_rownum];
        this.body.data[this.act_rownum] = this.body.data[this.act_rownum + 1];
        this.body.data[this.act_rownum + 1] = tmp;

        this.act_rownum++;
    };

    this.getColnum = function(i)
    {
        if ( this.head != null && i >= 0 && this.head.rows.length > 0 && this.head.rows[0].cells.length > i )
            return this.head.rows[0].cells[i].colnum;
        else if ( i >= 0 && this.body.rows.length > 0 && this.body.rows[0].cells.length > i )
            return this.body.rows[0].cells[i].colnum;
        else
            return 0;
    };

    this.unselect = function()
    {
        this.findCell(null);
    };

    this.setInvisible = function( col )
    {
        if ( col > this.invisible.length || this.invisible[col] == true )
        {
            this.invisible[col] = true;
            return;
        }

        var s;
        var r;
        var tab_col = this.col2tab(col);

        this.invisible[col] = true;
        s = null;
        for ( s in this.sections )
        {
            if ( typeof this.sections[s] != 'undefined' && this.sections[s] != null )
            {
                for ( r = 0; r < this.sections[s].rows.length; r++ )
                    if ( this.sections[s].rows[r].cells.length > tab_col )
                        this.sections[s].rows[r].deleteCell(tab_col);
            }
        }
    };

    this.setVisible = function ( col )
    {
        if ( col > this.invisible.length || this.invisible[col] != true )
            return;

        var s;
        var r;
        var tab_col = this.col2tab(col);

        s = null;
        for ( s in this.sections )
        {
          if ( typeof this.sections[s] != 'undefined' && this.sections[s] != null )
          {
            for ( r = 0; r < this.sections[s].rows.length; r++ )
            {
              if ( this.sections[s].rows[r].cells.length >= tab_col )
              {
                td = this.win.document.createElement("td");
                if ( typeof this.sections[s].data[r][col] == 'undefined' )
                  this.sections[s].data[r][col] = "";
                td.appendChild(this.mkContent(this.sections[s].data[r][col],col,r));
                if ( this.sections[s].data[r][col] == "" ) td.appendChild(this.win.document.createTextNode(" "));
                td.className = this.classname + this.borderclass;
                if ( typeof this.tdclass[col] != 'undefined' )
                  this.eleMkClass(td, this.tdclass[col], true);
                td.table = this;
                td.section = s;
                td.rownum = r;
                td.colnum = col;
                td.datafield = td.firstChild.datafield;
                td.secvalfield = td.firstChild.secvalfield;
                if ( this.ignoreEvent != true && this.classname != 'ignore' )
                {
                  td.onclick     = function(e) { this.table.act_event = e; try { this.table.findCell(this); } catch(ex) { this.table.act_event = null;  throw ex}; this.table.act_event = null };
                  td.ondblclick  = function(e) { this.table.act_event = e; try { this.table.findCell(this,true); } catch(ex) { this.table.act_event = null;  throw ex}; this.table.act_event = null };
                  td.onmouseover = function(e) { this.table.eleMkClass(this, this.table.mouseoverclass, true); };
                  td.onmouseout  = function(e) { this.table.eleMkClass(this, this.table.mouseoverclass, false); };
                }
                td.style.whiteSpace = "nowrap";
                td.style.emptyCells = "show";
                if ( typeof this.cellWidth[col] != 'undefined' ) tr.cells[i].style.width = this.cellWidth[col];
                if ( typeof this.cellAlign[col] != 'undefined' ) tr.cells[i].style.textAlign = this.cellAlign[col];

                if ( this.sections[s].rows[r].cells.length == tab_col )
                  this.sections[s].rows[r].appendChild(td);
                else
                  this.sections[s].rows[r].insertBefore(td, this.sections[s].rows[r].cells[tab_col]);
              }
            }
          }
        }
        this.invisible[col] = false;
    };

    this.sort = function(col)
    {
        var i,n;
        var str;
        var length;
        var colnum;

        if ( this.body.data.length > 0 )
        {
            length = this.body.data[0].length;
            colnum = this.body.rows[0].cells[col].colnum;
        }
        else if ( this.head != null && this.head.data.length > 0 )
        {
            length = this.head.data[0].length;
            colnum = this.head.rows[0].cells[col].colnum;
        }
        else return;

        if ( col < 0 || col > length ) return;

        this.body.data.sort( function(x1, x2)
                {
            if ( x1[colnum] < x2[colnum] ) return -1;
            else if ( x1[colnum] == x2[colnum] ) return 0;
            else return 1;
                });

        while ( this.body.hasChildNodes() > 0 ) this.body.removeChild(this.body.firstChild);

        for ( i=0; i<this.body.data.length && i < this.max_rownum; i++ )
        {
            if ( this.body.data[i].length > 0  )
            {
                str = "this.addRow('" + this.txtMascarade(this.body.data[i][0]) + "'";
                for ( n=1; n < this.body.data[i].length; n++ ) str += ",'" + this.txtMascarade(this.body.data[i][n].valueOf()) + "'";
                str += ");";
                eval(str);
            }
        }

        this.reset();
        if ( this.head != null && this.head.rows.length > 0 )
            this.findCell(this.head.rows[0].cells[col], false, true);	
    };

    this.show_next = function()
    {
        var i,n;
        var str;

        if ( this.body.data.length < this.max_rownum )
            return;

        i = this.max_rownum;
        this.max_rownum += this.max_rownum_step;
        for ( ; i<this.body.data.length && i < this.max_rownum; i++ )
        {
            if ( this.body.data[i].length > 0 )
            {
                str = "this.addRow('" + this.txtMascarade(this.body.data[i][0].valueOf()) + "'";
                for ( n=1; n < this.body.data[i].length; n++ ) str += ",'" + this.txtMascarade(this.body.data[i][n].valueOf()) + "'";
                str += ");";
                eval(str);
            }
        }
        if ( typeof this.scroll_form != 'undefined' )
            this.scroll_form.scrollTop = this.scroll_form.firstChild.clientHeight;
    };
};

MneAjaxTable.prototype = new MneMisc(window);  