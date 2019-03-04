// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/weblet/detail
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      nameInput     : { checktype : weblet.inChecktype.alphanum },
      templateInput : { checktype : weblet.inChecktype.dir   },
      mysql         : {}
  }
  weblet.findIO(attr);
  weblet.showLabel();
  
  weblet.showids = new Array("htmlcomposeid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#neues Weblet");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Weblet bearbeiten");
      
  weblet.ok = function()
  {
    var i;
    var p = {};
    var action;
    var result;
    
    if ( this.okaction == 'add' ) action = "/db/utils/table/insert.xml";
    else action = "/db/utils/table/modify.xml";

    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  'htmlcompose');
    
    p = this.addParam(p, "htmlcomposeidInput.old", this.obj.inputs.htmlcomposeid);
    p = this.addParam(p, "htmlcomposeid");
    p = this.addParam(p, "name");
    p = this.addParam(p, "template");
    p = this.addParam(p, "custom");
    
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );

    result = MneAjaxWeblet.prototype.write.call(this, action,  p );
    if ( result != 'ok')
    {
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {rollback: "true"} );
      return true;
    }
    
    p = {};
    
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  'htmlcomposenames');

    p = this.addParam(p, "htmlcomposeidInput.old", this.act_values.htmlcomposeid);
    p = this.addParam(p, "htmlcomposeidInput", this.act_values.htmlcomposeid);
    p = this.addParam(p, "label_en");
    p = this.addParam(p, "label_de");
    
    p = this.addParam(p, "sqlend", 1);
   
    result = MneAjaxWeblet.prototype.write.call(this, action,  p );
    if ( result == 'ok' )
    {
      this.showValue(this);
      this.setDepends('add');
      return false;
    }
    return true;
  }

  weblet.del = function()
  {
    var i;
    var p = {};
    var result;
    
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );

    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  'htmlcomposetabslider');
    p = this.addParam(p, "htmlcomposeidInput.old", this.act_values.htmlcomposeid);

    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok')
    {
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {rollback: "true"} );
      return true;
    }
    
    p.table = 'htmlcomposetabselect';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok')
    {
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {rollback: "true"} );
      return true;
    }
    
    p.table = 'htmlcomposetabnames';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok')
    {
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {rollback: "true"} );
      return true;
    }
    
    p.table = 'htmlcomposetab';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok')
    {
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {rollback: "true"} );
      return true;
    }

    p.table = 'htmlcomposenames';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok')
    {
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {rollback: "true"} );
      return true;
    }

    p.table = 'htmlcompose';
    p = this.addParam(p, "sqlend", 1);
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    
    if ( result == 'ok' )
    {
      this.add();
      this.setDepends('del');
      return false;
    }
    return true;
  }
  
  weblet.export = function()
  {
    var ajax = new MneAjaxData(this.win);
    var p = {};
    var i;
    var str = '';
    var mysql = this.frame.mysql.checked;
    var format;
    
    p = this.addParam(p, "htmlcomposeidInput.old", this.act_values.htmlcomposeid);
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "sqlend", "1");
    p = this.addParam(p, "table",  'htmlcompose');
    p = this.addParam(p, "cols", "createdate,createuser,modifydate,modifyuser,htmlcomposeid,name,template,custom");
    ajax.read("/db/utils/table/data.xml", p);
    
    for ( i = 0; i < ajax.values.length; i++ )
    {
      if ( mysql ) format = "INSERT INTO mne_application_htmlcompose( createdate, createuser, modifydate, modifyuser, htmlcomposeid, name, template, custom) VALUES ($1, '$2', $3, '$4', '$5', '$6', '$7', $8);";
      else format = "INSERT INTO mne_application.htmlcompose( createdate, createuser, modifydate, modifyuser, htmlcomposeid, name, template, custom) VALUES ($1, E'$2', $3, E'$4', E'$5', E'$6', E'$7', $8);";
      
      str = this.txtSprintf(format, this.txtMascarade_single(ajax.values[i][0],"'", "\\'"), this.txtMascarade_single(ajax.values[i][1],"'", "\\'"), this.txtMascarade_single(ajax.values[i][2],"'", "\\'"), this.txtMascarade_single(ajax.values[i][3],"'", "\\'"), this.txtMascarade_single(ajax.values[i][4],"'", "\\'"), this.txtMascarade_single(ajax.values[i][5],"'", "\\'"), this.txtMascarade_single(ajax.values[i][6],"'", "\\'"), (ajax.values[i][7])[0] != 'f' ) + '\n';
    }

    p.table = 'htmlcomposenames';
    p.cols = "createdate,createuser,modifydate,modifyuser,htmlcomposeid,label_de,label_en";
    ajax.read("/db/utils/table/data.xml", p);
    
    for ( i = 0; i < ajax.values.length; i++ )
    {
      if ( mysql ) format = "INSERT INTO mne_application_htmlcomposenames ( createdate, createuser, modifydate, modifyuser, htmlcomposeid, label_de, label_en) VALUES ($1, '$2', $3, '$4', '$5', '$6', '$7');";
      else format = "INSERT INTO mne_application.htmlcomposenames ( createdate, createuser, modifydate, modifyuser, htmlcomposeid, label_de, label_en) VALUES ($1, E'$2', $3, E'$4', E'$5', E'$6', E'$7');";
      str += this.txtSprintf(format, this.txtMascarade_single(ajax.values[i][0],"'", "\\'"), this.txtMascarade_single(ajax.values[i][1],"'", "\\'"), this.txtMascarade_single(ajax.values[i][2],"'", "\\'"), this.txtMascarade_single(ajax.values[i][3],"'", "\\'"), this.txtMascarade_single(ajax.values[i][4],"'", "\\'"), this.txtMascarade_single(ajax.values[i][5],"'", "\\'"), this.txtMascarade_single(ajax.values[i][6],"'", "\\'")) + '\n';
    }

    p.table = 'htmlcomposetab';
    p.cols = "createdate,createuser,modifydate,modifyuser,htmlcomposeid,htmlcomposetabid,path,id,subposition,position,initpar,owner,depend,loadpos,ugroup,custom";
    ajax.read("/db/utils/table/data.xml", p);
    
    for ( i = 0; i < ajax.values.length; i++ )
    {
      if ( mysql ) format = "INSERT INTO mne_application_htmlcomposetab( createdate, createuser, modifydate, modifyuser, htmlcomposeid, htmlcomposetabid, path, id, subposition, position, initpar, owner, depend, loadpos, ugroup, custom) VALUES ($1, '$2', $3, '$4', '$5', '$6', '$7', '$8', '$9', $10, '$11', '$12', '$13', '$14', $15, $16);";
      else format = "INSERT INTO mne_application.htmlcomposetab( createdate, createuser, modifydate, modifyuser, htmlcomposeid, htmlcomposetabid, path, id, subposition, \"position\", initpar, owner, depend, loadpos, ugroup, custom) VALUES ($1, E'$2', $3, E'$4', E'$5', E'$6', E'$7', E'$8', E'$9', $10, E'$11', E'$12', E'$13', E'$14', $15, $16);";
      str += this.txtSprintf(format, this.txtMascarade_single(ajax.values[i][0],"'", "\\'"), this.txtMascarade_single(ajax.values[i][1],"'", "\\'"), this.txtMascarade_single(ajax.values[i][2],"'", "\\'"), this.txtMascarade_single(ajax.values[i][3],"'", "\\'"), this.txtMascarade_single(ajax.values[i][4],"'", "\\'"), this.txtMascarade_single(ajax.values[i][5],"'", "\\'"), this.txtMascarade_single(ajax.values[i][6],"'", "\\'"), this.txtMascarade_single(ajax.values[i][7],"'", "\\'"), this.txtMascarade_single(ajax.values[i][8],"'", "\\'"), this.txtMascarade_single(ajax.values[i][9],"'", "\\'"), this.txtMascarade_single(ajax.values[i][10],"'","\\'"), this.txtMascarade_single(ajax.values[i][11],"'","\\'"), this.txtMascarade_single(ajax.values[i][12],"'","\\'"), this.txtMascarade_single(ajax.values[i][13],"'","\\'"), this.txtMascarade_single(ajax.values[i][14],"'","\\'"), (ajax.values[i][15])[0] != 'f') + '\n';
    }

    p.table = 'htmlcomposetabnames';
    p.cols = "createdate,createuser,modifydate,modifyuser,htmlcomposeid,label_de,label_en,htmlcomposetabid,custom";
    ajax.read("/db/utils/table/data.xml", p);
    
    for ( i = 0; i < ajax.values.length; i++ )
    {
      if ( mysql ) format = "INSERT INTO mne_application_htmlcomposetabnames ( createdate, createuser, modifydate, modifyuser, htmlcomposeid, label_de, label_en, htmlcomposetabid, custom) VALUES ($1, '$2', $3, '$4', '$5', '$6', '$7', '$8', $9);";
      else format = "INSERT INTO mne_application.htmlcomposetabnames ( createdate, createuser, modifydate, modifyuser, htmlcomposeid, label_de, label_en, htmlcomposetabid, custom) VALUES ($1, E'$2', $3, E'$4', E'$5', E'$6', E'$7', E'$8', $9);";
      str += this.txtSprintf(format, this.txtMascarade_single(ajax.values[i][0],"'", "\\'"), this.txtMascarade_single(ajax.values[i][1],"'", "\\'"), this.txtMascarade_single(ajax.values[i][2],"'", "\\'"), this.txtMascarade_single(ajax.values[i][3],"'", "\\'"), this.txtMascarade_single(ajax.values[i][4],"'", "\\'"), this.txtMascarade_single(ajax.values[i][5],"'", "\\'"), this.txtMascarade_single(ajax.values[i][6],"'", "\\'"), this.txtMascarade_single(ajax.values[i][7],"'", "\\'"), (ajax.values[i][8])[0] != 'f') + '\n';
    }

    p.table = 'htmlcomposetabselect';
    p.cols = "createdate,createuser,modifydate,modifyuser,id,element,htmlcomposeid,htmlcomposetabid,htmlcomposetabselectid,schema,query,tab,wop,wcol,wval,scols,showcols,cols,weblet,showdynpar,custom,selval";
    ajax.read("/db/utils/table/data.xml", p);
    
    for ( i = 0; i < ajax.values.length; i++ )
    {
      if ( mysql ) format = "INSERT INTO mne_application_htmlcomposetabselect( createdate, createuser, modifydate, modifyuser, id, element, htmlcomposeid, htmlcomposetabid, htmlcomposetabselectid, schema, query, tab, wop, wcol, wval, scols, showcols, cols, weblet, showdynpar, custom, selval) VALUES ($1, '$2', $3, '$4', '$5', '$6', '$7', '$8', '$9', '$10', '$11', '$12', '$13', '$14', '$15', '$16', '$17', '$18', $19, '$20', $21, E'$22');";
      else format = "INSERT INTO mne_application.htmlcomposetabselect( createdate, createuser, modifydate, modifyuser, id, element, htmlcomposeid, htmlcomposetabid, htmlcomposetabselectid, schema, query, tab, wop, wcol, wval, scols, showcols, cols, weblet, showdynpar, custom, selval) VALUES ($1, E'$2', $3, E'$4', E'$5', E'$6', E'$7', E'$8', E'$9', E'$10', E'$11', E'$12', E'$13', E'$14', E'$15', E'$16', E'$17', E'$18', E'$19', E'$20', $21, E'$22');";
      str += this.txtSprintf(format, this.txtMascarade_single(ajax.values[i][0],"'", "\\'"),
                                       this.txtMascarade_single(ajax.values[i][1],"'", "\\'"),
                                       this.txtMascarade_single(ajax.values[i][2],"'", "\\'"),
                                        this.txtMascarade_single(ajax.values[i][3],"'", "\\'"),
                                        this.txtMascarade_single(ajax.values[i][4],"'", "\\'"),
                                        this.txtMascarade_single(ajax.values[i][5],"'", "\\'"),
                                        this.txtMascarade_single(ajax.values[i][6],"'", "\\'"),
                                        this.txtMascarade_single(ajax.values[i][7],"'", "\\'"),
                                        this.txtMascarade_single(ajax.values[i][8],"'", "\\'"),
                                        this.txtMascarade_single(ajax.values[i][9],"'", "\\'"),
                                        this.txtMascarade_single(ajax.values[i][10],"'","\\'"),
                                        this.txtMascarade_single(ajax.values[i][11],"'","\\'"),
                                        this.txtMascarade_single(ajax.values[i][12],"'","\\'"),
                                        this.txtMascarade_single(ajax.values[i][13],"'","\\'"),
                                        this.txtMascarade_single(ajax.values[i][14],"'","\\'"),
                                        this.txtMascarade_single(ajax.values[i][15],"'","\\'"),
                                        this.txtMascarade_single(ajax.values[i][16],"'","\\'"),
                                        this.txtMascarade_single(ajax.values[i][17],"'","\\'"),
                                        this.txtMascarade_single(ajax.values[i][18],"'","\\'"),
                                        this.txtMascarade_single(ajax.values[i][19],"'","\\'"),
                                        ajax.values[i][20],
                                        this.txtMascarade_single(ajax.values[i][21],"'","\\'") ) + '\n';
    }

    p.table = 'htmlcomposetabslider';
    p.cols = "createdate,createuser,modifydate,modifyuser,htmlcomposeid,slidername,sliderpos,custom";
    ajax.read("/db/utils/table/data.xml", p);
    
    for ( i = 0; i < ajax.values.length; i++ )
    {
      if ( mysql ) format = "INSERT INTO mne_application.htmlcomposetabslider ( createdate, createuser, modifydate, modifyuser, htmlcomposeid, slidername, sliderpos, custom) VALUES ($1, '$2', $3, '$4', '$5', '$6', '$7', $8);";
      else format = "INSERT INTO mne_application.htmlcomposetabslider ( createdate, createuser, modifydate, modifyuser, htmlcomposeid, slidername, sliderpos, custom) VALUES ($1, E'$2', $3, E'$4', E'$5', E'$6', E'$7', $8);";
      str += this.txtSprintf(format, this.txtMascarade_single(ajax.values[i][0],"'", "\\'"), this.txtMascarade_single(ajax.values[i][1],"'", "\\'"), this.txtMascarade_single(ajax.values[i][2],"'", "\\'"), this.txtMascarade_single(ajax.values[i][3],"'", "\\'"), this.txtMascarade_single(ajax.values[i][4],"'", "\\'"), this.txtMascarade_single(ajax.values[i][5],"'", "\\'"), this.txtMascarade_single(ajax.values[i][6],"'", "\\'"), (ajax.values[i][7])[0] != 'f') + '\n';
    }

    var s = str.split('\n');
    for ( i = (s.length - 1); i >= 0; i--)
      this.message(s[i], true)
    return false;
  }
}
