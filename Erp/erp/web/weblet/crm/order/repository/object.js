// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/order/repository
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
      schema    : 'mne_repository',
      query     : 'repository',

      repmod : 'repository_admin',
      repnew : 'crm_orderrepnew',
      name   : 'crm_orderrepnew',

      templ    : '/templ/allg/h',
      templmap : { detail : 'detail' },

      templnew    : '/templ/allg/h',
      templmapnew : { detail : 'detail' },

      templmod    : '/templ/crm/order/repository',
      templmapmod : { detail : 'detail', bottom : 'bottom' },

      showdynpar : { "refidInput.old" : 'orderid' },
      showdynparweblet : 'detail',

      mainweblet : 'detail',
      
      initparsub : { detail : 'views : true, showtitle : false, inputlist_ignore_notdefined : true', files : 'loaddirect : false', send : 'loaddirect : true'}

  };

  var svalues = 
  {
  };


  weblet.initDefaults(ivalues, svalues);
  weblet.loadbase("weblet/allg/subweblet", weblet);

  weblet.showValueSubweblet = weblet.showValue
  weblet.showValue = function(weblet)
  {
    var i;
    if ( weblet == null ) return;

    MneAjaxWeblet.prototype.showValue.call(this, weblet, {ignore_notfound : true });

    for ( i in weblet.act_values )
      this.act_values[i] = weblet.act_values[i];
      
    if ( this.values.length == 0 )
    {
      if ( this.initpar.name != this.initpar.repnew )
      {
        this.initpar.name = this.initpar.repnew;
        this.initpar.templ = this.initpar.templnew;
        this.initpar.templmap = this.initpar.templmapnew;

        this.reload = true;
        this.load(this.id);
        this.setDepends('load');
      }
      else
      {
        var v = { act_values : {} };
        for ( i in this.act_values )
          v.act_values[i] = this.act_values[i];

        this.showValueSubweblet( v );
      }
    }
    else
    {
      if ( this.initpar.name != this.initpar.repmod )
      {
        this.initpar.name = this.initpar.repmod;
        this.initpar.templ = this.initpar.templmod;
        this.initpar.templmap = this.initpar.templmapmod;

        this.reload = true;
        this.load(this.id);
        this.setDepends('load')
      }
      else
      {
        var v = { act_values : {} };
        for ( i in this.act_values )
          v.act_values[i] = this.act_values[i];

        this.showValueSubweblet( v );
      }

    }
  }    
}
