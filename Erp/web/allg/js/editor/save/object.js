// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorSave(editor, param)
{
  // ================================================
  // Buttons
  // =================================================  

  if ( typeof param.save != 'function' || typeof editor.save == 'function')
    param.save = function () { this.editor = editor; this.editor.save(); }
  
  if ( typeof param.save == 'function' )
  {
    editor.buttons.saveButton   = editor.buttons.newButton(param, "save.gif",  param.save, "#mne_lang#Sicher");
    if ( param.pos != 0 ) editor.buttons.newSeperator(param);
  }
}