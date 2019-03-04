// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/offer/product/table
// ================================================================================
{
  var row;
  var btable;
  var path = weblet.path;
  
  var ivalues = 
  {
     schema : 'mne_crm',
     table  : 'offerproduct',
     idcol  : 0,
     id     : 'offerproductid',
     showid : 'offerproductid',

     calcschema : 'mne_crm',
     calcfunction : 'offerproduct_calculate',
   
     delschema : 'mne_crm',
     delfunction :'offerproduct_del',
     delcols     : 'offerproductid',
     deltyps     : ''
  }

  weblet.initDefaults(ivalues);
  weblet.loadbase('weblet/allg/table/fix', weblet);

  weblet.obj.mkbuttons.push( { id : 'up', value : unescape("%uf077"), font : 'SymbolFont1' } );
  weblet.obj.mkbuttons.push( { id : 'down', value : unescape("%uf078"), font : 'SymbolFont1' });
  weblet.obj.mkbuttons.push( { id : 'calculate', value : weblet.txtGetText("#mne_lang#Kosten berechnen"), space : 'before', show : weblet.initpar.calcfunction != '' });
  
  weblet.obj.enablebuttons.push('up');
  weblet.obj.enablebuttons.push('down');
  weblet.obj.enablebuttons.push('calculate');
  
  weblet.clickHead = function(tab) {};
  weblet.obj.tables.content.selectHead = false;
 
  weblet.showValueFix = weblet.showValue;
  
  weblet.showValue = function(weblet, param )
  {
    var enable = ( typeof weblet != 'undefined' && weblet != null && typeof weblet.act_values.closed == 'string' && weblet.act_values.closed[0] == 'f' );
    if ( typeof param == 'undefined' || param == null ) param = {};
    param.notclose = true;
    
    var retval = this.showValueFix(weblet, param);
    this.enable( enable )
    return retval && enable;
  }
  
  weblet.writesort = function()
  {
    var i;
    
    var i = null;
    var modify = false;

    this.obj.old_rownum = this.obj.tables.content.act_rownum;
    this.obj.tables.content.act_rownum = -1;
    if ( this.check_modify(this.obj.tables.content) && this.confirm("#mne_lang#Die Spalte wurde geändert - sollen die Werte geschrieben werden ?") == true )
    {
      this.ok(false, this.obj.old_rownum, false);
    }

    var len = this.obj.tables.content.getLength();
    for ( i =0; i<len; i++ )
    {
      var param = 
      {
          schema : this.initpar.schema,
          table  : this.initpar.table,
          
          positionInput : i
      };
      param[this.initpar.id + "Input.old"] = this.obj.tables.content.getData(i,this.initpar.idcol);
      
      if ( i == ( len - 1))
        param.sqlend = 1;
  
      if ( MneAjaxWeblet.prototype.write.call(this, '/db/utils/table/modify.xml', param) != 'ok' )
        return true;
    }
    this.showValue(this);
    return false;
  }

  weblet.up = function()
  {
    var len;
    len = this.obj.tables.content.getLength() - 1;
    this.obj.tables.content.up(0,len);
    return this.writesort();
  }

  weblet.down = function()
  {
    var i,len;
    len = this.obj.tables.content.getLength() - 1;
    this.obj.tables.content.down(0,len);
    return this.writesort();
  }
  
  weblet.calculate = function()
  {
    var p =
    {
        schema : this.initpar.calcschema,
        name : this.initpar.calcfunction,
        par0 : this.act_values.offerid,
        typ0 : "text",
        par1 : this.act_values.offerproducttype,
        typ1 : "text",
        sqlend : 1   
    }
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }

}
