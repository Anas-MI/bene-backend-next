/**
 * 
 * In this pen:
 * added scripts with CDN:
 *   -  //cdnjs.cloudflare.com/ajax/libs/codemirror/5.13.4/codemirror.js
 *   -  //cdnjs.cloudflare.com/ajax/libs/codemirror/5.13.4/mode/xml/xml.js
 *   -  //cdnjs.cloudflare.com/ajax/libs/codemirror/5.13.4/mode/css/css.js
 *   -  //cdnjs.cloudflare.com/ajax/libs/codemirror/5.13.4/mode/javascript/javascript.js
 *   -  //cdnjs.cloudflare.com/ajax/libs/codemirror/5.13.4/mode/htmlmixed/htmlmixed.js
 * 
 */

var htmlEditor = CodeMirror.fromTextArea(document.getElementById("code"), {
	lineNumbers: true,
	mode: 'htmlmixed',
	// theme: 'default',
});