// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
window.MneEditArea = function (win, eframe, output)
{
    this.win = win;
    this.eframe = eframe;
    this.frame = win.document.getElementById(this.eframe);

    this.plugins = new Array();

    this.show = function(loadReady)
    {
    var e;
    
    e = win.document.getElementById(this.eframe);
    
    if ( typeof this.iframe != 'undefined' )
      this.iframe.parentNode.removeChild(this.iframe);
      
    this.iframe = this.win.document.createElement("iframe");
    
    if ( typeof this.win.editearea_parameter == 'undefined' )
      this.win.editarea_parameter = new Array();
    
    this.win.editarea_parameter[this.eframe] = new Object;

    this.win.editarea_parameter[this.eframe].loadReady = loadReady;
    this.win.editarea_parameter[this.eframe].editor = this;

    this.iframe.height = e.offsetHeight - 2 + "px";
    this.iframe.width  = e.offsetWidth - 2 + "px";
    
    this.iframe.setAttribute("border", "0");
    this.iframe.setAttribute("frameBorder", "0");
    this.iframe.setAttribute("marginWidth", "0");
    this.iframe.setAttribute("marginHeight", "0");
    this.iframe.setAttribute("leftMargin", "0");
    this.iframe.setAttribute("topMargin", "0");
    this.iframe.setAttribute("topMargin", "0");
    this.iframe.src = "/allg/main/editarea/main.html?name=" + this.eframe;
    e.appendChild(this.iframe);
    this.iframe.contentWindow.name = this.eframe;
    
    {
        var self = this;
        var timeout = function() { self.resize.call(self); };
        window.setTimeout(timeout, 0);
    }
    
    };
    
    this.resize = function()
    {
      this.iframe.height = this.frame.offsetHeight - 2 + "px";
      this.iframe.width  = this.frame.offsetWidth - 2 + "px";
    };
    
    
    this.setText = function(text)
    {
      this.iframe.contentWindow.editor.setValue(text);
      this.iframe.contentWindow.editor.clearSelection();
      this.iframe.contentWindow.editor.moveCursorTo(0,0);
    };

    this.getText = function()
    {
      return this.iframe.contentWindow.editor.getValue();
    };
};
