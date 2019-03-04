// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/etc/color
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    styleName : 'style.css',
    schema    : '',
    query     : '',
    cols      : 'color',
    distinct  : '1',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");
  weblet.loadClass("MneAjaxSlider", "geometrie/mne_aslider.js");

  weblet.loadview();
  weblet.eleMkClass(weblet.frame, 'colorselect');

  var colorvalue = function (e)
  {
    var evt = MneMisc.prototype.events.mkEvent(this.weblet.win, e);
    if ( evt.keyCode == 13 || evt.keyCode == 113 )
    {
      this.weblet.obj.sliders[this.slider].setPosition(parseInt(this.value));
      this.weblet.eleMkClass(this, 'modify', false);
      return false;
    }
  };

  var attr = 
  {
      hinput : false,
      colorInput  : { checktype : MneMisc.prototype.inChecktype.color, onmodify : function(modify) { this.weblet.colormodify.call(this.weblet, modify); } },
      colorOutput : { inputtyp : 'color' },
      redInput  : { inputtyp : 'integer', checktype : MneMisc.prototype.inChecktype.num, minValue : 0, maxValue : 255,  onkeydown : colorvalue, slider : 'red' },
      greenInput  : { inputtyp : 'integer', checktype : MneMisc.prototype.inChecktype.num, minValue : 0, maxValue : 255,  onkeydown : colorvalue, slider : 'green' },
      blueInput  : { inputtyp : 'integer', checktype : MneMisc.prototype.inChecktype.num, minValue : 0, maxValue : 255,  onkeydown : colorvalue, slider : 'blue' },
  };

  weblet.findIO(attr);
  weblet.obj.title = null;
  //weblet.showLabel();

  weblet.delbuttons('del,add')
  weblet.showids = new Array();
       
  weblet.obj.colorval = new Array("00", "55", "AA", "FF");

  weblet.obj.tables.content.selectRows = false;
  weblet.obj.tables.content.ignoreUnselect = true;
  
  weblet.obj.tables.content.clickCb['body'] = function(tab)
  {
    if ( typeof tab.act_cell.colorval == 'undefined' )
      return;

    tab.weblet.obj.inputs.color.value = tab.act_cell.colorval;
    tab.weblet.colormodify('');
  };

  weblet.obj.tables.content.dblclickCb['body'] = function(tab)
  {
    if ( tab.weblet.find_color(tab.act_cell.colorval) )
      return;
    
    tab.weblet.obj.inputs.color.value = tab.act_cell.colorval;
    tab.weblet.obj.outputs.color.style.backgroundColor = "#" + tab.act_cell.colorval;
    tab.weblet.act_values.color = tab.act_cell.colorval;
    try
    {
      if (typeof tab.weblet.onbtnobj == 'object')
        if (typeof tab.weblet.onbtnobj.onbtnok == 'function')
          tab.weblet.onbtnobj.onbtnok({ weblet : tab.weblet });
        else if ( typeof tab.weblet.onbtnobj.onbtnclick == 'function')
          tab.weblet.onbtnobj.onbtnclick('ok',{ weblet : tab.weblet });
    }
    catch (e)
    {
      tab.weblet.exception(tab.weblet.onbtnobj.id + '.onbtnclick: ', e);
    }
    tab.weblet.onbtnobj = {};
  };
  
  weblet.colormodify = function(modify)
  {
    if ( modify.indexOf('wrong')  == -1 )
    {
      if ( this.find_color(this.obj.inputs.color.value) )
        this.disable();
      else
        this.enable();

      try
      {
        this.obj.outputs.color.style.backgroundColor = '#' + this.obj.inputs.color.value;
        this.obj.outputs.color.style.color = '#' + this.obj.inputs.color.value;
        this.obj.outputs.color.innerHTML = '';
        this.act_values.color = this.obj.color = this.obj.inputs.color.value;
        var rgb = /^#?([A-Fa-f\d]{2})([A-Fa-f\d]{2})([A-Fa-f\d]{2})$/.exec('#' + this.act_values.color);
          
        this.obj.sliders.red.setPosition(parseInt(rgb[1], 16));
        this.obj.sliders.green.setPosition(parseInt(rgb[2], 16));
        this.obj.sliders.blue.setPosition(parseInt(rgb[3], 16));

        this.obj.inputs.red.value = this.obj.sliders.red.value;
        this.obj.inputs.green.value = this.obj.sliders.green.value;
        this.obj.inputs.blue.value = this.obj.sliders.blue.value;

      }
      catch(e)
      {
      }
    }
    else
      {
      this.obj.outputs.color.style.backgroundColor = "transparent";
      this.obj.outputs.color.style.color = "red";
      this.obj.outputs.color.innerHTML= '#mne_lang#keine Farbe';
      }
      return false;
  };

  weblet.valtohex = function(val)
  {
    var hex = val.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
  
  weblet.slidervalue = function (id, value)
  {
    
  };
  
  weblet.slidermove = function (id, value)
  {
    this.obj.inputs.color.value =  this.valtohex(this.obj.sliders.red.value) +  this.valtohex(this.obj.sliders.green.value) +  this.valtohex(this.obj.sliders.blue.value);

    if ( this.find_color(this.obj.inputs.color.value) )
      this.disable();
    else
      this.enable();

    this.obj.outputs.color.style.backgroundColor = '#' + this.obj.inputs.color.value;
    this.obj.outputs.color.style.color = '#' + this.obj.inputs.color.value;
    this.obj.outputs.color.innerHTML = '';
    this.act_values.color = this.obj.color = this.obj.inputs.color.value;

    this.obj.inputs.red.value = this.obj.sliders.red.value;
    this.obj.inputs.green.value = this.obj.sliders.green.value;
    this.obj.inputs.blue.value = this.obj.sliders.blue.value;
  };
  
  weblet.find_color = function(color)
  {
    var i;
    var c = color.toLowerCase();
    for ( i =0; i< this.values.length; i++)
      if ( this.values[i][0] == c ) return true;
    
    return false;
  };
  
  weblet.showValue = function(weblet)
  {
    var i,j;
    var b,r,g;
    var color;
    
    this.readData(weblet);
    for ( i =0; i< this.values.length; i++)
      this.values[i][0] = this.values[i][0].toLowerCase();

    if ( weblet != null && typeof weblet.act_values.color != 'undefined' )
    {
      this.obj.inputs.color.value = weblet.act_values.color;
      this.obj.outputs.color.style.backgroundColor = "#" + weblet.act_values.color;
      this.act_values.color = this.obj.color = weblet.act_values.color;
      var rgb = /^#?([A-Fa-f\d]{2})([A-Fa-f\d]{2})([A-Fa-f\d]{2})$/.exec('#' + weblet.act_values.color);
      if ( rgb )
      {
        this.obj.sliders.red.setPosition(parseInt(rgb[1], 16));
        this.obj.sliders.green.setPosition(parseInt(rgb[2], 16));
        this.obj.sliders.blue.setPosition(parseInt(rgb[3], 16));

        this.obj.inputs.red.value = this.obj.sliders.red.value;
        this.obj.inputs.green.value = this.obj.sliders.green.value;
        this.obj.inputs.blue.value = this.obj.sliders.blue.value;
      }
      else
      {
        this.obj.sliders.red.setPosition(0);
        this.obj.sliders.green.setPosition(0);
        this.obj.sliders.blue.setPosition(0);
        this.obj.inputs.red.value = 0;
        this.obj.inputs.green.value = 0;
        this.obj.inputs.blue.value = 0;
      }
   }
      
    this.obj.tables.content.clear();
    b = r = g = 0;
    for ( i =0; i<8; i++)
    {
      this.obj.tables.content.add('','','','','','','','');
      for ( j = 0; j < 8; j++)
      {
        this.obj.tables.content.body.rows[i].cells[j].innerHTML = '<div style="position: relative; width: 10px; height:10px"></div>';
      }
    }
    
    r = 0;
    for ( g = 0; g < 4; g++)
    {
      for ( b = 0; b < 4; b++)
      {
        color = this.obj.colorval[g] + this.obj.colorval[r] + this.obj.colorval[b];
        this.obj.tables.content.body.rows[b].cells[g].style.backgroundColor = "#" + color;
        this.obj.tables.content.body.rows[b].cells[g].colorval = color;
      }
    }
    r = 1;
    for ( g = 0; g < 4; g++)
    {
      for ( b = 0; b < 4; b++)
      {
        color = this.obj.colorval[g] + this.obj.colorval[r] + this.obj.colorval[b];
        this.obj.tables.content.body.rows[b].cells[4 + g].style.backgroundColor = "#" + color;
        this.obj.tables.content.body.rows[b].cells[4 + g].colorval = color;
      }
    }
    r = 2;
    for ( g = 0; g < 4; g++)
    {
      for ( b = 0; b < 4; b++)
      {
        color = this.obj.colorval[g] + this.obj.colorval[r] + this.obj.colorval[b];
        this.obj.tables.content.body.rows[4 + b].cells[g].style.backgroundColor = "#" + color;
        this.obj.tables.content.body.rows[4 + b].cells[g].colorval = color;
     }
    }
    r = 3;
    for ( g = 0; g < 4; g++)
    {
      for ( b = 0; b < 4; b++)
      {
        color = this.obj.colorval[g] + this.obj.colorval[r] + this.obj.colorval[b];
        this.obj.tables.content.body.rows[4 + b].cells[4 + g].style.backgroundColor = "#" + color;
        this.obj.tables.content.body.rows[4 + b].cells[4 + g].colorval = color;
      }
    }
    
    MneMisc.prototype.inClear(this.obj.inputs.color);
    MneMisc.prototype.inClear(this.obj.inputs.red);
    MneMisc.prototype.inClear(this.obj.inputs.green);
    MneMisc.prototype.inClear(this.obj.inputs.blue);

  };
  
  weblet.ok = function()
  {
    return false;
  };
  
  weblet.cancel = function()
  {
    this.act_values.color = this.obj.color;
    return MneAjaxWeblet.prototype.cancel.call(this);
  };
}
