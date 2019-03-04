// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/vcard/import
// ================================================================================
{
  var i;
  var str = "";
  
  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");
  var ivalues = 
  {
      target : null,
      map :    ''
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.delbuttons('del,cancel,add');
  weblet.setbuttonpar('ok', 'value', weblet.txtGetText("#mne_lang#Import#"));

  var attr = 
  {
      hinput : false,
      sendframe : { weblet : weblet }
  };

  weblet.findIO(attr);

  weblet.showids = new Array();
  weblet.titleString.add = weblet.txtGetText("#mne_lang#hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#bearbeiten");
       
  weblet.obj.tables.data.addHead("#mne_lang#Kategorie", "#mne_lang#Typ", "#mne_lang#Wert");
  weblet.obj.read = new Array();
  eval("weblet.obj.map = { " + weblet.initpar.map + "}" ); 
  
  weblet.sendready = function()
  {
    var body = this.frame.sendframe.contentDocument.getElementsByTagName("body")[0];
    this.frame.sendframe.style.width  = ( body.offsetWidth + 6 )+ "px";
    this.frame.sendframe.style.height = ( body.offsetHeight + 6 ) + "px";
    this.frame.sendframe.style.overflow = "hidden";
  };
  
  weblet.dataready = function()
  {
    try {
      var i;
      var e,ee;
      var elements;
      var obj = this.eleGetById(this.frame.sendframe.contentDocument, "data");

      
      this.act_values.data = decodeURIComponent(obj.value);
      this.frame.sendframe.src = this.path + "/send.html";

      elements = this.act_values.data.split("\r\n");
      
      if ( elements.length < 2 ) elements = this.act_values.data.split("\n");
      if ( elements.length < 2 ) elements = this.act_values.data.split("\r");

      for ( i = 0; i<elements.length; i++)
        if ( elements[i].toUpperCase().indexOf("BEGIN:VCARD") != -1 ) break;

      for ( i++; i<elements.length; i++)
      {
        if ( elements[i].toUpperCase() == "END:VCARD") break;
        e = elements[i];
        while ( i+1 < elements.length && ( elements[i+1][0] == ' ' || elements[i+1][0] == '\t' ) )
        { 
          ee = elements[i+1];
          while( ee[0] == ' ' || ee[0] == '\t' ) ee = ee.substr(1);
          e = e + ee;
          i++;
        }
        this.addline(e);
      }
      if ( typeof this.popup != 'undefined') this.popup.resize(true,false);
    }
    catch(e)
    {
      this.exception("MneVard::dataread:", e);
    }
  };

  weblet.obj.dragobj = weblet.doc.createElement("div");
  weblet.obj.dragobj.style.position = "absolute";
  weblet.obj.dragobj.innerHTML = "Dies ist ein Test";
  weblet.obj.dragobj.style.border = "var(--border)";
  
  weblet.mousedown = function(evt)
  {
    if ( typeof evt.target.action == 'undefined' || evt.target.action.weblet != this ) return;

    this.obj.dragobj.style.left = evt.clientX + "px";
    this.obj.dragobj.style.top  = evt.clientY + "px";
    this.obj.dragobj.style.zIndex = window.MneAjaxPopup.zindex++;
    this.obj.dragobj.action = evt.target.action;
    this.obj.dragobj.innerHTML = evt.target.action.value;
    
    this.doc.getElementsByTagName("body")[0].appendChild(this.obj.dragobj);
    
    this.obj.posx = this.obj.dragobj.offsetLeft - evt.clientX;
    this.obj.posy = this.obj.dragobj.offsetTop - evt.clientY;

    weblet.win.mneDocevents.addInterest("mousemove", this);
    weblet.win.mneDocevents.addInterest("mouseup",   this);
    return false;
  };
  
  weblet.mousemove = function(evt)
  {
    this.obj.dragobj.style.left = (evt.clientX  + this.obj.posx) + "px";
    this.obj.dragobj.style.top = (evt.clientY  + this.obj.posy) + "px";
    return false;
  };
  
  weblet.mouseup = function(evt)
  {
    if ( this.obj.dragobj.parentNode != null )
      this.obj.dragobj.parentNode.removeChild(this.obj.dragobj);

    this.win.mneDocevents.removeInterest("mousemove", this);
    this.win.mneDocevents.removeInterest("mouseup",   this);

    var i = null;
    for ( i in this.initpar.target.obj.inputs )
    {
      if (  this.win.mneDocevents.checkInside(evt, this.initpar.target.obj.inputs[i]) )
        this.showInput(this.initpar.target.obj.inputs[i], this.obj.dragobj.action.value, null, true);
    }
    return false;
  };
  
  weblet.win.mneDocevents.addInterest("mousedown", weblet);

  weblet.setImport = function(typ, value )
  {
    var i = null;
    
    if ( this.initpar.target != null )
    {
      var inputs = this.initpar.target.obj.inputs;
      
      for ( i in value )
      {
        if ( typeof this.obj.map[i] != 'undefined' )
        {
          if ( this.obj.map[i] != ''  )
          {
            if ( typeof inputs[this.obj.map[i]] != 'undefined' && inputs[this.obj.map[i]].value == '' )
            {
              var v = value[i];
              delete value[i];
              this.initpar.target.showInput(inputs[this.obj.map[i]], v, null, true);
            }
          }
          else
          {
            delete value[i];
          }
        }
        else if ( typeof inputs[i] != 'undefined' && inputs[i].value == '' )
        {
          var v = value[i];
          delete value[i];
          this.initpar.target.showInput(inputs[i], v, null, true);
        }
      }
      if ( typeof this.initpar.target.setVcard == 'function' )
      {
        for ( i in value )
        {
          var v = value[i];
          if ( this.initpar.target.setVcard(i, v) == true )
            delete value[i];
        }  
      }
    }

    for ( i in value )
    {
      var r = this.obj.tables.data.add(typ, i, value[i] );
      this.obj.tables.data.table.rows[r+1].cells[2].action = { weblet : this, typ : typ, categorie : i, value : value[i] };
    }
  };
  
  weblet.obj.read["VERSION"] = function(label, value)
  {
    if ( value != "3.0") this.warning("#mne_lang#Vcard Version ist unbekannt - es kann zu Fehlern kommen");
  };

  weblet.obj.read["N"] = function(label, value)
  {
    var vals = value.split(';');
    var name      = ( vals.length > 0 ) ? vals[0] : "";
    var firstname = ( vals.length > 1 ) ? vals[1] : "";
    var midname   = ( vals.length > 2 ) ? " " + vals[2] : "";
    
    this.setImport("Name", { lastname : name, firstname : firstname + midname } );
  };
  
  weblet.obj.read["FN"] = function( label, value )
  {
    this.setImport("Fullname", { fullname : value } );
  };
  
  weblet.obj.read["ADR"] = function(label, value)
  {
    var labs = label.split(';');
    var i,j;
    var fillin = false;
    
    for ( i = 0; i<labs.length; i++ )
    { 
      if ( ( j = labs[i].indexOf("type=")) >= 0 ) labs[i] = labs[i].substring(j+5);
      if ( labs[i].toUpperCase() == 'WORK' || typeof weblet.obj.addr == 'undefined' ) { fillin = true; break; } 
    }
    
    var vals = value.split(';');
    var p1       = ( vals.length > 0 ) ? vals[0] : "";
    var p2       = ( vals.length > 1 ) ? " " + vals[1] : "";
    var strasse  = ( vals.length > 2 ) ? vals[2] : "";
    var ort      = ( vals.length > 3 ) ? vals[3] : "";
    var plz      = ( vals.length > 5 ) ? vals[5] : "";
    
    if ( fillin )
    {
      var param = { 
        schema : 'mne_crm',
        table : 'city',
        cols : 'cityid',
        "cityInput.old" : ort,
        "postcodeInput.old" : plz,
        "sqlend" : 1
      };
      MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml",  param );
      if ( this.values.length == 0 )
        MneAjaxData.prototype.read.call(this, "/db/utils/table/insert.xml",  { schema : 'mne_crm', table : 'city', nameInput : ort, postcodeInput : plz, cityidInput: '################', sqlend : 1 } );

      MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml",  param );
    	  
      if ( this.values.length > 0 ) 
    	  this.setImport ("Adresse", { postbox : p1 + p2, street : strasse, city : ort, postcode : plz, cityid : this.values[0][0] } );
      else
    	  this.setImport ("Adresse", { postbox : p1 + p2, street : strasse, city : ort, postcode : plz } );
    }
  };

  weblet.obj.read["EMAIL"] = function(label, value)
  {
    this.setImport("Email", { email : value } );
  };

  weblet.obj.read["TEL"] = function(label, value)
  {
    var labs = label.split(';');
    var i,j;
    
    for ( i = 0; i<labs.length; i++ )
    { 
      if ( ( j = labs[i].indexOf("type=")) >= 0 ) labs[i] = labs[i].substring(j+5);
      if ( labs[i].toUpperCase() == 'WORK' || labs[i].toUpperCase() == 'VOICE')  this.setImport("Telwork",  { telwork : value } );
      if ( labs[i].toUpperCase() == 'HOME' )  this.setImport("Telhome",  { telhome : value } );
      if ( labs[i].toUpperCase() == 'CELL' )  this.setImport("Telnatel", { telnatel : value} );
    }
  };
  
  weblet.obj.read["URL"] = function(label, value )
  {
    this.setImport("Http", { http : value } );
  };
  
  weblet.obj.group = "";
  weblet.addline = function(str)
  {
    var i;
    var elements = str.split(":");
    var group,label;
    
    
    var vals = elements[0].split(";");
    if ( ( i = vals[0].indexOf('.')) >= 0 )
    {
      group = vals[0].substr(0,i-1);
      label = vals[0].substr(i + 1);
    }
    else
    {
      label = vals[0];
      group = "";
    }

    if ( typeof this.obj.read[label.toUpperCase()] != 'undefined' )
    {
      if ( group == "" || weblet.obj.group != group )
        this.obj.read[label.toUpperCase()].call(this, elements[0], elements[1], elements[2], elements[4]);
    }
    else
    {
      if ( group == "" || weblet.obj.group != group )
      {
        var r = this.obj.tables.data.add("#mne_lang#Unbekannt", elements[0], elements[1]);
        this.obj.tables.data.table.rows[r+1].cells[2].action = { weblet : this, typ : 'unbekannt', categorie : elements[0], value : elements[1] };
      }
    }

    weblet.obj.group = group;
  };
  

  weblet.showValue = function(weblet)
  {
    this.initpar.target = weblet;
    this.frame.sendframe.src = this.path + "/send.html";
  };
  
  weblet.ok = function()
  {
    var form = this.eleGetById(this.frame.sendframe.contentDocument, "fileimport");

    this.act_values = {};
    this.obj.tables.data.clearBody();
    
    if ( form != null ) form.submit();
    
    return false;
  };

}
