// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    datei: js/ajax/mne_misc.js
//================================================================================
'use strict';
window.MneMisc = function(window)
{
  var i;
  
  this.win = window;
  this.doc = window.document;
  this.debuglevel = 0;
  if ( typeof this.win.config  == 'undefined' ) this.win.config = new Object;

};

mneDocevents.addInterest('winload', { winload : function(evt)
{
  var i,j;
  
  for ( i in bowser )
    if ( typeof bowser[i] != 'function' ) MneMisc.prototype.navigator[i] = bowser[i];

  if ( MneMisc.prototype.navigator.mobile ) document.body.setAttribute("aria-view-mode","mobile");
  if ( MneMisc.prototype.navigator.tablet ) document.body.setAttribute("aria-view-mode","tablet");

  if ( MneMisc.prototype.navigator.firefox || MneMisc.prototype.navigator.safari ) MneMisc.prototype.havepdf = true;

  for(i in navigator.plugins)
  {
    var plugin = navigator.plugins[i];
    for ( j in plugin)
      if ( typeof plugin[j].type != 'undefined' && plugin[j].type == 'application/pdf')
      {
        MneMisc.prototype.havepdf = true;
        break;
      }
    if ( MneMisc.prototype.havepdf == true ) break;
  }
  
}} );

MneMisc.prototype.navigator = {};
MneMisc.prototype.havepdf = false;
MneMisc.prototype.print = null;

MneMisc.prototype.exception  = function(str,e,nt)       { this.errorfound = true; alert(str + " " + e.message + "\n" + e.stack); };
MneMisc.prototype.error      = function(str,nt)         { this.errorfound = true; alert(str); };
MneMisc.prototype.warning    = function(str,nt)         { this.errorfound = true; alert(str); };
MneMisc.prototype.line       = function(str,nt)         { alert(str); };
MneMisc.prototype.status     = function(str)            { alert(str); };
MneMisc.prototype.html       = function(str,nt)         { alert(str); };
MneMisc.prototype.message    = function(str,nt)         { alert(str); };
MneMisc.prototype.debug      = function(d, str,nt)      { if ( debug <= this.debuglevel ) alert(str); };
MneMisc.prototype.setDebug   = function(d)              { this.debuglevel = d };
MneMisc.prototype.showObject = function(obj,r, s) { if ( typeof obj == 'undefined' || obj == null ) { this.message('object ist nicht definiert'); return; } var i = null; if ( typeof s == 'undefined' ) s = ''; var m = "warning"; for( i in obj ) { this[m](s + i + ": " + obj[i]); m = "message"; if ( r && typeof obj[i] == 'object') this.showObject(obj[i], true, i + ":")} };

//==========================================================================================
//Elementfunctionen
//==========================================================================================
MneMisc.prototype.eleClone = function(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = MneMisc.prototype.eleClone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = MneMisc.prototype.eleClone(obj[attr]);
    }
    return copy;
  }

  throw new Error(MneMisc.prototype.txtGetText("#mne_lang#Kann Element nicht klonen - der Type ist unbekannt"));
}

MneMisc.prototype.eleIsEmpty = function(obj)
{
  if ( typeof Object.keys != 'undefined' )
      return !Object.keys(obj).length > 0;
  
  var i,j;
  j = 0;
  i = 0;
  for ( i in obj ) { j++;}
  return ( j == 0);
  
};

MneMisc.prototype.eleIsNotdefined = function(ele)
{
  return ( typeof ele == 'undefined' || ele == null );
}

MneMisc.prototype.eleIsDefined = function(ele)
{
  return ( typeof ele != 'undefined' &&  ele != null );
}

MneMisc.prototype.eleHavevalue = function(ele)
{
  return ( typeof ele != 'undefined' && ele != null && ele != '' && ele != '################');
}

MneMisc.prototype.eleGetById = function(ele, id, findroot )
{
  var e = ele.querySelector('#' + id);
  if ( findroot != true && e == ele ) return null;
  return e;
};

MneMisc.prototype.eleSetAttributes = function(root, ele, attr, norecursive )
{
  var i;
  var a;
  
  if ( typeof ele.id == 'string' && typeof attr[ele.id] == 'object')
  {
    var n = null;
    root[ele.id]  = ele;
    a = attr[ele.id];
    for ( n in  a )
    {
      if ( n == 'remove' )
        ele.parentNode.removeChild(ele);

      if ( n == 'fixwidth' )
        ele.style.width = MneMisc.prototype.posGetWidth.call(this,ele) + "px";

      ele.root = root;
      eval('ele.' + n + ' = a[n]' );
      
    }
  }
  
  if ( norecursive == true ) return;
  
  for ( i=0; i<ele.childNodes.length; i++ )
    MneMisc.prototype.eleSetAttributes (root, ele.childNodes[i], attr);
};

MneMisc.prototype.eleMkClass = function(node, name, value, clear_name)
{
  var c;

  if ( node.nodeType == 3 ) return;
  
  if ( typeof clear_name == "string" && clear_name != "" )
    this.eleMkClass(node, clear_name, false);

  if ( value != false )
  {
    if ( typeof node.className == 'undefined' )
      node.className = name;
    else if ( node.className.indexOf(name) == - 1) 
      node.className = node.className + " " + name;
  }
  else
  {
    if ( typeof node.className == "undefined" ) return;
    eval("node.className = node.className.replace(/ *" + name + "[^ ]* */, ' ' )");	
  }

  c = node.className;
  c = c.replace(/ +/g,' ');
  node.className = c;
};

MneMisc.prototype.eleInsertAfter = function(neu,node)
{
  if ( node.nextSibling == null ) node.parentNode.appendChild(neu);
  else node.parentNode.insertBefore(neu, node.nextSibling);
};

MneMisc.prototype.eleMkElements = function(frame)
{
  if ( typeof frame != 'object' ) frame = this.doc;
  if ( typeof frame != 'object' ) frame = document;
  this.eleMkSelects(frame);
  this.eleMkInputs(frame);
  this.eleMkSpans(frame);
  this.eleMkTextareas(frame);
}

MneMisc.prototype.eleMkTextareas = function(frame)
{
  var i;
  var obj = frame.querySelectorAll('textarea');

  for ( i=0; i<obj.length; ++i )
    this.eleMkTextareasSingle(obj[i]);
}

MneMisc.prototype.eleMkTextareasSingle = function(obj)
{
    if ( typeof obj.wrapper == 'undefined'  ) 
    {
      var ele = this.doc.createElement('div');
      ele.className = 'ele-wrapper textarea-wrapper contain-textarea';
      if ( obj.parentNode ) obj.parentNode.insertBefore(ele, obj.nextSibling);
      ele.appendChild(obj);
      obj.wrapper = ele;
    }
}

MneMisc.prototype.eleMkSelects = function(frame)
{
  var i;
  var obj = frame.querySelectorAll('select');

  for ( i=0; i<obj.length; ++i )
    this.eleMkSelectsSingle(obj[i]);
}

MneMisc.prototype.eleMkSelectsSingle = function(obj)
{
    if ( typeof obj.wrapper == 'undefined'  ) 
    {
      var ele = this.doc.createElement('div');
      ele.className = 'ele-wrapper select-wrapper contain-select';
      if ( obj.parentNode ) obj.parentNode.insertBefore(ele, obj.nextSibling);
      ele.appendChild(obj);
      obj.wrapper = ele;
    }
}

MneMisc.prototype.eleMkInputs = function(frame)
{
  var i;
  var obj = frame.querySelectorAll('input');

  for ( i=0; i<obj.length; ++i )
      this.eleMkInputsSingle(obj[i]);
}

MneMisc.prototype.eleMkInputsSingle = function(ele)
{
    if ( typeof ele.wrapper != 'undefined' )
      return;
    
    switch(ele.type)
    {
      case 'password':
      case 'text':
        var wrapper = this.doc.createElement('div');
        wrapper.className = 'ele-wrapper input-wrapper contain-text';
        if ( ele.parentNode ) ele.parentNode.insertBefore(wrapper, ele.nextSibling);
        wrapper.appendChild(ele);
        ele.wrapper = wrapper;
        ele.valueframe = null;
        ele.setSelectvalues = function(values, hide, num, max )
        {
          var i;
          if ( this.valueframe == null )
          {
            if ( typeof hide == 'undefined' ) hide = [];
            this.valueframe = document.createElement("div");
            this.valuetable = new MneAjaxTable(window, this.valueframe, 'selectval', true, true );
            for ( i=0; i<hide.length; i++) this.valuetable.setInvisible(hide[i]);
            this.valuetable.valueelement = this;
            this.valuetable.valuenum = ( typeof num != 'undefined' ) ? num : 0;
            this.valuetable.clickCb["body"] = function(tab)
            { 
              tab.valueelement.value = tab.getData(tab.act_rownum, tab.valuenum, true );
              tab.valueelement.focus();
              if ( typeof tab.valueelement.onkeyup == 'function' ) tab.valueelement.onkeyup();
              if ( typeof tab.valueelement.onselectvalue == 'function') tab.valueelement.onselectvalue()
            };
            this.valuepopup = new MneAjaxPopup(window, '', this.valueframe, true);
          }

          if ( typeof max == 'undefined' ) max = 100;
          this.valuetable.clear();
          for ( i=0; i<values.length && i < max; i++)
            {
               this.valuetable.add(...values[i] )
            }
          this.valuepopup.setPosition(MneMisc.prototype.posGetLeft(this), MneMisc.prototype.posGetTop(this) + MneMisc.prototype.posGetHeight(this));
          if ( values.length == 0 )
          this.valuepopup.hidden();
          else
          this.valuepopup.show(false,false);
        }
        ele.onblur = function(evt)
        {
          if ( this.valueframe != null )
          {
            var p = this.valuepopup;
            window.setTimeout(function() { p.hidden(); }, 500);
          }
        }
        break;

      case 'checkbox':
        var d = this.doc.createElement("div");
        d.className = 'ele-wrapper contain-checkbox';
        ele.wrapper = d;
        d.datafield = ele.valuefield = this.doc.createElement("input");
        ele.valuefield.type = "hidden";
        ele.valuefield.vtype = "bool";
        ele.valuefield.wrapper = ele.valuefield;
        ele.valuefield.checkbox = ele;

        if ( ele.parentNode ) this.eleInsertAfter(d, ele);

        d.appendChild(this.doc.createElement('div'));
        d = d.lastChild;
        d.className = 'checkbox-wrapper';
        if ( ele.disabled ) d.className += ' checkbox-disabled';
        d.appendChild(ele);
        d.appendChild(this.doc.createElement("label"));
        d.lastChild["for"] = ele.id;
        d.lastChild["checkbox"] = ele;
        d.lastChild.wrapper = d.parentNode;
        d.lastChild.onclick = function(evt)
        {
          if ( this.checkbox.disabled ) return;
          this.checkbox.checked = !this.checkbox.checked;
          this.checkbox.valuefield.value = ( this.checkbox.checked ) ? "1" : "0";
          MneMisc.prototype.inOnmodify.call(this);
          MneMisc.prototype.inOnmodify.call(this.checkbox.valuefield);
          if ( MneMisc.prototype.eleIsDefined(this.checkbox.onclick) ) this.checkbox.onclick.call(this.checkbox, evt);
        }
        
        d.appendChild(ele.valuefield);
        break;
      default:
        ele.wrapper = ele;
        break;
    }
}

MneMisc.prototype.eleMkSpans = function(frame)
{
  var i;
  var obj = frame.querySelectorAll('span');

  for ( i=0; i<obj.length; ++i )
  {
    var ele = obj[i];
    if ( typeof ele.wrapper == 'undefined' )
    {
      ele.wrapper = ele;
      this.eleMkClass(ele, 'ele-wrapper contain-span', true);
    }
  }
}

MneMisc.prototype.eleRemove = function(node)
{
  if ( typeof node == 'undefined' || node == null ) return;
  if ( node.tagName == 'INPUT' && typeof node.helpframe != 'undefined' && node.helpframe != null ) node.onmouseout();
  if ( typeof node.parentNode != 'undefined' && node.parentNode != null ) node.parentNode.removeChild(node);
};

MneMisc.prototype.eleGetRawTextContent = function(node)
{
  if ( node.nodeType == 3  ) return node.data;
  return node.innerText;
};

MneMisc.prototype.showInput = function(p_input, value, typ, check, onlyno )
{

  var input = p_input;
  
  if ( typeof input == 'string')
  {
    if ( typeof this.obj.inputs[input] == 'undefined' )
      {
      this.error("MneMisc::showInput <" + input + "> ist nicht definiert");
      return;
      }
  input = this.obj.inputs[input];
  }
  
  if ( typeof input == 'undefined' )
  {
  this.error("MneMisc::showInput <" + input + "> ist nicht definiert");
  return;
  }
  
  var wrapper = input.wrapper;
  switch (input.type)
  {
    case "checkbox":
      input.checked = (value != false && value != 0 && value[0] != "f" && value != "false");
      if ( ( check || wrapper.className.indexOf("modifywrong") >= 0 ||  wrapper.className.indexOf("modifyok") >= 0 ) && typeof input.onclick == 'function') input.onclick();
      break;
    case "select-one":
      input.value = value;
      input.checkvalue = value;
      if ( ( check || wrapper.className.indexOf("modifywrong") >= 0 ||  wrapper.className.indexOf("modifyok") >= 0 ) && typeof input.onchange == 'function') input.onchange();
      break;
    default:
    {
      if (input.inputtyp == 'datetime' || input.inputtyp == 'date' || input.inputtyp == 'time' || input.inputtyp == 'clocktime' || input.inputtyp == 'interval' || typ == '1000' || typ == '1001' || typ == '1002' || typ == '1003' )
      {
        var t = ( typeof typ == 'undefined' || typ == null ) ? input.inputtyp : typ;
        input.value = this.txtFormat.call(this, value, t, input.inputformat);
        input.mne_timevalue = value;
        if (  ( check || wrapper.className.indexOf("modifywrong") >= 0 ||  wrapper.className.indexOf("modifyok") >= 0 ) && typeof input.onkeyup == 'function') input.onkeyup();
      }
      else
      {
        input.value = value;
        input.checked = (typeof value != 'undefined' && value != false && value != 0 && value[0] != "f" && value != "false");
        try { if ( ( check || wrapper.className.indexOf("modifywrong") >= 0 ||  wrapper.className.indexOf("modifyok") >= 0 ) && typeof input.onkeyup == 'function') input.onkeyup();
        }
        catch(e)
        {
          this.exception("input", e);
        }
      }

      if ( input.inputtyp == 'email' || typ == '1010')
      {
        if ( typeof input.label != 'undefined' )
        {
          if ( value != '' )
            input.label.innerHTML = '<a class="email" href="mailto:' + value + '">' + input.label.value + ':</a>';
            else
              this.showSingleLabel(input.label, input.label.value);
        }
      }
      else if ( input.inputtyp == 'link' || typ == '1011')
      {
        if ( typeof input.label != 'undefined')
        {
          if ( value != '' )
            input.label.innerHTML = '<a class="link" href="http://' + value + '" target="extern">' + input.label.value + ':</a>';
            else
              this.showSingleLabel(input.label, input.label.value);
        }
      }
      else if ( input.inputtyp == 'color' || typ == '1020')
      {
        try
        {
        input.style.backgroundColor = '#' + value;
        input.style.color = '#' + value;
        this.eleMkClass(wrapper, "modify", false);
        }
        catch(e)
        {
          /* Fehler ignorieren */
        }
      }
    }
  }
  if ( ( onlyno || input.readOnly == true ) && wrapper.className.indexOf("modifyok") >= 0 )
    this.eleMkClass(wrapper, "modifyno", true, "modify");
};


MneMisc.prototype.showInputDefined = function(input, value, typ, check)
{
  if ( typeof value != 'undefined' &&  value != null )
    this.showInput(input, value, typ, check );
};

MneMisc.prototype.showInputExists = function(input, value, typ, check)
{
  if ( typeof input != 'undefined' &&  input != null )
    this.showInput(input, value, typ, check );
};

MneMisc.prototype.showOutput = function(p_output, value, typ )
{
  var output = p_output;
  if ( typeof output == 'string'  )
  {
    if ( typeof  this.obj.outputs[output] != 'undefined') output = this.obj.outputs[output];
    else throw "showOutput: " + output + ': ist nicht definiert';  
  }
  var t = ( typeof typ == 'undefined' || typ == null ) ? output.inputtyp : typ;
  while( output.firstChild != null ) output.removeChild(output.firstChild);
  
  if ( t == 'color' || t == '1020')
  {
    try
    {
    output.style.backgroundColor = '#' + value;
    output.style.color = '#' + value;
    }
    catch(e)
    {
      /* Fehler ignorieren */
    }
  }
  else
    {
    output.appendChild(this.doc.createTextNode(this.txtFormat.call(this, value, t, output.outputformat )));
    
    }
};

MneMisc.prototype.showOutputDefined = function(output, value, typ )
{
  if ( typeof value != 'undefined' &&  value != null )
    this.showOutput(output, value, typ );
};

MneMisc.prototype.showOutputExists = function(output, value, typ )
{
  var o = output;
  if ( typeof output == 'string'  ) o = this.obj.outputs[output];
  
  if ( typeof o != 'undefined' &&  o != null )
    this.showOutput(output, value, typ );
};

//==========================================================================================
//Eventfunctionen
//==========================================================================================
MneMisc.prototype.evtMkEvent = function(win, evt)
{
    (new MneMisc(win)).warning("bitte MneDocEvents.mkEvent benutzen");
    return MneDocEvents.prototype.mkEvent(win, evt);
}
//==========================================================================================
//Textfunktionen
//==========================================================================================
MneMisc.prototype.txtGetText = function(str)
{
  if ( str.indexOf('#mne_lang') == 0 ) return str.substring(10, str.length);
  return str;
};

if ( MneMisc.prototype.navigator == "MSIE" )
{
  MneMisc.prototype.txtGetTextContent = function(node)
  {
    if ( node.nodeType == 3  ) return node.data;
    return node.innerText;
  };
}
else
{
  MneMisc.prototype.txtGetTextContent = function(node)
  {
    return node.textContent;
  };
}

MneMisc.prototype.txtAddNull = function(value, size )
{
  var i,j;
  var v;
  if ( size < 2 ) return value + "";
  v = value + "";  
  j=10;
  for ( i=1; i<size; i++ )
  {
    if ( value < j ) v = "0" + v;
    j = j * 10;
  }
  return v; 
};

MneMisc.prototype.txtToDate = function(value)
{
  if ( value == '' || value == 0 ) return '';
  var win = ( typeof this.win == 'undefined') ? window : this.win;
  var d = new Date();	  
  var lang = win.mne_config.language;
  if ( typeof lang == 'undefined' ) lang = 'de';

  d.setTime(value * 1000 );
  switch(lang)
  {
  case 'de':
    return this.txtAddNull(d.getDate(),2) + "." + this.txtAddNull(( d.getMonth() + 1 ),2) + "." + this.txtAddNull(d.getFullYear(),2);
  case 'en':
    if ( win.mne_config.region == 'US' )
      return this.txtAddNull(( d.getMonth() + 1 ),2) + "/" + this.txtAddNull(d.getDate(),2) + "/" + this.txtAddNull(d.getFullYear(),2);
    return this.txtAddNull(d.getDate(),2) + "/" + this.txtAddNull(( d.getMonth() + 1 ),2) + "/" + this.txtAddNull(d.getFullYear(),2);
  case 'fr':
    return this.txtAddNull(d.getDate(),2) + "-" + this.txtAddNull(( d.getMonth() + 1 ),2) + "-" + this.txtAddNull(d.getFullYear(),2);
  }
  
  return d.getDate() + "." + ( d.getMonth() + 1 ) + "." + d.getFullYear();
};

MneMisc.prototype.txtToTime = function(value, format)
{
  if ( value == '' ) return '';
  if ( value == '0' ) { if ( format != 'l' ) return "00:00"; return "00:00:00"; }
  var d = new Date();	  
  d.setTime(value * 1000 );
  if ( format != 'l' )
    return this.txtAddNull(d.getHours(),2) + ":" + this.txtAddNull(d.getMinutes(),2);
  
  return this.txtAddNull(d.getHours(),2) + ":" + this.txtAddNull(d.getMinutes(),2) + ":" + this.txtAddNull(d.getSeconds(),2);
};

MneMisc.prototype.txtToInterval = function(p_value, format)
{
  var sign = "";
  var value = p_value;
  
  if ( value == '0' ) { if ( format != 'l' ) return "00:00";  return "00:00:00"; }
  if ( value == '' ) return "";
  if ( value < 0 ) { sign = "-"; value = -value; }
  if ( format != 'l' )
    return sign + this.txtAddNull(parseInt(value/3600),2) + ":" + this.txtAddNull(parseInt((value - (parseInt(( value / 3600))*3600))/60),2);
  
  return sign + this.txtAddNull(parseInt(value/3600),2) + ":" + this.txtAddNull(parseInt((value - (parseInt(( value / 3600))*3600))/60),2) + ":" + this.txtAddNull(value % 60,2);

};

MneMisc.prototype.txtToDay = function(value)
{
	switch(value + "")
	{
	case '1':
	      return '#mne_lang#Sonntag';
	case '2':
	      return '#mne_lang#Montag';
	case '3':
	      return '#mne_lang#Dienstag';
	case '4':
	      return '#mne_lang#Mittwoch';
	case '5':
	      return '#mne_lang#Donnerstag';
	case '6':
	      return '#mne_lang#Freitag';
	case '7':
	      return '#mne_lang#Samstag';
	default:
	  return value;
	}
};

MneMisc.prototype.txtToQuarter = function(value, format)
{
  if ( value == '' ) return "";
  if ( format == 't' || format == 'text' ) return value;
  
  var d = new Date();   
  d.setTime(value * 1000 );
  if ( format == 'y' || format == 'year')
    return d.getFullYear();
  
  return parseInt ( (d.getMonth() + 1) / 3 ) + 1 + "/" + d.getFullYear();

};

MneMisc.prototype.txtToDateTime = function(value,format) { if ( value == '' || value == 0 ) return ''; return  MneMisc.prototype.txtToDate.call(this,value) + " " + MneMisc.prototype.txtToTime.call(this, value, format); };

MneMisc.prototype.txtMkValue = function(p_value)
{
  var value = p_value;
  var win = ( typeof this.win == 'undefined') ? window : this.win;
  if ( typeof value != 'string') return value;
  
  if ( win.mne_config.locale.thousands_sep != '' )
    value = value.replace(new RegExp("\\" + win.mne_config.locale.thousands_sep, "g"), "");
  if ( win.mne_config.locale.decimal_point != '.' )
    value = value.replace(new RegExp("\\" + win.mne_config.locale.decimal_point, "g"), ".");
  return value;
};

MneMisc.prototype.txtMkIValue = function(p_value)
{
    var value = p_value;
    var win = ( typeof this.win == 'undefined') ? window : this.win;
    if ( typeof value != 'string') value = value.toString();
  
    if ( win.mne_config.locale.decimal_point != '.' )
        value = value.replace(new RegExp("\\.", "g"), win.mne_config.locale.decimal_point);
    return value;
};

MneMisc.prototype.txtMkvDateValue = function(p_value)
{
  var win = ( typeof this.win == 'undefined') ? window : this.win;
  var lang = win.mne_config.language;
  if ( typeof lang == 'undefined' ) lang = 'de';

  if ( p_value == "" ) return "";
  switch(lang)
  {
  case 'en':
    if ( win.mne_config.region == 'US' )
      return p_value.substr(2,2) + "/" + p_value.substr(0,2) + "/" + p_value.substr(4,4);

    return p_value.substr(0,2) + "/" + p_value.substr(2,2) + "/" + p_value.substr(4,4);
  case 'fr':
    return p_value.substr(0,2) + "-" + p_value.substr(2,2) + "-" + p_value.substr(4,4);
  default:
    return p_value.substr(0,2) + "." + p_value.substr(2,2) + "." + p_value.substr(4,4);
  }
}

MneMisc.prototype.txtFormat = function(value, typ, format)
{
  switch(typ)
  {
  case 'datetime':
  case '1000':
    return MneMisc.prototype.txtToDateTime.call(this,MneMisc.prototype.txtMkValue.call(this,value), format);

  case 'cdatetime':
  case '1007':
    return MneMisc.prototype.txtMkvDateValue.call(this, value.substr(0,8)) + value.substr(8);
    
  case 'date':
  case '1001':
    return MneMisc.prototype.txtToDate.call(this, MneMisc.prototype.txtMkValue.call(this,value));

  case 'cdate':
  case '1007':
    return MneMisc.prototype.txtMkvDateValue.call(this, value);
    
  case 'time':
  case '1002':
    return MneMisc.prototype.txtToTime.call(this,MneMisc.prototype.txtMkValue.call(this,value),format);

  case 'ctime':
  case '1008':
    return value;
    
  case 'clocktime':
  case 'interval':
  case '1003':
    return MneMisc.prototype.txtToInterval.call(this,MneMisc.prototype.txtMkValue.call(this,value),format);

  case 'day':
  case '1004':
    return MneMisc.prototype.txtToDay.call(this, MneMisc.prototype.txtMkValue.call(this,value));
    
  case 'quarter':
  case '1005':
    return MneMisc.prototype.txtToQuarter.call(this, MneMisc.prototype.txtMkValue.call(this,value, format));

  default:
    return value;
  }
  return value;
};

MneMisc.prototype.txtSprintf = function(str)
{
  var result = str;
  var arg = arguments;
  var i,s;

  for ( i=1; i<arg.length; i++ )
  {
    s = "$" + i ;
    result = result.replace(s, arg[i] );
  }
  return result;
};

MneMisc.prototype.txtMascarade_single = function(str, c, mc)
{
  var m = ( typeof mc == 'undefined' ) ? m = '\\' + c : m = mc;
  var i;
  var alt,neu;

  neu = "";
  alt = str;
  while ( ( i= alt.indexOf(c)) != -1 )
  {
    neu += alt.substring(0,i) + m;
    alt = alt.substr(i+1);
  }
  neu += alt;
  return neu;
}

MneMisc.prototype.txtMascarade = function(str)
{
  var neu;
  
  neu = MneMisc.prototype.txtMascarade_single(str, '\\', '\\\\');
  neu = MneMisc.prototype.txtMascarade_single(neu, "'",  "\\'");
  neu = MneMisc.prototype.txtMascarade_single(neu, '\n', '\\n');

  return neu;

};

//==========================================================================================
//Positionsfunktionen
//==========================================================================================
MneMisc.prototype.posGetLeft = function( p_obj, prt )
{
  var oval = 0;
  var pval = 0;
  var obj = p_obj;
  if ( typeof obj == 'undefined' ) obj = this;
  if ( typeof obj.offsetLeft == 'undefined' ) return 0;

  try { while ( obj ) { oval += ( obj.offsetLeft - obj.scrollLeft ); obj = obj.offsetParent; } } catch (e ) {}; 
  try { while ( prt ) { pval += ( prt.offsetLeft - prt.scrollLeft ); prt = prt.offsetParent; } } catch (e ) {}; 

  return oval - pval;
};

MneMisc.prototype.posGetTop = function( p_obj, prt )
{
  var oval = 0;
  var pval = 0;
  var obj = p_obj;
  if ( typeof obj == 'undefined' ) obj = this;
  if ( typeof obj.offsetTop == 'undefined' ) return 0;

  try { while ( obj ) { oval += ( obj.offsetTop - obj.scrollTop ); obj = obj.offsetParent; } } catch (e ) {}; 
  try { while ( prt ) { pval += ( prt.offsetTop - prt.scrollTop ); prt = prt.offsetParent; } } catch (e ) {}; 

  return oval - pval;
};

MneMisc.prototype.posGetWidth = function( p_obj )
{
  var obj = p_obj;
  if ( typeof obj == 'undefined' ) obj = this;
  if ( typeof obj.offsetWidth == 'undefined' ) return 0;
  return obj.offsetWidth;
};

MneMisc.prototype.posGetHeight = function( p_obj )
{
  var obj = p_obj;
  if ( typeof obj == 'undefined' ) obj = this;
  if ( typeof obj.offsetHeight == 'undefined' ) return 0;
  return obj.offsetHeight;
};

//==========================================================================================
//Eingabefunktionen
//==========================================================================================
MneMisc.prototype.inSetCursor = function(field, begin)
{
    try 
    {
      field.selectionStart = field.selectionEnd = field.value.length;
      field.focus();
    }
    catch(e)
    {
    }
};

MneMisc.prototype.inGetTyp = function(dpytyp)
{
    var t = Number(dpytyp);
    switch(t)
    {
    case 1000:
       return 'datetime';
    case 1001:
       return 'date';
    case 1002:
    case 1003:
      return 'time';
    default:
       return 'modify';
    }
};

MneMisc.prototype.inClear = function(e)
{
  var t;
  if ( typeof e.inputtyp == 'undefined' ) t = "modify"; else t = e.inputtyp;

  if ( typeof e.inputcheckobject == 'object' )
  {
    if ( MneMisc.prototype.inCheck(e) )
      MneMisc.prototype.eleMkClass(e.inputcheckobject.wrapper, "modifyno", true, "modify");
    else
      MneMisc.prototype.eleMkClass(e.inputcheckobject.wrapper, "modifywrong", true, "modify");
  }

  if ( e.type == "text" || e.type == "password" || e.type == 'hidden')
  {
    if ( typeof e.onkeydown != 'function' )
      e.onkeydown = MneMisc.prototype.inOnkeydown; 

    if ( typeof e.onkeyup != 'function' )
      eval("e.onkeyup = MneMisc.prototype.inOn" + t );

    if ( MneMisc.prototype.inCheck(e) )
      MneMisc.prototype.eleMkClass(e.wrapper, "modifyno", true, "modify");
    else
      MneMisc.prototype.eleMkClass(e.wrapper, "modifywrong", true, "modify");
  }
  else if ( e.type == "radio" )
  {
    if ( typeof e.onclick != 'function' )
      eval ("e.onclick = MneMisc.prototype.inOn" + t );
    MneMisc.prototype.eleMkClass(e.wrapper, "modifyno", true, "modify");
  }
  else if ( e.type == "checkbox" )
  {
    if ( typeof e.onclick != 'function' )
      eval ("e.onclick = MneMisc.prototype.inOn" + t );
    MneMisc.prototype.eleMkClass(e.wrapper, "modifyno", true, "modify");
  }
  else if ( e.tagName == "SELECT" )
  {
    if ( ( typeof e.onchange != 'function' && typeof e.onclick != 'function') )
      eval ("e.onchange = MneMisc.prototype.inOn" + t );
    if ( typeof e.checkvalue != 'undefined' && e.checkvalue != null && ( e.selectedIndex < 0 || e.options[e.selectedIndex].value != e.checkvalue ) )
      {
      if ( e.options.length < 2 )
        MneMisc.prototype.eleMkClass(e.wrapper, "modifyok", true, "modify");
      else
        MneMisc.prototype.eleMkClass(e.wrapper, "modifywrong", true, "modify");
      }
    else if ( MneMisc.prototype.inCheck(e) )
      MneMisc.prototype.eleMkClass(e.wrapper, "modifyno", true, "modify");
    else
      MneMisc.prototype.eleMkClass(e.wrapper, "modifywrong", true, "modify");
  }
  else if ( e.tagName == "TEXTAREA" )
  {
    if ( (  typeof e.onkeyup != 'function') )
      eval ("e.onkeyup = MneMisc.prototype.inOn" + t );
    MneMisc.prototype.eleMkClass(e.wrapper, "modifyno", true, "modify");
  }
};

MneMisc.prototype.inInit = function()
{
  var i;
  var inputs = this.win.document.getElementsByTagName("input");
  for ( i=0; i<inputs.length; i++ )
    MneMisc.prototype.inClear(inputs[i]);

  var selects = this.win.document.getElementsByTagName("select");
  for ( i=0; i<selects.length; i++ )
    MneMisc.prototype.inClear( selects[i]);

  var textarea = this.win.document.getElementsByTagName("textarea");
  for ( i=0; i<textarea.length; i++ )
    MneMisc.prototype.inClear( textarea[i]);
};

MneMisc.prototype.inChecktype =
{
    notempty       : { reg : /.+/,         help : MneMisc.prototype.txtGetText("#mne_lang#Bitte mindestens ein Zeichen eingeben") },
    alpha          : { reg : /[a-zA-Z_]+/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte nur Buchstaben und den Unterstrich eingeben") },
    alphanum       : { reg : /[a-zA-Z0-9_]+/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte Buchstaben, Zahlen und den Unterstrich eingeben") },
    alpha_alphanum : { reg : /[a-zA-Z][a-zA-Z0-9_]*/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte Buchstaben, Zahlen und den Unterstrich beginnend mit einem Buchstaben eingeben") },

    alphaorempty          : { reg : /[a-zA-Z_]+|^$/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte nur Buchstaben und den Unterstrich eingeben") },
    alphanumorempty       : { reg : /[a-zA-Z0-9_]+|^$/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte Buchstaben, Zahlen und den Unterstrich eingeben") },
    alpha_alphanumorempty : { reg : /[a-zA-Z][a-zA-Z0-9_]*|^$/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte Buchstaben, Zahlen und den Unterstrich beginnend mit einem Buchstaben eingeben") },

    num            : { reg : /[0-9]+/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte eine Zahl eingeben") },
    num1           : { reg : /[1-9]+/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitten eine Zahl ohne 0 eingeben") },
    num1_num       : { reg : /[1-9][0-9]*/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte eine Zahl eingeben die nicht mit einer 0 beginnt") },

    numoempty            : { reg : /[0-9]+|^$/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte eine Zahl eingeben") },
    num1oempty           : { reg : /[1-9]+|^$/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitten eine Zahl ohne 0 eingeben") },
    num1_numoempty       : { reg : /[1-9][0-9]*|^$/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte eine Zahl eingeben die nicht mit einer 0 beginnt") },

    dir            : { reg : /[a-zA-Z0-9_\/]+/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte nur Buchstaben, Zahlen, den Unterstrich und den Schrägstrich eingeben") },

    keyvalue       : { reg : /[0-9A-Fa-f]+|################/, help : MneMisc.prototype.txtGetText("#mne_lang#Schlüsselwert") },
    color          : { reg : /[\dA-Fa-f][\dA-Fa-f][\dA-Fa-f][\dA-Fa-f][\dA-Fa-f][\dA-Fa-f]|/, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte 6 Hexadezimalziffern eingeben") },
    ip4addr        : { reg : /(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])/g, help : MneMisc.prototype.txtGetText("#mne_lang#Bitte eine Ip4 Addresse eingeben")}
};

MneMisc.prototype.inCheck = function(target)
{
  if ( typeof target.checktype != 'undefined' && target.checktype.reg != '' )
  {
    var r = target.value.match(target.checktype.reg);
    if ( ! r || r.length != 1 || r[0] != target.value )
      return false;
  }
  return true;
};

MneMisc.prototype.inOnkeydown = function(e)
{
  var win = ( typeof this.weblet == 'undefined' ) ? window : this.weblet.win;
  var evt = MneDocEvents.prototype.mkEvent(win, e);

  if ( evt.target == this )
  {
    switch(evt.keyCode)
    {
    case 113:
    case 13:
      win.MneDocEvents.prototype.cancelEvent(win,e);        
      if ( typeof this.onreturn == 'function' )
      {
        if ( this.onreturn() == false && this.className.indexOf("modifywrong") < 0  )
          MneMisc.prototype.eleMkClass(this.wrapper, "modify", false, "modify");
      }
      else if ( typeof this.weblet != 'undefined' )
      {
        var func = ( typeof evt.target.func != 'undefined' ) ? evt.target.func : 'ok';
        try
        {
          if ( typeof this.weblet.obj.buttons[func] != 'undefined' )
          {
            var w = this.weblet;
            window.setTimeout( function () { try { if ( w.obj.buttons.ok.onclick.call(w.obj.buttons[func]) == true )  MneMisc.prototype.eleMkClass(this.weblet.obj.buttons.ok, "modifyok", true, "modify"); } catch(e) { this.weblet.exception('Return - ' + w.id + ': ',e);} }, 100);
            
          }
          else if ( typeof this.weblet[func]  == 'function' )
          {
            MneMisc.prototype.eleMkClass( this.wrapper, ( this.weblet[func]() == false ) ? "modifyno" : "modifyok", true, "modify" );
            MneMisc.prototype.eleMkClass( this.wrapper, "modifyno", true, "modify" );
          }
        }
        catch(e)
        {
          this.weblet.errorfound = true;
          this.weblet.exception('Return - ' + this.id + ': ',e);
        }
      }
      return false;
      break;
    case 9:
      win.MneDocEvents.prototype.cancelEvent(win,e);        
      if ( typeof this.weblet != 'undefined'  && this.weblet.obj.fields.length > 0 )
      {
        try 
        {
          var n;
          if ( evt.shiftKey == false )
            for ( n = ( this.mne_fieldnum == this.weblet.obj.fields.length - 1) ? 0 : this.mne_fieldnum + 1; this.weblet.obj.fields[n].disabled == true && n != this.mne_fieldnum; ) { if ( ++n == this.weblet.obj.fields.length ) n = 0; }
          else
            for ( n = ( this.mne_fieldnum == 0 ) ? this.weblet.obj.fields.length - 1 : this.mne_fieldnum - 1; this.weblet.obj.fields[n].disabled == true && n != this.mne_fieldnum; ) { if ( --n < 0 ) n = this.weblet.obj.fields.length -1; }

          this.weblet.inSetCursor.call(this.weblet, this.weblet.obj.fields[n]);
        }
        catch(e)
        {
          this.weblet.exception('Tab - ' + this.id + ': ',e);
        }
      }
      return false;
      break;
    case 38 :
    case 40 :
      if ( typeof this.weblet != 'undefined' && typeof this.weblet.keydown == 'function' )
        return this.weblet.keydown.call(this.weblet, evt, true);
      break;
    }
  }
};

MneMisc.prototype.inOnmodify = function(e)
{
  var win = ( typeof this.weblet == 'undefined' ) ? window : this.weblet.win;
  var evt = MneDocEvents.prototype.mkEvent(win, e);
  var target;
  var modify = "modifyok";

  if ( evt.keyCode == 9 || evt.keyCode == 13 || evt.keyCode == 16 || evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 27 || ( evt.keyCode >= 33 && evt.keyCode <= 40)  || ( evt.keyCode >= 112 && evt.keyCode <= 123 ) ) return;

  if ( evt.noevent == true || evt.target == null || evt.target.tagName != 'INPUT' )
    target = this;
  else
    target = evt.target;

  if ( ! MneMisc.prototype.inCheck(target) )
    modify = 'modifywrong';

  MneMisc.prototype.eleMkClass(target.wrapper, modify, true, "modify");
  if ( typeof target.inputcheckobject != 'undefined' )
    MneMisc.prototype.eleMkClass(target.inputcheckobject.wrapper, modify, true, "modify");

  if ( typeof target.onmodify == 'function')
    target.onmodify(modify);

};
MneMisc.prototype.inOncolor = MneMisc.prototype.inOnmodify;

MneMisc.prototype.inOnrange = function(target, evt)
{
  var val_ok = true;

  if ( evt.keyCode == 9 || evt.keyCode == 13 || evt.keyCode == 16 || evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 27 || ( evt.keyCode >= 33 && evt.keyCode <= 40)  || ( evt.keyCode >= 112 && evt.keyCode <= 123 ) ) return;

  if ( typeof target.minValue != 'undefined' )
    if ( target.minValue > target.value ) 
      val_ok = false;

  if ( typeof target.maxValue != 'undefined' )
    if ( target.maxValue < target.value ) 
      val_ok = false;

  if ( val_ok )
  {

    if ( (target.type == 'checkbox' || target.type == 'radio' ) && ( target.parentNode.tagName == 'DIV' ||  target.parentNode.tagName == 'SPAN' || target.parentNode.tagName == 'TD' ) )
      MneMisc.prototype.eleMkClass(target.wrapper, "modifyok", true, "modify");

    MneMisc.prototype.eleMkClass(target.wrapper, "modifyok", true, "modify");
    if ( typeof target.inputcheckobject != 'undefined' )
      MneMisc.prototype.eleMkClass(target.inputcheckobject.wrapper, "modifyok", true, "modify");

    if ( typeof target.onmodify == 'function')
      target.onmodify("modifyok");
  }
  else
  {
    if ( (target.type == 'checkbox' || target.type == 'radio' ) && ( target.parentNode.tagName == 'DIV' ||  target.parentNode.tagName == 'SPAN' || target.parentNode.tagName == 'TD' ) )
      MneMisc.prototype.eleMkClass(target.wrapper, "modifywrong", true, "modify");

    MneMisc.prototype.eleMkClass(target.wrapper, "modifywrong", true, "modify");
    if ( typeof target.inputcheckobject != 'undefined' )
      MneMisc.prototype.eleMkClass(target.inputcheckobject.wrapper, "modifywrong", true, "modify");
    
    if ( typeof target.onmodify == 'function')
      target.onmodify("modifywrong");
  }
};

MneMisc.prototype.inOninteger = function(e)
{
  var i;
  var win = ( typeof this.weblet == 'undefined' ) ? window : this.weblet.win;
  var evt = MneDocEvents.prototype.mkEvent(win, e);
  var target;

  if ( evt.keyCode == 9 || evt.keyCode == 13 || evt.keyCode == 16 || evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 27 || ( evt.keyCode >= 33 && evt.keyCode <= 40)  || ( evt.keyCode >= 112 && evt.keyCode <= 123 ) ) return;

  if ( evt.noevent == true || evt.target == null || evt.target.tagName != 'INPUT' )
    target = this;
  else
    target = evt.target;

  if ( evt.noevent || ( evt.keyCode > 31 && ( evt.keyCode < 48 || evt.keyCode > 57 )) )
  {
    var str = "";
    var c;
    for ( i =0; i<target.value.length; i++ )
    {
      c = target.value.substr(i,1);
      if ( i == 0 && c == "-" )
        str += c;
      else 
      {
        c = String(parseInt(c));
        if ( c != "NaN" ) str += c;
      }
    }
    target.value = str;
  }
  MneMisc.prototype.inOnrange.call(this, target, evt);
};

MneMisc.prototype.inOnfloat = function(e)
{
  var win = ( typeof this.weblet == 'undefined' ) ? window : this.weblet.win;
  var evt = MneDocEvents.prototype.mkEvent(win, e);
  var i;
  var target;

  if ( evt.keyCode == 9 || evt.keyCode == 13 || evt.keyCode == 16 || evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 27 || ( evt.keyCode >= 33 && evt.keyCode <= 40)  || ( evt.keyCode >= 112 && evt.keyCode <= 123 ) ) return;

  if ( evt.noevent == true || evt.target == null || evt.target.tagName != 'INPUT' )
    target = this;
  else
    target = evt.target;

  if ( evt.noevent || ( evt.keyCode > 31 && ( evt.keyCode < 48 || evt.keyCode > 57 )))
  {
    var str = "";
    var point_found = false;

    for ( i =0; i<target.value.length; i++ )
    {
      var c = target.value.substr(i,1);
      if ( String(parseInt(c)) != "NaN" || c == win.mne_config.locale.decimal_point && point_found++ == false || i == 0 && c == "-" )
        str += c;
    }

    target.value = str;
  }
  MneMisc.prototype.inOnrange.call(this, target, evt);
};

MneMisc.prototype.inCheck_date = function(target, str)
{
  var error;
  var delimiter;
  var regexp;
  var offset;
  var t,m,j;

  switch( window.mne_config.language)
  {
  case 'de':
    delimiter = '.';
    regexp = /[^0123456789\.]/;
    str = str.replace(/-/g, ".");
    offset = 0;
    break;
  case 'en':
    delimiter = '/';
    regexp = /[^0123456789\/]/;
    str = str.replace(/-/g, "/");
    offset = 0;
    if ( win.mne_config.region == 'US' ) offset = 1;
    break;
  case 'fr':
    delimiter = '-';
    regexp = /[^0123456789\-]/;
    offset = 0;
    break;
  }

  
  var sarray = str.split(delimiter);
  error = error | regexp.test(str); 
  if ( sarray.length > 3 )
    error = true;

  var d = new Date();
  d.setUTCHours(0);
  d.setUTCMinutes(0);
  d.setUTCSeconds(0);
  d.setUTCMilliseconds(0);

  m = t = j = 0;
  if ( sarray.length > 2 && sarray[2] != "" )
  {
    t = Number(sarray[0 + offset]);
    m = Number(sarray[1 - offset]);
    j = Number(sarray[2]);
  }
  else if ( sarray.length > 1 && sarray[1] != "" )
  {
    t = Number(sarray[0 + offset]);
    m = Number(sarray[1 - offset]);
    j = d.getFullYear();
  }
  else if ( sarray.length > 0 )
  {
    if ( offset == 1 )
    {
      m = Number(sarray[0]);
      t = d.getDate();
    }
    else
    {
      t = Number(sarray[0]);
      m = d.getMonth() + 1;
    }
    j = d.getFullYear();
  }

  if ( j < 100 && j < 30 )
    j = j + 2000;
  else if ( j < 100 )
    j = j + 1900;

  if ( t < 1 || m < 1 || m > 12 )
    error = true;
  if ( ( m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12 ) &&  t > 31  )
    error = true;
  else if ( ( m == 2 ) && ( j / 4 != Math.ceil( j/4 ) || j == 0 || j == 2000 ) && ( t > 28 ) )
    error = true;
  else if ( ( m == 2 ) && ( j / 4 == Math.ceil( j/4 ) ) && ( t > 29 ) )
    error = true;
  else if ( ( m == 4 || m == 6 ||  m == 9 || m == 11 ) && t > 30 )
    error = true;

  if ( error != true )
  {
    d = new Date(j,m-1,t,0,0,0,0,0);
    error = isNaN(d.getTime());
  }

  if ( ! error ) target.mne_timevalue = d.getTime() / 1000;
  else target.mne_timevalue = "";
  
  return error;
  
};

MneMisc.prototype.inCheck_time = function(target, str, clocktime)
{
  var error;
  var delimiter;
  var regexp;
  var str,offset;

  delimiter = ':';
  regexp = /[^0123456789\:]/;

  var str = str.replace(/-/g, ":");
  var sarray = str.split(delimiter);

  var h,m,s;
  var error;

  error = regexp.test(str); 
  if ( sarray.length > 3 )
    error = true;

  h = m = s = 0;

  if ( sarray[0] == '' ) sarray[0] = 0;
  if ( sarray[1] == '' ) sarray[1] = 0;
  if ( sarray[2] == '' ) sarray[2] = 0;

  if ( sarray.length > 2  )
  {
    h = parseInt(sarray[0],10);
    m = parseInt(sarray[1],10);
    s = parseInt(sarray[2],10);
  }
  else if ( sarray.length > 1 )
  {
    h = parseInt(sarray[0],10);
    m = parseInt(sarray[1],10);
  }
  else if ( sarray.length > 0 )
  {
    h = parseInt(sarray[0],10);
  }

  if ( s < 0 || s > 60 || m < 0 || m > 60 )
    error = true;
  
  if ( clocktime == true && ( h < 0 || h > 23) )
    error = true;
  
  if ( ! error ) target.mne_timevalue = h * 3600 + m * 60 + s;
  else target.mne_timevalue = "";
  
  return error;
};

MneMisc.prototype.inOndatetime = function(e)
{
  var v,val;
  var time;
  var target;
  var win = ( typeof this.weblet == 'undefined' ) ? window : this.weblet.win;
  var evt = MneDocEvents.prototype.mkEvent(win, e);
  var error = false;
  
  if ( evt.keyCode == 9 || evt.keyCode == 13 || evt.keyCode == 16 || evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 27 || ( evt.keyCode >= 33 && evt.keyCode <= 40)  || ( evt.keyCode >= 112 && evt.keyCode <= 123 ) ) return;

  if ( evt.noevent == true || evt.target == null || evt.target.tagName != 'INPUT')
      target = this
    else
      target = evt.target;
  
  val = target.value.split(" ");
  if ( val.length > 0 )
  {
    error = MneMisc.prototype.inCheck_date(target, val[0]);
    time = target.mne_timevalue;
  }
  
  if ( !error && val.length > 1)
  {
    error = MneMisc.prototype.inCheck_time(target, val[val.length - 1], true);
    if ( ! error )
      target.mne_timevalue += time;
  }

  if ( error != true )
  {
    MneMisc.prototype.eleMkClass(target.wrapper, "modifyok", true, "modify");
    if ( typeof target.inputcheckobject != 'undefined' )
      MneMisc.prototype.eleMkClass(target.inputcheckobject.wrapper, "modifyok", true, "modify");

    if ( typeof target.onmodify == 'function')
      target.onmodify("modifyok");

  }
  else
  {
    target.mne_timevalue = "";
    
    MneMisc.prototype.eleMkClass(target.wrapper, "modifywrong", true, "modify");
    if ( typeof target.inputcheckobject != 'undefined' )
      MneMisc.prototype.eleMkClass(target.inputcheckobject.wrapper, "modifywrong", true, "modify");

    if ( typeof target.onmodify == 'function')
      target.onmodify("modifywrong");
  }
 
}

MneMisc.prototype.inOndate = function(e)
{
  var win = ( typeof this.weblet == 'undefined' ) ? window : this.weblet.win;
  var evt = MneDocEvents.prototype.mkEvent(win, e);
  var target;
  var error;

  if ( evt.keyCode == 9 || evt.keyCode == 13 || evt.keyCode == 16 || evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 27 || ( evt.keyCode >= 33 && evt.keyCode <= 40)  || ( evt.keyCode >= 112 && evt.keyCode <= 123 ) ) return;

  if ( evt.noevent == true || evt.target == null || evt.target.tagName != 'INPUT')
    target = this;
  else
    target = evt.target;

  error = false;
  if ( ! MneMisc.prototype.inCheck(target) )
    error = true;

  var lang = win.mne_config.language;
  if ( typeof lang == 'undefined' ) lang = 'de';

  
  if ( target.value == "" )
  {
    target.mne_timevalue = "";

    MneMisc.prototype.eleMkClass(target.wrapper, "modifyok", true, "modify");
    if ( typeof target.inputcheckobject != 'undefined' )
      MneMisc.prototype.eleMkClass(target.inputcheckobject.wrapper, "modifyok", true, "modify");

    if ( typeof target.onmodify == 'function')
      target.onmodify("modifyok");
    
    return;
  }

  error = MneMisc.prototype.inCheck_date(target, target.value);
  if ( error != true )
  {

    MneMisc.prototype.eleMkClass(target.wrapper, "modifyok", true, "modify");
    if ( typeof target.inputcheckobject != 'undefined' )
      MneMisc.prototype.eleMkClass(target.inputcheckobject.wrapper, "modifyok", true, "modify");

    if ( typeof target.onmodify == 'function')
      target.onmodify("modifyok");

  }
  else
  {
    target.mne_timevalue = "";
    
    MneMisc.prototype.eleMkClass(target.wrapper, "modifywrong", true, "modify");
    if ( typeof target.inputcheckobject != 'undefined' )
      MneMisc.prototype.eleMkClass(target.inputcheckobject.wrapper, "modifywrong", true, "modify");

    if ( typeof target.onmodify == 'function')
      target.onmodify("modifywrong");
  }
};


MneMisc.prototype.inOnclocktime = function(e)
{
  return MneMisc.prototype.inOntime.call(this, e, true);
};

MneMisc.prototype.inOntime = function(e, clocktime)
{
  var win = ( typeof this.weblet == 'undefined' ) ? window : this.weblet.win;
  var evt = MneDocEvents.prototype.mkEvent(win, e);
  var target;
  var error;

  if ( evt.keyCode == 9 || evt.keyCode == 13 || evt.keyCode == 16 || evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 27 || ( evt.keyCode >= 33 && evt.keyCode <= 40)  || ( evt.keyCode >= 112 && evt.keyCode <= 123 ) ) return;
  
  if ( evt.noevent == true || evt.target == null || evt.target.tagName != 'INPUT' )
    target = this;
  else
    target = evt.target;

  error = MneMisc.prototype.inCheck_time(target, target.value, clocktime);
  if ( error != true )
  {
    
    MneMisc.prototype.eleMkClass(target.wrapper, "modifyok", true, "modify");
    if ( typeof target.inputcheckobject != 'undefined' )
      MneMisc.prototype.eleMkClass(target.wrapper.inputcheckobject, "modifyok", true, "modify");

    if ( typeof target.onmodify == 'function')
      target.onmodify("modifyok");
  }
  else
  {
    
    MneMisc.prototype.eleMkClass(target.wrapper, "modifywrong", true, "modify");
    if ( typeof target.inputcheckobject != 'undefined' )
      MneMisc.prototype.eleMkClass(target.wrapper.inputcheckobject, "modifywrong", true, "modify");

    if ( typeof target.onmodify == 'function')
      target.onmodify("modifywrong");
  }
};
