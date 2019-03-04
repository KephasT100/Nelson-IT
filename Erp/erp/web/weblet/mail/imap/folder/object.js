// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: mail/imap/folder
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      schema : "mne_mail",
      query  : "imapfolder",
      table  : 'imapfolder',
      cols   : "imapfolderid,folder,name,checkit,send",
      scols  : "name",
      
      wcol   : 'checkit',
      wop    : '=',
      wval   : 'true',
      
      tablehidecols : '0,1',
      iignorenotdefined : 1,
      
      showdynpar : '"imapmailboxidInput.old" : "imapmailboxid"',
      
      delparam : null,
      popup : null,
      showlabel : { de : 'aktivieren', 'en' : 'enable' },
      
      rescanschema : "mne_mail",
      rescanfunction : "imapfolder_rescan"
      
      
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  MneAjaxWeblet.prototype.loadbase.call(weblet, "weblet/allg/table/fix", weblet);
  weblet.initpar.popup = weblet.undefined;
    
  weblet.obj.mkbuttons.push({ id : 'sended', value : weblet.txtGetText("#mne_lang#Sende-/Empfangsbox" ), space : 'before', disabled : true });
  weblet.obj.mkbuttons.push({ id : 'rescan', value : weblet.txtGetText("#mne_lang#Server neu lesen" ) });
  
  var attr =
  {
  }
  
  weblet.obj.enablebuttons.push('rescan');

  weblet.obj.enablebuttonsvalue.push('showdetail');
  weblet.obj.enablebuttonsvalue.push('sended');

  weblet.del = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.schema,
        table  : this.initpar.table,
        sqlend : 1
    }
    
    p = this.addParam(p, "imapfolderidInput.old", this.act_values.imapfolderid);

    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest['del'],  p ) == 'ok' )
    {
      this.obj.tables.content.delRow(this.obj.tables.content.act_rownum);
      this.obj.old_rownum = -1;
      
      for ( i in this.ids)
        delete this.act_values[i];
      this.obj.showidvalue = null;

      if ( setdepend != false ) 
        this.setDepends('del');

      return false;
    }
  }

  weblet.rescan = function()
  {
    var ajax = new MneAjaxData(this.win);
    var i;

    if ( typeof this.act_values.imapmailboxid == 'undefined' ) 
    {
      this.error("#mne_lang#Bitte eine Mailbox auswählen");
      return true;
    }
    
    this.initpar.wcol = '';
    this.initpar.wop = '';
    this.initpar.wval = '';
    var p =
    {
        imapmailboxid : this.act_values.imapmailboxid,
        sqlend : 1
    };

    ajax.read.call(ajax,'/db/utils/imap/folder.xml', p);
    for ( i=0; i<ajax.values.length; i++ )
    {
      var p =
      {
          schema : this.initpar.rescanschema,
          name : this.initpar.rescanfunction,
          par0 : this.act_values.imapmailboxid,
          par1 : ajax.values[i][0],
          par2 : ajax.values[i][1],
          sqlend : 1
      };
      
      MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p);
    }
    
    this.showValue(this);
    this.setDepends("ok");
    return false;
  }
  
  weblet.sended = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        table  : this.initpar.table,
        sqlend : 1
    }
    
    p = this.addParam(p, "sendInput", ( this.act_values.send == "#mne_lang#falsch" ) ? 'true' : 'false' );
    p = this.addParam(p, "imapfolderidInput.old", this.act_values.imapfolderid);

    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest['mod'],  p ) == 'ok' )
    {
      this.showValue(this);
      this.setDepends("ok");
      return false;
    }   
  }
  
  weblet.showdetail = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        table  : this.initpar.table,
        sqlend : 1
    }
    
    p = this.addParam(p, "checkitInput", ( ! this.getBinaryValue(this.act_values.checkit[0]) ) ? 'true' : 'false' );
    p = this.addParam(p, "imapfolderidInput.old", this.act_values.imapfolderid);
    
    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest['mod'],  p ) == 'ok' )
    {
      this.showValue(this);
      this.setDepends("ok");
      return false;
    }
  }
  
}
