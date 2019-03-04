// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/orderproducttime/table/filter
// ================================================================================
{
  var i;
  var str;

  var attr =
  {
      wproductnameInput : { func : 'refresh' }
  };

  weblet.findIO(attr, weblet.frame, weblet.obj.whereframe, true);

  weblet.refresh = function(weblet)
  {
    var p = this.getFilter();
    p.no_vals = false;
    p.no_setvalues = true;
    this.showValueBase(this, p);
    return false;
  };

  weblet.getFilter = function(pp)
  {
    var p = pp;
    var sep = '';

    if ( typeof p == 'undefined' || p == null ) p = {};

    p.wcol = '';
    p.wop  = '';
    p.wval = '';

    if ( this.obj.inputs.wproductname.value != '' )
    {
      p.wcol += sep + "productname";
      p.wop  += sep + "like";
      p.wval += sep + this.obj.inputs.wproductname.value + '%';
      sep = ",";
    }

    if ( this.obj.inputs.wnosum.checked == true )
    {
      p.wcol += sep + "rowtyp";
      p.wop  += sep + "=";
      p.wval += sep + "1";
      sep = ",";
    }

    return p;
  };
}
