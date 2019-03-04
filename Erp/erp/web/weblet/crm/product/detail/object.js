// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/product/detail
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
      schema : 'mne_crm',
      query  : 'product',
      table  : "product",
      
      ewidth  : '570', /* ist etwa a4 */
      eheight : '300',
      
      report : 'mne_product',
      
      view2 : false
  }

  weblet.initDefaults(ivalues);

  weblet.loadClass("MneEditor", "editor/mne_editor.js");
  weblet.loadCss('all.css', '/styles/editor');
  
  weblet.loadview(null, this.path + ( ( weblet.initpar.view2 ) ? '/view2.html' : '/view1.html') );
  weblet.eleMkClass(weblet.origframe, "haveeditor" );

  var attr = 
  {
      hinput: false,
      editor       : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" },
      reportInput  : { selectlist : weblet.initpar.reportlist },
      
      treeparentidInput : { notclear : true },
      treeparentnameOutput : { notclear : true },
      
      detailButton : { checked : weblet.initpar.view2 }
   }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("productid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Produkt hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Produkt bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Produkt <$1> wirklich löschen");
  weblet.titleString.delid = "productname";
  
  weblet.obj.editor = null;
  if ( weblet.initpar.view2 )
  {
    weblet.obj.editor_win = new MneEditor(weblet.win, weblet.frame.querySelector("#editor"), weblet.frame.querySelector("#editorbuttons"));

    weblet.obj.editor_win.parameter.mne_ajax = true;
    weblet.obj.editor_win.parameter.nohtml   = true;

    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Xml",        line: 1, output : weblet.obj.inputs.description };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Save",       line: 1, pos : 0 };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Clipboard",  line: 1, pos : 0 };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Itemize",    line: 1 };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Table",      line: 1 };
    weblet.obj.editor_win.show(function(editor){weblet.editor_loadready(editor); });
  }
  
  weblet.defvalues = { treeid : '################' };
  
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
    
    if ( typeof this.obj.resizetext == 'string')
    {
      this.obj.editor.setContent(this.obj.resizetext);
      this.obj.resizetext = false;
    }
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
    }
    else
      this.obj.pendingtext = text;
  }

  weblet.showValue = function(weblet)
  {
    if ( weblet == null || this.eleIsNotdefined(weblet.act_values)  || this.eleIsNotdefined(weblet.act_values[this.showids[0]]) || weblet.act_values[this.showids[0]] == '################'  || weblet.act_values[this.showids[0]] == '' )
    {
      this.add();
      return;
    }
    var result = MneAjaxWeblet.prototype.showValue.call(this,weblet);
    if (weblet != null) this.setContent(this.obj.inputs.description.value);
    return result;
  }
  
  weblet.checkmodified = function()
  {
    var result = MneAjaxWeblet.prototype.checkmodified.call(this);
    if ( this.obj.editor != null ) result = result || this.obj.editor.ismodifed;
    return result;
  }
 
  weblet.add = function()
  {
    var modifyed = this.checkmodified();
    var result = MneAjaxWeblet.prototype.add.call(this);

    if ( ! modifyed )
      this.setContent('');

    return result;
  }
  
  weblet.ok = function()
  {
    var i;
    var p = {};
    var name = this.act_values.name;
    var id = this.act_values.id;
    var action;
    var result;

    if ( weblet.initpar.view2 )
      this.obj.editor.save();
    
    if ( this.okaction == 'add' ) action = "/db/utils/table/insert.xml";
    else action = "/db/utils/table/modify.xml";
   
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table);
    
    p = this.addParam(p, "productidInput.old", this.act_values.productid);
    p = this.addParam(p, "productidInput", this.act_values.productid);
    
    p = this.addParam(p, "name");
    p = this.addParam(p, "description");
    p = this.addParam(p, "productnumber");
    p = this.addParam(p, "withworkingstep");

    p = this.addParam(p, "rollback", true);

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    MneAjaxWeblet.prototype.write.call(this, action,  p );
  
    p = {};
    
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table + "tree");
    
    p = this.addParam(p, "productidInput.old", this.act_values.productid);
    p = this.addParam(p, "productidInput",     this.act_values.productid);
    
    p = this.addParam(p, "parentidInput", this.obj.inputs.treeparentid.value);
    p = this.addParam(p, "treeid");
    p = this.addParam(p, "treenameInput", this.obj.inputs.name.value);
    p = this.addParam(p, "rollback", true);
    p = this.addParam(p, "sqlend", 1);

    result = MneAjaxWeblet.prototype.write.call(this, action,  p );

    if ( result == 'ok' )
    {
      this.showValue(this);
      this.setDepends('ok');
      return false;
    }
    return true;
  }
  
  weblet.del = function()
  {
    var p = {};
    var result;
    
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values.name)) != true )
      return false;

    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( result != 'ok' ) return true;
    
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table + "tree");
    
    p = this.addParam(p, "productidInput.old", this.act_values.productid);
    p = this.addParam(p, "productidInput",     this.act_values.productid);
    p = this.addParam(p, "rollback", true);
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok' ) return true;

    p.table = this.initpar.table + 'price';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok' ) return true;

    p.table = this.initpar.table + 'vendor';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok' ) return true;

    p.schema = 'mne_personnal';
    p.table = 'producttime';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok' ) return true;

    p.schema = 'mne_warehouse';
    p.table = 'productpart';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok' ) return true;

    p.schema = this.initpar.schema;
    p.table = this.initpar.table;
    p.sqlend = 1;
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result == 'ok' )
    {
      this.add();
      return false;
    }
    return true;
  }
    
  weblet.print = function()
  {
    if ( weblet.initpar.view2 )
      this.obj.editor.save();
    
    var p =
    {
        wval : this.act_values.productid,
        wop  : "=",
        wcol : 'productid',
        sort : '',
        xml0 : "productdescription," + this.obj.inputs.description.value,
        sqlend : 1
    };
    
    if ( this.act_values.description != this.obj.inputs.description.value )
      p.macro0 = 'watermark,' + this.txtGetText('#mne_lang#Entwurf');
    
    MneAjaxWeblet.prototype.print.call(this,p);
    return false;
  }
  
  weblet.fullscreen = function(button, frame)
  {
    if ( weblet.initpar.view2 )
      this.obj.resizetext = this.obj.editor.getContent();
    return MneAjaxWeblet.prototype.fullscreen.call(this, button, frame);
  };

  weblet.wresize = function()
  {
    var e = weblet.eleGetById(weblet.frame, "editor");
    
    if ( e != null )
    {
      var h = this.origframe.offsetHeight - this.posGetTop(e, this.origframe) - this.posGetHeight(this.frame.querySelector('#modifyinfo')) - 28;
      if ( h < this.initpar.eheight ) h = this.initpar.eheight;
      e.style.height = h + "px";
      
      weblet.obj.editor_win.resize();
    }
  };
  
  {
    var self = weblet;
    window.setTimeout(function() { if ( typeof self.popup == 'undefined' && self.popup == null ) self.wresize(); },200);
  }

}
