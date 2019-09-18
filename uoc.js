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
			var temp = tokens[i];
			tokens[i] = tokens[i].replace(regex, htmlLinkFrom);
			if (tokens[i] != temp) { continue };
			
			// Canviem ** per etiquetes <strong> i </strong>.
			tokens[i] = addTags(tokens[i], "**", "<strong>", "</strong>");

			// Canviem _ per etiquetes <em> i </em>.
			tokens[i] = addTags(tokens[i], "_", "<em>", "</em>");

			// Canviem # per etiquetes <span><strong>.
			tokens[i] = addTags(tokens[i], "#", "<span style='font-size: 18pt;'><strong>", "</strong></span>");
		}
	}

	tokens = [].concat.apply([], tokens);

	document.getElementById("second").value = tokens.join("").replace(/(?:\r\n|\r|\n)/g, "<br/>");
	console.warn(copyToClipboard());
}

function addTags(token, mark, openingTag, closingTag) {
	var parts = token.split(mark);
	for (j = parts.length - 1; j >= 0; j--) {
		if (j % 2 != 0) {
			parts.splice(j, 1, openingTag, parts[j], closingTag);					
		}
	}
	return parts.join("");
}

function changeCodeColor() {
	document.getElementById("code").style.color = document.getElementById("color").value;
	createHtml();
}

function htmlLinkFrom(match) {
	var tokens = match.split(/[\[\(\)\]]/).filter(n => n != "");
	return "<a style='color: #396;' href='" + tokens[1] + "'>" + tokens[0] + "</a>";
}

function copyToClipboard() {
	var text = document.getElementById("second").value;
	
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text); 

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
		textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
			document.body.removeChild(textarea);
			document.getElementById("first").focus();
        }
	}
	
}