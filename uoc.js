function createHtml() {
	var color = document.getElementById("color").value;
	var string = document.getElementById("first").value;
	string = string.replace(/</g, "&lt;"); // Issue #1
	
	// Canviem ` per etiquetes <span> (amb format de font, mida i color) i </span> segons correspongui.
	var tokens = string.split("`");
	for (i = tokens.length - 1; i >= 0; i--) {
		// Les tokens a considerar pels canvis són sempre les que estan en posicions senars (perquè comencem pel 0).
		// En el cas del codi font, revisarem també les tokens que no inclouen codi per si cal aplicar <strong> o <em>.
		if (i % 2 != 0) {
			tokens.splice(i, 1, "<span style='color: #" + color + "; font-family: terminal, monaco, monospace; font-size: 10pt;'>",
				tokens[i].replace(/ /g, "&nbsp;"), "</span>");
		} else {
			// Canviem ** per etiquetes <strong> i </strong> segons correspongui.
			var strong = tokens[i].split("**");
			for (j = strong.length - 1; j >= 0; j--) {
				if (j % 2 != 0) {
					strong.splice(j, 1, "<strong>", strong[j], "</strong>");					
				}
			}
			tokens[i] = strong.join("");

			// Canviem _ per etiquetes <em> i </em> segons correspongui.			
		  var em = tokens[i].split("_");
		  for (j = em.length - 1; j >= 0; j--) {
		   	if (j % 2 != 0) {
		   	 em.splice(j, 1, "<em>", em[j], "</em>");
		   	}
			}
		  tokens[i] = em.join("");
		}
	}

	tokens = [].concat.apply([], tokens);
	document.getElementById("second").value = tokens.join("").replace(/(?:\r\n|\r|\n)/g, "<br/>");
}

function copyToClipboard() {
	var element = document.getElementById("second");
	element.contentEditable = true;
	element.readOnly = false;
	element.select();
	document.execCommand("copy");
	document.getElementById("first").focus();
	element.contentEditable = false;
	element.readOnly = true;
}
