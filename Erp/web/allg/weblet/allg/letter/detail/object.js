// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/letter/detail
// ================================================================================
{
  weblet.loadClass("MneEditor", "editor/mne_editor.js");
  weblet.loadCss('all.css', '/styles/editor');
  
  weblet.loadview();
  
  var ivalues = 
  {
      schema     : 'mne_base',
      query      : 'letter',
      table      : 'letter',
      ewidth     : '570', /* ist etwa a4 */
      eheight    : '400',
      report     : 'mne_letter_reference',
      reportlist : 'lettertyp',
      
      docschema  : 'mne_crm',
      doctable   : 'file'
  };

  weblet.initDefaults(ivalues);

  var attr = 
  {
      hinput : false,
      reportqueryInput : { selectlist : weblet.initpar.reportlist },
      editor           : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" }
  };

  weblet.findIO(attr);
  weblet.showLabel();
  weblet.eleMkClass(weblet.origframe, "haveeditor" );

  weblet.obj.mkbuttons.push( { id: 'ladd', value : weblet.txtGetText("#mne_lang#Brief hinzufügen#"), space : 'before'});
  weblet.obj.mkbuttons.push( { id: 'send', value : weblet.txtGetText("#mne_lang#Versenden#")});

  weblet.showids = new Array("letterid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Brief hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Brief bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Brief <$1> wirklich löschen");
  weblet.titleString.delid = 'name';
  
  weblet.defvalues = { language : 'de' }
  weblet.obj.editor = null;
  weblet.obj.editor_win = new MneEditor(weblet.win, weblet.frame.querySelector("#editor"), weblet.frame.querySelector("#editorbuttons"));
  weblet.obj.editor_win.parameter.mne_ajax = true;
  weblet.obj.editor_win.parameter.nohtml   = true;
  
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Xml",        line: 1, output : weblet.obj.inputs.data };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Itemize",    line: 1  };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Save",       line: 1, pos : 0 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Clipboard",  line: 1, pos : 0 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Table",      line: 1 };
  weblet.obj.editor_win.show(function(editor){weblet.editor_loadready(editor); });
    
  
  weblet.editor_loadready = function(editor)
  {
    this.obj.editor = editor;
    this.obj.editor.weblet = this;
    
    if ( typeof this.obj.pendingtext == 'string')
    {
      if ( this.obj.pendingtext == '' ) this.obj.editor.setContent('');
      else
      {
        MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : this.obj.pendingtext, size : weblet.initpar.ewidth } );
        this.obj.editor.setContent(this.req.responseText);
      }
      this.obj.pendingtext = false;
    }
    if ( typeof this.obj.resizetext == 'string')
    {
      this.obj.editor.setContent(this.obj.resizetext);
      this.obj.resizetext = false;
    }
  };
  
  weblet.reset = function()
  {
    if ( this.obj.editor != null )
      this.obj.editor.destructor();
    this.obj.editor = null;
    MneAjaxWeblet.prototype.reset.call(this);
 };
  
  weblet.setContent = function(text)
  {
    if ( this.obj.editor != null )
    {
      MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : text, size : weblet.initpar.ewidth } );
      this.obj.editor.setContent(this.req.responseText);
    }
    else
      this.obj.pendingtext = text;
  };
  
  weblet.showValue = function(weblet, param)
  {
    this.obj.buttons.send.disabled = false;
    if ( typeof param != 'undefined' && param.showvalueallways == true )
    {
      if ( weblet.act_values[this.initpar.refidname] != '################' )
        this.obj.inputs.refid.value = weblet.act_values[this.initpar.refidname];
      else
        this.obj.inputs.refid.value = '';

      if ( typeof weblet.act_values[this.initpar.refname] != 'undefined' )
        this.obj.outputs.refname.innerHTML = weblet.act_values[this.initpar.refname];
      else
        this.obj.outputs.refname.innerHTML = '';
    }
    else
    {
      MneAjaxWeblet.prototype.showValue.call(this,weblet);
   
      if ( weblet != null )
      {
        this.obj.inputs.reportquery.selectlist = 'lettertyp' + this.act_values.ref;
        this.initpar.reportlist = 'lettertyp' + this.act_values.ref;
        this.create_selectlist(this.obj.inputs.reportquery);
        this.showInput('reportquery', this.act_values.reportquery);
        
        if ( this.obj.inputs.reportquery.className.indexOf('modifyok') != -1 ) this.eleMkClass(this.obj.inputs.reportquery, "modifyno", true, "modify");

        this.setContent(this.obj.inputs.data.value);
        
        if ( this.act_values.send == "#mne_lang#wahr" )
          this.obj.buttons.send.disabled = true;
      }
    }
  };
  
  weblet.checkmodified = function()
  {
    var result = MneAjaxWeblet.prototype.checkmodified.call(this);
    if ( this.obj.editor != null ) result = result || this.obj.editor.ismodifed;
    return result;
  }
  
  weblet.add = function()
  {
    var modify = this.checkmodified();
    var result = MneAjaxWeblet.prototype.add.call(this);
    
    if ( ! modify )
    {
      this.obj.inputs.language.value = "de";
      this.obj.buttons.send.disabled = false;

      if ( typeof this.parent.initpar.refidname != 'undefined' && typeof this.parent.act_values[this.parent.initpar.refidname] != 'undefined' && this.parent.act_values[this.parent.initpar.refidname] != '################')
      {
        this.obj.inputs.refid.value = this.act_values.refid = this.parent.act_values[this.parent.initpar.refidname];
      }

      if ( typeof this.parent.initpar.refname != 'undefined' && typeof this.parent.act_values[this.parent.initpar.refname] != 'undefined' && this.parent.act_values[this.parent.initpar.refidname] != '################')
      {
        this.obj.outputs.refname.innerHTML =  this.parent.act_values[this.parent.initpar.refname];
        this.initpar.reportlist = this.obj.inputs.reportquery.selectlist = 'lettertyp' + this.parent.initpar.refname;
        this.create_selectlist(this.obj.inputs.reportquery);
      }
      else
      {
        this.initpar.reportlist = this.obj.inputs.reportquery.selectlist = 'lettertyp';   
        this.create_selectlist(this.obj.inputs.reportquery);

      }

      this.setContent('');
    }
    return result;
  };
  
  weblet.ok = function()
  {
    if ( this.act_values.send == '#mne_lang#wahr' )
    {
        if ( this.confirm("#mne_lang#Brief ist versendet worden - als neuen Brief speichern ?") != true )
          return false;
        this.obj.inputs.letterid.value = "################";
        this.obj.inputs.name.value = "#mne_lang#Kopie von " + this.obj.inputs.name.value;
        this.okaction = 'add';
    }
    
    this.obj.editor.save();
    return MneAjaxWeblet.prototype.ok.call(this);
  };
  
  
  weblet.cancel = function()
  {
    var result = false;
    if ( typeof this.act_values.letterid == 'undefined' || this.act_values.letterid == null || this.act_values.letterid == '################' )
      return this.add();

    this.setContent(this.obj.inputs.data.value);
    return result;
  };
  
  weblet.print = function()
  {
    this.obj.editor.save();
    var p =
    {
        wval : this.act_values.letterid,
        wop  : "=",
        wcol : 'letterid',
        sort : '',
        language : this.obj.inputs.language.value,
        xml0 : "lettercontent," + this.obj.inputs.data.value,
        macro0 : 'havelettercontent,1',
        
        sqlend : 1
    };
    
    if ( this.act_values.send != '#mne_lang#wahr' )
      p.macro1 = 'watermark,' + this.txtGetText('#mne_lang#Entwurf');
    
    var reportquery = this.obj.inputs.reportquery.value.split('.');
    if ( reportquery.length == 2 )
    {
      p.schema = reportquery[0];
      p.query = reportquery[1];
    }
    
    MneAjaxWeblet.prototype.print.call(this,p);
    return false;
  };
  
  weblet.ladd = function()
  {
    this.parent.popups['letteraddselect'].show();
    this.parent.popups['letteraddselect'].weblet.onbtnobj = this;
    return false;
  };
  
  weblet.send = function()
  {
    
    if ( this.eleGetById(this.frame, "editorbuttons").firstChild.className.indexOf("modifyok") != -1 )
    {
      alert("#mne_lang#Zum Versenden muss der Brief gespeichert werden");
      return;
    }

    var p =
    {
        wval : this.act_values.letterid,
        wop  : "=",
        wcol : 'letterid',
        sort : '',
        xml0 : "lettercontent," + this.obj.inputs.data.value,
        language : this.obj.inputs.language.value,
        base64 : '1',
        sqlend : 1
    };
    
    var reportquery = this.obj.inputs.reportquery.value.split('.');
    if ( reportquery.length == 2 )
    {
      p.schema = reportquery[0];
      p.query = reportquery[1];
    }
    
    var w = new MneAjaxData(this.win);
    var val = w.load('report/' + this.initpar.report + ".pdf",p);
    
    if ( val.substr(0,5) != 'JVBER')
    {
      this.error("#mne_lang#Fehler während des Druckens gefunden#\n" + val);
      return true;
    }

    var p = 
    {
        schema : this.initpar.docschema,
        table  : this.initpar.doctable,

        fileidInput      : '################',
        refidInput       : this.obj.inputs.refid.value,
        typInput         : 'letter',
        datatypeInput    : 'application/pdf',
        authorInput      : this.win.mne_config.username,
        nameInput        : this.obj.inputs.name.value,
        descriptionInput : this.obj.inputs.subject.value,
        uidInput         : this.obj.inputs.letterid.value,
        dataInput        : val,
        sqlend           : '1'
    };

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    
    if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/insert.xml",  p ) == 'ok' )
    {
      this.obj.buttons.send.disabled = true;
      this.act_values.send = '#mne_lang#wahr';
      this.setDepends('send');
      return this.print();
    }
    
    return true;
  };

  weblet.onbtnok = function(button)
  {
    if ( button.weblet == this.parent.subweblets['letteraddselect'])
    {
      var p = 
      {
          schema : this.initpar.schema,
          query  : this.initpar.query,
          table  : this.initpar.table,
          cols   : "data",

          "letteridInput.old" : button.weblet.act_values.letterid,
          
          sqlend : 1
      };

      if ( typeof this.initpar.query != 'undefined' ) 
        MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml", p);
      else
        MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml", p);

      if ( this.values.length > 0 )
      {
        MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : this.values[0][0], size : this.initpar.ewidth } );
        var d = this.obj.editor.doc.createElement("div");
        d.innerHTML = this.req.responseText;
        this.obj.editor.clipboardPaste(d);
        this.obj.editor.buttons.setModify(true);
      }
    }
    else if ( button.weblet.id == 'detailinputlistrefname' )
    {
      MneAjaxWeblet.prototype.onbtnok.call(this,button);
      this.initpar.reportlist = this.obj.inputs.reportquery.selectlist = 'lettertyp' + button.weblet.act_values['ref'];   
      this.create_selectlist(this.obj.inputs.reportquery);
    }
    MneAjaxWeblet.prototype.onbtnok.call(this,button);
  };
  
  weblet.fullscreen = function(button, frame, nosize)
  {
    this.obj.resizetext = this.obj.editor.getContent();
    return MneAjaxWeblet.prototype.fullscreen.call(this, button, frame, nosize);
  };
  
  weblet.wresize = function()
  {
    var e = weblet.eleGetById(weblet.frame, "editor");
    
    if ( e != null )
    {
      var h = this.origframe.offsetHeight - this.posGetTop(e, this.origframe) - 28;
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
