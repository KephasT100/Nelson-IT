// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/offer/product/detail
// ================================================================================
{
  var i;
  var str = "";
  
  weblet.loadClass("MneEditor", "editor/mne_editor.js");
  weblet.loadCss('all.css', '/styles/editor');

  var ivalues = 
  {
    hinput      : false,
    
    schema      : 'mne_crm',
    query       : 'offerproduct',
    table       : 'offerproduct',

    typeselect  : 'offerproducttype',
        
    addschema       : 'mne_crm',
    addfunction     : 'offerproduct_add',

    delschema       : 'mne_crm',
    delfunction     : 'offerproduct_del',

    okschema       : 'mne_crm',
    okfunction     : 'offerproduct_ok',

    costsetschema   : 'mne_crm',
    costsetfunction : 'offerproduct_cost_set',

    ewidth      : '505px', /* etwa A4 */
    eheight     : '400px',

    view2 : false
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  if ( weblet.initpar.view2 )
    MneAjax.prototype.load.call(weblet, weblet.path + "/view2.html");
  else
    MneAjax.prototype.load.call(weblet, weblet.path + "/view1.html");
  weblet.frame.innerHTML = weblet.req.responseText;

  var attr = 
  {
      hinput :                false,
      offerproducttypeInput : { selectlist : weblet.initpar.typeselect },
      offeridInput          : { notclear : true },
      editor                : {
                                buttonframe    : weblet.eleGetById(weblet.frame, "editorbuttons"),
                                "style.width"  : weblet.initpar.ewidth,
                                "style.height" : weblet.initpar.eheight
                              },
                              
      detailButton : { checked : weblet.initpar.view2 }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("offerproductid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Produkt hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Produkt bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Produkt <$1> löschen?");
  weblet.titleString.delid = 'productname';
  
  weblet.obj.position = 1000;
  
  weblet.obj.editor = null;
  if ( weblet.initpar.view2 )
  {
    weblet.obj.editor_win = new MneEditor(weblet.win, weblet.eleGetById(weblet.frame, "editor"));

    weblet.obj.editor_win.parameter.mne_ajax = true;
    weblet.obj.editor_win.parameter.nohtml   = true;

    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Xml",        line: 1, output : weblet.obj.inputs.productdescription };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Save",       line: 1, pos : 0 };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Clipboard",  line: 1, pos : 0 };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Itemize",    line: 1 };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Table",      line: 1 };
    weblet.obj.editor_win.show(function(editor){weblet.editor_loadready(editor); });
  }
  
  
  weblet.editor_loadready = function(editor)
  {
    this.obj.editor = editor;
    if ( typeof this.obj.pendingtext == 'string')
    {
      if ( this.obj.pendingtext == '' ) this.obj.editor.setContent('');
      else
      {
        MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : this.obj.pendingtext, size : weblet.initpar.ewidth } )
        this.obj.editor.setContent(this.req.responseText);
      }
      this.obj.pendingtext = false;
    }
  }

  weblet.reset = function()
  {
    if ( this.obj.editor != null )
      this.obj.editor.destructor();
    this.obj.editor = null;
    
    MneAjaxWeblet.prototype.reset.call(this);
  }

  weblet.onhidden = function()
  {

   if ( this.obj.holdadd != true )
    {
      this.obj.holdadd = false;
      this.parent.popups[this.oid + 'addselect'].hidden();
    }
   MneAjaxWeblet.prototype.onhidden.call(this);  
 }
  
  weblet.setContent = function(text)
  {
    if ( this.obj.editor != null )
    {
      MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : text, size : weblet.initpar.ewidth } )
      this.obj.editor.setContent(this.req.responseText);
    }
    else
      this.obj.pendingtext = text;
  }

  weblet.showValue = function(weblet)
  {
    if ( weblet == null || weblet.act_values.offerproductid == 'sum' || weblet.act_values.offerid == '################' ) return false;
         
    if ( typeof weblet.act_values.offerproductid == 'undefined')
    {
      if ( typeof weblet.act_values.offerid != 'undefined' ) 
    	  this.act_values.offerid = this.obj.inputs.offerid.value = weblet.act_values.offerid;
      this.act_values.offerproducttype = this.obj.inputs.offerproducttype.value = weblet.act_values.offerproducttype;
      this.add();
      return true;
    }

    MneAjaxWeblet.prototype.showValue.call(this,weblet);
    this.setContent(this.obj.inputs.productdescription.value);

  }
  
  weblet.ok = function(setdepend)
  {
    if ( weblet.initpar.view2 )
      this.obj.editor.save();

    var p =
    {
        schema : this.initpar.okschema,
        name   : this.initpar.okfunction,
        sqlend : 1   
    };

    p = this.addParam(p, "par0", this.obj.inputs.offerproductid );
    p = this.addParam(p, "par1", this.obj.inputs.offerproducttype );
    p = this.addParam(p, "par2", this.obj.inputs.withworkingstep );
    p = this.addParam(p, "par3", this.obj.inputs.position );
    p = this.addParam(p, "par4", this.obj.inputs.productid );
    p = this.addParam(p, "par5", this.obj.inputs.productoptid );
    p = this.addParam(p, "par6", this.obj.inputs.productcurrencyid );
    p = this.addParam(p, "par7", this.obj.inputs.productcurrencyrate );
    p = this.addParam(p, "par8", this.obj.inputs.productdescription );
    p = this.addParam(p, "par9", this.obj.inputs.productname);
    p = this.addParam(p, "par10", this.obj.inputs.productnumber );
    p = this.addParam(p, "par11", this.obj.inputs.count );
    p = this.addParam(p, "par12", this.obj.inputs.productprice );
    p = this.addParam(p, "par13", this.obj.inputs.productcost );
    p = this.addParam(p, "par14", this.obj.inputs.productcostrecalc );
    p = this.addParam(p, "par15", this.obj.inputs.productunit );
    p = this.addParam(p, "par16", this.obj.inputs.productvat );
    
    p = this.addParam(p, "typ2", "bool" );
    p = this.addParam(p, "typ3", "long" );
    p = this.addParam(p, "typ7", "double" );
    p = this.addParam(p, "typ11", "double" );
    p = this.addParam(p, "typ12", "double" );
    p = this.addParam(p, "typ13", "double" );
    p = this.addParam(p, "typ14", "bool" );
    p = this.addParam(p, "typ16", "double" );

    return MneAjaxWeblet.prototype.func.call(this, p, "offerproductid", setdepend);

  }
  
  weblet.del = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        par0 : this.act_values.offerproductid,
        typ0 : "text",
        sqlend : 1   
    }

    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
      return false;

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      MneAjaxWeblet.prototype.add.call(this);
      return false;
    }
    
    return true;
  }
  
  weblet.checkmodified = function()
  {
    return false;
  }

  weblet.add = function(setdepend)
  {
    if ( typeof setdepend == 'string') return;
    this.parent.popups[this.oid + 'addselect'].show(false,false);
    this.parent.popups[this.oid + 'addselect'].weblet.onbtnobj = this;
    this.setContent('');
    {
      var popup = this.parent.popups[this.oid + 'addselect'];
      var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.resize == true, popup.weblet.initpar.repos == true ); }
      window.setTimeout(timeout, 100);
    }
    if ( this.popup != 'undefined' && this.popup != null ) 
    {
      this.obj.holdadd = true;
      this.popup.hidden();
    }
    
    return false;
  }
  
  weblet.calculate = function()
  {
    var param =
    {
        "schema" : "mne_crm",
        "query"  : "offercost",
        "cols"   : "offerproductcost",
        "offerproductidInput.old" : this.act_values.offerproductid,
        "sqlend" : 1
    };
    
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param)
    if ( this.values.length > 0 )
      this.showInput(this.obj.inputs.productcost, this.values[0][0], null, true);
  }
  
  weblet.onbtnok = function(button)
  {
    if ( button.weblet == this.parent.subweblets[this.oid + 'addselect'])
    {
      var p =
      {
          schema : this.initpar.schema,
          name : this.initpar.addfunction,
          par0 : this.act_values.offerid,
          typ0 : "text",
          par1 : this.act_values.offerproducttype,
          typ1 : "text",
          par2 : button.weblet.act_values.productid,
          typ2 : "text",
          sqlend : 1   
      }
      if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
      {
        this.act_values.offerproductid = this.act_values.result;
        this.showValue(this);
        this.setDepends("showValue");
        this.parent.popups[this.oid + 'addselect'].weblet.onbtnobj = this;
        try
        {
          if ( typeof this.onbtnobj == 'object' )
          {
              if ( typeof this.onbtnobj["onbtnok"] == 'function' ) 
              this.onbtnobj["onbtnok"](this); 
            else if ( typeof this.onbtnobj.onbtnclick == 'function' )
              this.onbtnobj.onbtnclick('ok',this); 
          }
        } 
        catch(e)
        { 
          this.exception(this.onbtnobj.id + '.onbtnclick: ',e);
        }
        return false;
      }
      this.parent.popups[this.oid + 'addselect'].weblet.onbtnobj = this;
      return true;
    }
    else
      MneAjaxWeblet.prototype.onbtnok.call(this,button);
  }
  
}
