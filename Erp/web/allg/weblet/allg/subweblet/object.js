// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/subweblet
// ================================================================================
{
  var k,i;
  

  weblet.showValue = function(weblet, pparam)
  {
    var i = null;
    var param = pparam;

    if ( weblet == null ) return;
    if ( weblet == this ) return;
    if ( typeof param == 'undefined' ) param = {};
    
    if ( typeof this.popup != 'undefined' )
      this.popup.setClass('subweblet');
    
    this.act_values = weblet.act_values;
    for ( i in this.subweblets )
    {
      if ( ( typeof this.subweblets[i].popup == 'undefined' || this.subweblets[i].popup == this.popup ) && ( this.eleIsEmpty(this.subweblets[i].receives) || this.subweblets[i].initpar.showvalueallways == true ) )
      {
        param.showvalueallways = this.subweblets[i].initpar.showvalueallways;
        this.subweblets[i].showValue(weblet, param);
      }
    }

    if ( typeof this.initpar.mainweblet != 'undefined' && typeof this.subweblets[this.initpar.mainweblet] != 'undefined')
    {
      this.subweblets[this.initpar.mainweblet].popup = this.popup;
      //this.subweblets[this.initpar.mainweblet].onbtnobj = this;
      
      if ( typeof this.popup != 'undefined' && this.popup != null && this.initpar.singleweblet == true )
        this.subweblets[this.initpar.mainweblet].scrollframe.style.overflow = 'visible';
        
    }
  };
  
  weblet.setDepends = function(id)
  {
    if ( typeof this.initpar.mainweblet != 'undefined' && typeof this.subweblets[this.initpar.mainweblet] != 'undefined')
    {
      this.subweblets[this.initpar.mainweblet].setDepends(id);
    }
    else
    {
      for ( i in this.subweblets )
      {
        if ( ( typeof this.subweblets[i].popup == 'undefined' || this.subweblets[i].popup == this.popup ) && ( this.eleIsEmpty(this.subweblets[i].receives) || this.subweblets[i].initpar.showvalueallways == true ) )
        {
          param = { showvalueallways : this.subweblets[i].initpar.showvalueallways };
          this.subweblets[i].showValue(this, param);
        }
      }
    }

  };

  weblet.mkTemplate = function()
  {
    var i = null;
    var sliderpos = {};

    if ( typeof this.initpar.sliderpos == 'string' )
      eval("this.initpar.sliderpos = {" + this.initpar.sliderpos + "}");

    if ( this.values.length != 0 && typeof this.initpar.templ  != 'undefined')
      this.values[0][0] = this.initpar.templ;
    
    MneAjaxWeblet.prototype.mkTemplate.call(this);
    for ( i in this.initpar.templmap )
    {
      if ( typeof this.root.container[i] != 'undefined' ) 
      {
        this.root.container[this.initpar.templmap[i]] = this.root.container[i];
        if ( this.initpar.templmap[i] != i )
           delete this.root.container[i];
      }

      if ( typeof this.root.menus[i] != 'undefined' ) 
      {
        this.root.menus[this.initpar.templmap[i]] = this.root.menus[i];
        if ( this.initpar.templmap[i]  != i )
          delete this.root.menus[i];
      }

    }
    
    if ( typeof this.initpar.sliderpos != 'undefined' )
    {
      sliderpos = this.initpar.sliderpos;
      for ( i in this.slider )
        if ( typeof sliderpos[i] != 'undefined' )
          this.slider[i].setPosition(sliderpos[i]);
    }
    if ( typeof this.initpar.sliderline != 'undefined' )
    {
      eval("sliderline = {" + this.initpar.sliderline + "}");
      for ( i in this.slider )
        if ( typeof sliderline[i] != 'undefined' )
          this.slider[i].setLine(sliderline[i]);
    }
  };
  
  weblet.getWeblets = function()
  {

    var i = null;
    var wcount;
    var mainweblet;
    
    var ivalues = 
    {
        //width  : 60,
        //height : 60
    };

    this.initDefaults(ivalues);

    var param =
    {
        "schema" : "mne_application",
        "query"  : "weblet_tabs",
        "cols"   : "htmlcomposetabid,id,position,path,initpar,depend,label",
        "wcol"   : "htmlcomposeid,groupexists",
        "wop"   : "=,=",
        "scols"  : "loadpos",
        "wval"   : this.htmlcomposeid + ',1',
        "sqlend"   : 1
    };

    if ( typeof this.initpar.templ != 'undefined' && typeof this.initpar.templmap != 'undefined' )
    {  
      var str = "(";

      for ( i in this.initpar.templmap )
      {
        str += "'" + this.initpar.templmap[i] + "'\\,";
      }
      str += "'popup')";
      
      param.wcol += ',position';
      param.wop  += ',in';
      param.wval += ',' + str;
    }
    
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param );

    wcount = 0;
    for ( i=0; i<this.values.length; i++ )
    {
      if ( this.values[i][2] != 'popup' && this.values[i][2] != 'insert' )
      {
        wcount++;
        mainweblet = this.values[i][1];
      }

      if ( typeof this.initpar.initparsub != 'undefined' && typeof this.initpar.initparsub[this.values[i][1]] != 'undefined')
      {
        if ( this.values[i][4] != '' ) this.values[i][4] = this.values[i][4] + ( ',' + this.initpar.initparsub[this.values[i][1]] ) ; else this.values[i][4] = this.initpar.initparsub[this.values[i][1]];
      }      
    }

    if ( wcount == 1 )
    {
      this.popup.setClass('subwebletsingle', 'subweblet');

      this.initpar.singleweblet = true;
      if ( typeof this.initpar.mainweblet == 'undefined' || this.initpar.mainweblet == null )
      {
        this.initpar.mainweblet = mainweblet;
        this.initpar.singleweblet = true;
      }
    }

    if ( typeof weblet.initpar.mainweblet != 'undefined' && typeof weblet.subweblets[weblet.initpar.mainweblet] != 'undefined')
    {
      weblet.del = function(setdepend)
      {
        this.subweblets[this.initpar.mainweblet].del(setdepend);
      };
    }
    else
    {
      weblet.del = null;
    }

  };

  weblet.onhidden = function()
  {
    var i = null;
    for ( i in this.subweblets )
      if ( typeof this.subweblets[i].onhidden == 'function' ) this.subweblets[i].onhidden();

    if ( typeof this.onbtnobj != 'undefined' && typeof this.initpar.mainweblet != 'undefined')
      this.onbtnobj.onbtnclick('hidden', { weblet : this.subweblets[this.initpar.mainweblet] } );
 
  };
    
  weblet.onbtnclick = function(id, button)
  {
    if ( typeof this.onbtnobj != 'undefined' )
    {
      this.onbtnobj.onbtnclick(id, button);
    }
  };

  weblet.wresize = function()
  {
    if ( typeof this.slider.fslider != 'undefined' && this.slider.fslider != null )
    {
      var self = this;
      self.slider.fslider.setPosition();
      window.setTimeout( function() { self.slider.fslider.updatePosition(); }, 1000);
    }
  };
  
  weblet.show(weblet.initpar.name);
  weblet.obj.inputs  = {};
  weblet.obj.outputs = {};
  weblet.obj.labels  = {};
  weblet.obj.buttons = {};
  weblet.obj.tables  = {};
  weblet.obj.fields  = new Array();
  weblet.obj.mkbuttons = [];

  for ( var k=0; k < weblet.sends.length; k++ )
  {
    var d = weblet.sends[k].split('.');
    weblet.subweblets['parent' + d[0]] = weblet.parent.subweblets[d[0]];
    weblet.subweblets[d[1]].sends[weblet.subweblets[d[1]].sends.length] = 'parent' + d[0];
  }
}
