const includeHTML = () => {
  let z, i, element, file, xhttpHTML, xhttpJS;
  z = document.getElementsByTagName("import");
  for (i = 0; i < z.length; i++) {
    element = z[i];
    file = element.getAttribute("src");
    if (file) {
      xhttpHTML = new XMLHttpRequest();
      xhttpHTML.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            let isScript = false;
            for (let token of this.responseText.split(/(<script.*?>|<\x2Fscript>)/)) {
              if (/<script.*?>/.test(token)) {
                if (/src=".*?"/g.test(token)) {
                  token = token.match(/src=".*?"/)[0];
                  token = token.slice(5, -1);
                  xhttpJS = new XMLHttpRequest();
                  xhttpJS.onreadystatechange = function () {
                    if (this.readyState == 4) {
                      if (this.status == 200) {
                        let s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.src = token;
                        element.appendChild(s);
                      }
                      if (this.status == 404) { console.log(`Script ${token} not found.`); }
                    }
                  }
                  xhttpJS.open("GET", token, true);
                  xhttpJS.send();
                }
                else isScript = true;
              }
              else if (isScript) {
                isScript = false;
                let s = document.createElement('script');
                s.type = 'text/javascript';
                s.appendChild(document.createTextNode(token));
                element.appendChild(s);
              }
              else if (!/<\x2Fscript>/.test(token)) { element.innerHTML += token; }
            }
          }
          if (this.status == 404) { element.innerHTML = "Page not found."; }
          element.removeAttribute("src");
          let tag = element.getAttribute("tag");
          if (tag) {
            element.outerHTML = element.outerHTML.replace(/import/g, tag);
            element = document.querySelector(`${tag}[tag=${tag}]`);
            element.removeAttribute("tag");
          }
          includeHTML();
        }
      }
      xhttpHTML.open("GET", file, true);
      xhttpHTML.send();
      return;
    }
  }
};