// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/order/product/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      schema  : 'mne_crm',
      query   : 'orderproduct',
      table   : "orderproduct",
      
      ewidth  : '505', /* ist etwa a4 */
      eheight : '400',

      okschema   : 'mne_crm',
      okfunction : 'orderproduct_ok',

      addschema   : 'mne_crm',
      addfunction : 'orderproduct_add',
      
      delschema   : 'mne_crm',
      delfunction : 'orderproduct_del',
      
      report : 'mne_orderproduct',
      
      view2 : false
      
  };

  var svalues = 
  {
  }

  weblet.loadClass("MneEditor", "editor/mne_editor.js");
  weblet.loadCss('all.css', '/styles/editor');
  
  weblet.initDefaults(ivalues);
  weblet.loadview(null, this.path + ( ( weblet.initpar.view2 ) ? '/view2.html' : '/view1.html') );
  weblet.eleMkClass(weblet.origframe, "haveeditor" );

  var attr = 
  {
      hinput :                false,
      orderproducttypeInput : { selectlist : weblet.initpar.typeselect, disabled : true, notclear : true },
      fromofferInput        : { disabled : true },
      orderidInput          : { notclear : true },

      editor                : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" },

      detailButton : { checked : weblet.initpar.view2 }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("orderproductid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Produkt hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Produkt bearbeiten");
  weblet.obj.position = 1000;
  
  weblet.obj.editor = null;
  if ( weblet.initpar.view2 )
  {
    weblet.obj.editor_win = new MneEditor(weblet.win, weblet.frame.querySelector("#editor"), weblet.frame.querySelector("#editorbuttons"));
  
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
        this.obj.editor.save();
        this.act_values.productdescription = this.obj.inputs.productdescription.value
      }
      this.obj.pendingtext = false;
    }
  }

  weblet.onhidden = function()
  {
    this.parent.popups[this.oid + 'addselect'].hidden();
    MneAjaxWeblet.prototype.onhidden.call(this);
  }

  weblet.reset = function()
  {
    if ( this.obj.editor != null )
      this.obj.editor.destructor();
    this.obj.editor = null;
    
    MneAjaxWeblet.prototype.reset.call(this);
  }
  
  weblet.setContent = function(text)
  {
    if ( this.obj.editor != null )
    {
      MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : text, size : weblet.initpar.ewidth } )
      this.obj.editor.setContent(this.req.responseText);
      this.obj.editor.save();
      this.act_values.productdescription = this.obj.inputs.productdescription.value
    }
    else
      this.obj.pendingtext = text;
  }

  weblet.showValue = function(weblet)
  {
    if ( weblet == null || weblet.act_values.orderproductid == 'sum' || weblet.act_values.orderid == '################' ) return false;
         
    if ( typeof weblet.act_values.orderproductid == 'undefined')
    {
      if ( typeof weblet.act_values.orderid != 'undefined' ) 
        this.act_values.orderid = this.obj.inputs.orderid.value = weblet.act_values.orderid;
      else
        return false;
      if ( typeof weblet.act_values.orderproducttype != 'undefined' )
        this.act_values.orderproducttype = this.obj.inputs.orderproducttype.value = weblet.act_values.orderproducttype;
      else
        return false;
      this.add();
      return true;
    }

    MneAjaxWeblet.prototype.showValue.call(this,weblet);


    this.setContent(this.obj.inputs.productdescription.value);

    this.obj.inputs.productname.disabled = this.obj.inputs.fromoffer.checked;
    this.obj.inputs.productpricecalc.disabled = this.obj.inputs.fromoffer.checked;
    this.obj.inputs.productcostcalc.disabled = this.obj.inputs.fromoffer.checked;
    this.obj.inputs.productvat.disabled = this.obj.inputs.fromoffer.checked;
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

     p = this.addParam(p, "par0", this.obj.inputs.orderproductid);
     p = this.addParam(p, "par1", this.obj.inputs.offerproductid);
     p = this.addParam(p, "par2", this.obj.inputs.position);
     p = this.addParam(p, "par3", this.obj.inputs.withworkingstep);
     p = this.addParam(p, "par4", this.obj.inputs.productdescription);
     p = this.addParam(p, "par5", this.obj.inputs.productcurrencyid);
     p = this.addParam(p, "par6", this.obj.inputs.productid);
     p = this.addParam(p, "par7", this.obj.inputs.orderproducttype);
     p = this.addParam(p, "par8", this.obj.inputs.timeauto);
     p = this.addParam(p, "par9", this.obj.inputs.showdeliver);
     p = this.addParam(p, "par10", this.obj.inputs.productcostrecalc);
     p = this.addParam(p, "par11", this.obj.inputs.productpricecalc);
     p = this.addParam(p, "par12", this.obj.inputs.productcostcalc);
     p = this.addParam(p, "par13", this.obj.inputs.productvat);
     p = this.addParam(p, "par14", this.obj.inputs.ready);
     p = this.addParam(p, "par15", this.obj.inputs.productname);
     p = this.addParam(p, "par16", this.obj.inputs.productnumber);
     p = this.addParam(p, "par17", this.obj.inputs.count);
     p = this.addParam(p, "par18", this.obj.inputs.actcount);
     p = this.addParam(p, "par19", this.obj.inputs.productunit);
     p = this.addParam(p, "par20", this.obj.inputs.productprice);
     p = this.addParam(p, "par21", this.obj.inputs.productcost);
 
     p = this.addParam(p, "typ2", "long" );
     p = this.addParam(p, "typ3", "bool" );
     p = this.addParam(p, "typ8", "bool" );
     p = this.addParam(p, "typ9", "bool" );
     p = this.addParam(p, "typ10", "bool" );
     p = this.addParam(p, "typ11", "double" );
     p = this.addParam(p, "typ12", "double" );
     p = this.addParam(p, "typ13", "double" );
     p = this.addParam(p, "typ14", "bool" );
     p = this.addParam(p, "typ17", "double" );
     p = this.addParam(p, "typ18", "double" );
     p = this.addParam(p, "typ20", "double" );
     p = this.addParam(p, "typ21", "double" );

     return MneAjaxWeblet.prototype.func.call(this, p, "orderproductid", setdepend);
  }

  weblet.del = function(setdepend)
  {
    var result;
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        par0 : this.act_values.orderproductid,
        typ0 : "text",
        sqlend : 1   
    }

   if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values.productname)) != true )
      return false;

    this.obj.noadd = true;
    try 
    {
      result = MneAjaxWeblet.prototype.func.call(this, p, '', setdepend, 'del');
    }
    catch(e)
    {
      this.obj.noadd = false;
      return true;
    }
    
    this.obj.noadd = false;
    if ( typeof this.popup != 'undefined')
      this.popup.hidden();
    
    return result;
  }
  
  weblet.checkmodified = function()
  {
    return false;
  }
  
  weblet.add = function(setdepend)
  {
    if ( this.obj.noadd == true ) return false;
    
    MneAjaxWeblet.prototype.add.call(this, false);
    this.showInput(this.obj.inputs.productcostrecalc, "#mne_lang#wahr#", null, false);
    
    this.parent.popups[this.oid + 'addselect'].show();
    this.parent.popups[this.oid + 'addselect'].weblet.onbtnobj = this;
    this.setContent('');
    {
      var popup = this.parent.popups[this.oid + 'addselect'];
      var timeout = function() { popup.resize.call(popup, false, false ); }
      window.setTimeout(timeout, 100);
    }
    return false;
  }
  
  weblet.onbtnok = function(button)
  {
    if ( button.weblet == this.parent.subweblets[this.oid + 'addselect'])
    {
      var p =
      {
          schema : this.initpar.schema,
          name : this.initpar.addfunction,
          par0 : this.act_values.orderid,
          typ0 : "text",
          par1 : this.obj.inputs.orderproducttype.value,
          typ1 : "text",
          par2 : button.weblet.act_values.productid,
          typ2 : "text",
          sqlend : 1   
      }
      if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
      {
        this.act_values.orderproductid = this.act_values.result;
        this.showValue(this);
        this.setDepends("showValue");
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
      return true;
    }
    else
      MneAjaxWeblet.prototype.onbtnok.call(this,button);
  }
  
  weblet.pricecalcmod = function()
  {
    this.obj.inputs.productpricecalc.disabled = ! this.obj.inputs.productpricecalc.disabled;
  }

  weblet.costcalcmod = function()
  {
    this.obj.inputs.productcostcalc.disabled = ! this.obj.inputs.productcostcalc.disabled;
  }

  weblet.calculate = function()
  {
    var param =
    {
        "schema" : "mne_crm",
        "query"  : "ordercost",
        "cols"   : "orderproductcost",
        "orderproductidInput.old" : this.act_values.orderproductid,
        "sqlend" : 1
    };
    
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param)
    if ( this.values.length > 0 )
      this.showInput(this.obj.inputs.productcost, this.values[0][0], null, true);
  }

  weblet.detail = function()
  {
    this.reload = true;
    this.initpar.view2 = ! this.initpar.view2;
    this.initpar.noshowatload = true;
    
    var orderproductid = this.act_values.orderproductid;

    this.load(this.id);

    this.act_values.orderproductid = orderproductid;
    this.showValue(this);

    if ( typeof this.popup != 'undefined' && this.popup != null )
    {

      this.popup.root.style.width = "10px";
      this.popup.root.style.height = "10px"

      this.popup.resize(true,true);
    }
  }
  
  weblet.print = function()
  {
    if ( this.initpar.view2 ) this.obj.editor.save();
    
    var p =
    {
        wval : this.act_values.orderproductid,
        wop  : "=",
        wcol : 'orderproductid',
        sort : '',
        sqlend : 1
    };
    
    MneAjaxWeblet.prototype.print.call(this,p);
    return false;
  }

}
