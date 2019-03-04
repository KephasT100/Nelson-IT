// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/repository/interest/file
// ================================================================================
{
  var i;
  var str = "";
  var e,t,r;
  
  var ivalues = 
  {

      root : 'repository',
      autocommit : true,
      
   };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();

  var attr =
  {
      sendframe  : { weblet : weblet }
  };

  weblet.findIO(attr);
  weblet.delbuttons(['add', 'del', 'cancel']);
  weblet.obj.mkbuttons.push({ id: 'cancelfile', value : weblet.txtGetText('#mne_lang#Abbrechen#')});
  
  weblet.showValue = function(weblet, param)
  {
    var i = null;
    this.act_values = {};
    for ( i in weblet.act_values )
      this.act_values[i] = weblet.act_values[i];
   
    this.obj.refreshweblet = weblet;
    
    this.obj.inputs.filename.value = "";
    this.clearModify();

    this.frame.sendframe.src = "/weblet/allg/file/send/view.html";
  };
  
  weblet.dataready = function(showpopup)
  {
      var str = this.frame.sendframe.contentDocument.getElementsByTagName("body")[0].innerHTML;
      if ( str.substr(0,2) == 'ok' )
      {
        if ( str.length > 2 )
          this.warning(str.substr(2));

        if ( typeof this.onbtnobj != 'undefined ' && typeof this.onbtnobj["onbtndataready"] == 'function' ) 
          this.onbtnobj["onbtndataready"](this); 
        else if ( typeof this.onbtnobj != 'undefined ' && typeof this.onbtnobj.onbtnclick == 'function' )
          this.onbtnobj.onbtnclick('dataready',this); 

        this.showValue(this.obj.refreshweblet);
        
        this.obj.refreshweblet.showValue(this.obj.refreshweblet);
        this.obj.refreshweblet.setDepends("ok");
        

      }
      else
      {
        this.error(str);
      }
  };

  weblet.sendready = function()
  {
    var e;
    
    this.obj.sendform = this.frame.sendframe.contentDocument.getElementById("sendform");
    this.obj.sendform.elements.dataInput.weblet = this;
    this.obj.sendform.elements.dataInput.onchange = function()
    {
      try { this.weblet.data_change(this); } catch (e) { this.webet.exception("MneFile: ", e); }
    };


    this.obj.sendform.action = '/db/utils/repository/mkfile.html';

    e = this.doc.createElement('input');
    e.name = "rootInput.old";
    e.type = "hidden";
    e.value = this.initpar.root;
    this.obj.sendform.appendChild(e);

    e = this.doc.createElement('input');
    e.name = "dirInput.old";
    e.type = "hidden";
    e.value = this.act_values.menuid;
    this.obj.sendform.appendChild(e);

    e = this.doc.createElement('input');
    e.name = "repositoryidInput.old";
    e.type = "hidden";
    e.value = this.act_values.repositoryid;
    this.obj.sendform.appendChild(e);

    e = this.doc.createElement('input');
    e.name = "filenameInput.old";
    e.value = this.act_values.name;
    e.type = "hidden";
    this.obj.sendform.appendChild(e);

    this.obj.repnote = e = this.doc.createElement('input');
    e.name = "commitmessageInput";
    e.type = "hidden";
    this.obj.sendform.appendChild(e);

    this.obj.newname = e = this.doc.createElement('input');
    e.name = "filenameInput";
    e.type = "hidden";
    this.obj.sendform.appendChild(e);
    
    if ( this.initpar.autocommit == true )
    {
      e = this.doc.createElement('input');
      e.name = "autocommitInput";
      e.type = "hidden";
      e.value = "true";
      this.obj.sendform.appendChild(e);
    }
    
    var body = this.frame.sendframe.contentDocument.body;
    this.frame.sendframe.style.width = body.scrollWidth + "px";
    this.frame.sendframe.style.height = body.scrollHeight + "px";
    this.frame.sendframe.style.overflow = "hidden";
   if ( typeof this.popup != 'undefined' && this.popup != null ) this.popup.resize(true, false);
  };

  weblet.data_change = function(ele)
  {
    if ( ele.value.lastIndexOf('\\') != -1 )
      this.obj.newname.value = ele.value.substr(ele.value.lastIndexOf('\\') + 1);
    else
      this.obj.newname.value = ele.value;
  
    if ( this.obj.inputs.filename.value == '' )
      this.obj.inputs.filename.value = this.obj.newname.value;
  };

  weblet.add = function()
  {
  };
  
  weblet.cancelfile = function()
  {
    this.popup.hidden();
  };
  
  weblet.ok = function ()
  {
    this.obj.repnote.value = this.obj.inputs.repnote.value;
    if ( this.obj.inputs.filename.value != '' )
      this.obj.newname.value = this.obj.inputs.filename.value;
    this.obj.sendform.submit();
  };

 }