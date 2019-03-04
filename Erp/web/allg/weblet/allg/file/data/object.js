// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/file/data
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadClass("MneEditor", "editor/mne_editor.js");
  weblet.loadCss('all.css', '/styles/editor');

  var ivalues = 
  {
      schema    : '',
      query     : '',

      ewidth    : 570,
      eheight   : 400,
      
      styleName : 'style.css',
      
      typselectlist : 'documenttyp',
      
      titleadd : "#mne_lang#Datei hinzufügen",
      titlemod : "#mne_lang#Datei bearbeiten",
      
      refidname         : '',
      refnamename       : '',
      secondrefidname   : '',
      secondrefnamename : '',
      
      report    : "mne_filedata",
      
     };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.eleMkClass(weblet.origframe, "haveeditor" );

  var attr = 
  {
      hinput : false,
      editor           : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" },

      refidInput   : { notclear : true,  inputcheckobject : 'refname'},
      refnameOutput: { notclear : true },
      secondrefidInput   : { notclear : weblet.initpar.secondrefidname != '' },
      secondrefnameOutput: { notclear : weblet.initpar.secondrefnamename != '' },
      datatypInput : { notclear : true, value : 'application/octet-stream'},
      typInput     : { selectlist : weblet.initpar.typselectlist } 
  };

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array('fileid');
  weblet.titleString.add = weblet.txtGetText(weblet.initpar.titleadd);
  weblet.titleString.mod = weblet.txtGetText(weblet.initpar.titlemod);

  weblet.defvalues = { typ : 'other', author: window.mne_config.fullname };

  weblet.obj.editor = null;
  weblet.obj.editor_win = new MneEditor(weblet.win, weblet.frame.querySelector("#editor"), weblet.frame.querySelector("#editorbuttons"));

  weblet.obj.editor_win.parameter.mne_ajax = true;
  weblet.obj.editor_win.parameter.nohtml   = true;
  weblet.obj.resizetext = false;
  
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Xml",        line: 1, output : weblet.obj.inputs.source };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Save",       line: 1, pos : 0 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Clipboard",  line: 1, pos : 0 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Itemize",    line: 1 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Table",      line: 1 };

  weblet.editor_loadready = function(editor)
  {
    this.obj.editor = editor;
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

  weblet.showValue = function(weblet)
  {
    if ( weblet == null || this.initpar.refidname != '' && (  typeof weblet.act_values[this.initpar.refidname] == 'undefined' || weblet.act_values[this.initpar.refidname] == '################')
                        || this.initpar.secondrefidname != '' && (  typeof weblet.act_values[this.initpar.secondrefidname] == 'undefined' || weblet.act_values[this.initpar.secondrefidname] == '################') )
    {
      return false;
    }

    if ( this.obj.editor == null )
    {
      var self = this;
      this.obj.editor_win.show(function(editor){self.editor_loadready(editor); });
    }

    this.act_values.refid = weblet.act_values[this.initpar.refidname];
    this.act_values.secondrefid = weblet.act_values[this.initpar.secondrefidname];

    this.act_values.refname = ( typeof weblet.act_values[this.initpar.refnamename] != 'undefined' ) ? weblet.act_values[this.initpar.refnamename] : '';
    this.showOutputDefined(this.obj.outputs.refname, weblet.act_values[this.initpar.refnamename], null, false );
    this.showInputDefined (this.obj.inputs.refid,    weblet.act_values[this.initpar.refidname],   null,   false );

    this.showOutputDefined(this.obj.outputs.secondrefname,  weblet.act_values[this.initpar.secondrefnamename], null, false );
    this.showInputDefined (this.obj.inputs.secondrefid, weblet.act_values[this.initpar.secondrefidname],   null,   false );
    
    if ( typeof weblet.act_values.fileid == 'undefined' || weblet.act_values.fileid == null || weblet.act_values.fileid == '################' || weblet.act_values.fileid == '' )
      this.add();
    else
      MneAjaxWeblet.prototype.showValue.call(this,weblet);

    this.setContent(this.obj.inputs.source.value);
    return;
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
    if ( ! modify ) this.setContent('');
    return result;
  }

  weblet.ok = function(setdepend)
  {

    try
    {
      this.obj.editor.save();
  
      if ( this.obj.inputs.description.value == '' )
        this.obj.inputs.description.value = this.obj.inputs.name.value;
      
      if ( this.obj.inputs.name.value.substr(this.obj.inputs.name.value.length -4 ) != '.pdf')
        this.obj.inputs.name.value += '.pdf';
      
      if ( this.obj.inputs.source.value == "" )
        this.obj.inputs.source.value = '<part><text size="n"> </text></part>';

      if ( this.obj.inputs.author.value == '')
        this.obj.inputs.author.value = window.mne_config.fullname;
      
      if ( MneAjaxWeblet.prototype.ok.call(this, false) == false )
      {
        var p =
        {
            schema : this.initpar.schema,
            query : this.initpar.query,
            wval : weblet.act_values.fileid,
            wop  : "=",
            wcol : 'fileid',
            macro0: 'reptitle,' + this.act_values.name,
            macro1: 'preprint,1',
            xml0 : 'pretext,' + this.obj.inputs.source.value,
            sort : '',

            base64 : '1',
            base64schema  : this.initpar.schema,
            base64table   : this.initpar.table,
            base64id      : 'fileid',
            base64idvalue : weblet.act_values.fileid,
            base64data    : 'data',

            sqlend : 1
        };

        this.obj.inputs.datatype.value = "application/pdf";
        var ajax = new MneAjaxData(this.win);

        if ( ajax.load.call(this, 'report/' + this.initpar.report + '.pdf', p ) == 'ok' )
        {
          var v = { };
          if ( this.initpar.refidname != '' ) v[this.initpar.refidname] = this.act_values.refid;
          if ( this.initpar.secondrefidname != '' ) v[this.initpar.secondrefidname] = this.act_values.secondrefid;
          v["fileid"] = this.act_values.fileid;
          
          this.showValue({ act_values : v });
          if ( setdepend != false )
            this.setDepends('ok');

          return false;
        }

        this.error(this.txtGetText('#mne_lang#Fehler beim schreiben der Datei'));
        return true;
      }
      
      return true;
    }
    catch (e)
    {
      this.exception("MneFileData", e);
      return true;
    }
    
    return false;
  };

  weblet.cancel = function()
  {
    var result = MneAjaxWeblet.prototype.cancel.call(this);
    this.setContent(this.obj.inputs.source.value);    
    return result;
  };

  weblet.print = function()
  {
    this.obj.editor.save();
    var text = this.obj.inputs.source.value;
    
    var p =
    {
        schema : this.initpar.schema,
        query : this.initpar.query,
        wval : weblet.act_values.fileid,
        wop  : "=",
        wcol : 'fileid',
        macro0: 'reptitle,' + this.act_values.name,
        xml0 : 'pretext,' + text,
        sort : '',
        sqlend : 1
    };

    if ( text != this.obj.inputs.source.value )
      p.macro1 = 'watermark,' + this.txtGetText('#mne_lang#Entwurf');

    MneAjaxWeblet.prototype.print.call(this,p);
    return false;
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
