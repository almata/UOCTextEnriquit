function createHtml() {
	var color = document.getElementById("color").value;
	var string = document.getElementById("first").value;
	string = string.replace(/</g, "&lt;"); // Issue #1
	
	// Comencem dividint el text per etiquetes ` (les que delimiten codi font).
	var tokens = string.split("`");
	for (i = tokens.length - 1; i >= 0; i--) {
		if (i % 2 != 0) {
			// A les posicions senars hi ha codi font.
			tokens.splice(i, 1, "<span style='color: #" + color + "; font-family: terminal, monaco, monospace; font-size: 10pt;'>",
				tokens[i].replace(/ /g, "&nbsp;"), "</span>");
		} else {
			// A les posicions parells hi ha tot el que no és codi font.
			tokens[i] = translateNonCodeTags(tokens[i]);
		}
	}

	document.getElementById("second").value = tokens.join("").replace(/(?:\r\n|\r|\n)/g, "<br/>");
}

function translateNonCodeTags(input) {
	var regex = /\[(.*?)\]\((.*?)\)/g;
	var tokens = input.split(regex);
	
	// Si hi ha enllaços, les tokens segueixen aquest ordre:
	// 0 el que hi ha abans del primer enllaç
	// 1 text del primer enllaç
	// 2 url del primer enllaç
	// 3 el que segueix al primer enllaç
	// 4 text del segon enllaç
	// (etc)
	if (tokens[0] == input) {
		return translateSimpleTags(input);
	} else {
		var output = "";
		var i = 0;
		while (i < tokens.length - 1) {
			output += translateSimpleTags(tokens[i]);
			output += htmlLink(tokens[i + 1], tokens[i + 2]);
			i += 3;
		}
		output += translateSimpleTags(tokens[i]);
		return output;
	}
}

function translateSimpleTags(text) {
	text = translateTag(text, "**", "<strong>", "</strong>");
	text = translateTag(text, "_", "<em>", "</em>");
	text = translateTag(text, "#", "<span style='font-size: 18pt;'><strong>", "</strong></span>");	
	return text;
}

function translateTag(token, mark, openingTag, closingTag) {
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

function htmlLink(text, url) {
	return "<a style='color: #396;' href='" + url + "'>" + text + "</a>";
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
