(function($) {
			
function getDocumentID() {
  var m = document.URL.match("/node/([0-9]+)")
  if (m && m[1]) {
    return m[1];
  } else
  return Math.random();
}

function generateDocName(id, params) {
  if (params.field.match("edit-field-"))
    return "doc"+id+params.field; 
  else
    return "doc"+id+Math.random();
}

/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.ace = function(context, params, settings) {
  // Attach editor.
  var editorID = "#"+params.field;
  var mode = "";
  var toolbardiv, editordiv, editorwrapper;
  cSettings = {
  	"mode" : "latex",
  	"ShareJS" : false,
  };
  
  if (typeof settings["enabled"]!="undefined") {
  	for (var i=0; i<settings["enabled"].length; ++i) {
  	  t = settings["enabled"][i].split("_");
  	  cSettings[t[0]]=t[1];
  	}
  }

  $(editorID).each(function (c, obj) {
  	jQuery(obj).hide();
  	  
  	editordiv = jQuery("<div>").attr("id","ace_"+params.field).attr("style"," height:400px; position:relative");
	  
  	jQuery(obj).after(editordiv);
  	var editor = ace.edit("ace_"+params.field);
	  editor.getSession().setValue(obj.value);
	  editor.setTheme("ace/theme/textmate");
	  editor.getSession().setMode("ace/mode/"+cSettings["mode"]);
    window.editor = editor;

    require.config({ baseUrl: Drupal.settings.editor_tools.editor_tools_path }),

    require(["editor_tools/main"], function(main) {
      handlers = main.enrich_editor(editor, "#ace_"+params.field, {root_path: Drupal.settings.editor_tools.editor_tools_path+"/"});

      toolbar = handlers.toolbar;
      interpretter = handlers.interpretter;
      
      jQuery.get(Drupal.settings.editor_tools.editor_tools_path+"/macros/menu_layout.json", function (data) {
        toolbar.loadLayout(JSON.parse(data));
        jQuery(handlers.header).find(".ribbon").ribbon(); 
      });

      jQuery.get(Drupal.settings.editor_tools.editor_tools_path+"/macros/preferences.json", function (data) {
        interpretter.loadAPI(JSON.parse(data));
        jQuery(handlers.header).find(".ribbon").ribbon(); 
      });
    });
	  jQuery.data(obj, 'editor', editor);
  });
};

/**
 * Detach a single or all editors.
 *
 * See Drupal.wysiwyg.editor.detach.none() for a full desciption of this hook.
 */
Drupal.wysiwyg.editor.detach.ace = function(context, params) {
  if (typeof params != 'undefined') {
    var editorID = "#"+params.field;
    $(editorID).each(function (c, obj) {
    	var editor = jQuery.data(obj, 'editor');
    	if (editor != null) {
    		obj.value = editor.getSession().getValue()  
        	jQuery.data(obj, 'editor', null);
        	jQuery("#ace_"+params.field).remove();
        }
    	jQuery(obj).show();
    });
  }
};

})(jQuery);
