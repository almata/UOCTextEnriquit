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
			// Canviem [xxx](yyy) per <a href='yyy'>xxx</a>.
			var regex = /\[(.*?)\]\((.*?)\)/g;
			tokens[i] = tokens[i].replace(regex, htmlLinkFrom);
			
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

			// Canviem # per etiquetes <span style='font-size: 18pt;'><strong> i </strong></span> segons correspongui.			
		  var header = tokens[i].split("#");
		  for (j = header.length - 1; j >= 0; j--) {
		   	if (j % 2 != 0) {
		   	 header.splice(j, 1, "<span style='font-size: 18pt;'><strong>", header[j], "</strong></span>");
		   	}
			}
		  tokens[i] = header.join("");
		}
	}

	tokens = [].concat.apply([], tokens);
	document.getElementById("second").value = tokens.join("").replace(/(?:\r\n|\r|\n)/g, "<br/>");
}

function copyToClipboard() {
	var element = document.getElementById("second");
	var range = document.createRange();
	
	element.contentEditable = true;
	element.readOnly = false;
	range.selectNodeContents(element);
	
	var selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
	
	element.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.
	
	element.contentEditable = false;
	element.readOnly = true;
	
	document.execCommand('copy');
	document.getElementById("first").focus();
}

function changeCodeColor() {
	document.getElementById("code").style.color = document.getElementById("color").value;
	createHtml();
}

function htmlLinkFrom(match) {
	var tokens = match.split(/[\[\(\)\]]/).filter(n => n != "");
	return "<a style='color: #396;' href='" + tokens[1] + "'>" + tokens[0] + "</a>";
}