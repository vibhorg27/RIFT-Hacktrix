window.onload = async () => {
    // document.getElementsByClassName("text-6xl")[0].innerText =
    //   "You son of a racist god looking monkey!";
  
    let textTags = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "span",
      "p",
      "li",
      "strong",
      "b",
      "a",
      "ul",
      "ol",
      "em",
      "strong",
      "i",
      "b",
      "a",
      "blockquote",
      "figcaption",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "th",
      "td",
      "button",
      "s",
    ];
  
    class Element {
      constructor(element) {
        this.element = element;
        this.text = element.innerText;
        this.id = element.id;
        this.sentences = this.text.split(". ");
        this.filtered = false;
        this.changed = false;
      }
      removeCurseWords() {
        chrome.storage.local.get(["inappropriate-words"], (result) => {
          try {
            if (!result["inappropriate-words"]) {
              chrome.storage.local.set(
                {
                  "inappropriate-words": [
                    "damn",
                    "fudge",
                    "darn",
                    "f**k",
                    "Flipping",
                  ],
                },
                () => {
                  console.log("Default List");
                }
              );
            } else {
              const curse_words = result["inappropriate-words"];
              this.sentences.forEach((sentence, i) => {
                for (let curse of curse_words) {
                  if (sentence.toLowerCase().includes(curse.toLowerCase())) {
                    try {
                      let index = i;
                      let cursePattern = new RegExp(curse, "gi");
                      this.sentences[index] = this.sentences[index].replace(
                        cursePattern,
                        " [[CENSORED]] "
                      );
                      this.changed = true;
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }
              });
              if (this.changed === true) {
                this.element.innerText = this.sentences.join(". ");
              }
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
      async removeToxicLanguage() {
        if (this.filtered === false) {
          for (let sentence of this.sentences) {
            if (sentence.split(" ").length > 4) {
              const response = await chrome.runtime.sendMessage({
                type: "request",
                phrase: sentence,
              });
              if (response.result.toxic === true) {
                let index = this.sentences.indexOf(sentence);
                this.sentences[index] = this.sentences[index].replace(
                  sentence,
                  " [[CENSORED]] "
                );
                this.changed = true;
              }
            }
          }
  
          if (this.changed === true) {
            this.element.innerText = this.sentences.join(". ");
          }
          this.filtered = true;
        }
      }
    }
  
    let pageElements = [];
  
    for (tag of textTags) {
      let siteTags = document.querySelectorAll(tag);
  
      for (let siteTag of siteTags) {
        let element = new Element(siteTag);
        chrome.storage.local.get(["toggles"], (result) => {
          try {
            if (result.toggles[0]) {
              element.removeCurseWords();
            }
            if (result.toggles[1]) {
              element.removeToxicLanguage();
            }
          } catch (error) {
            console.log(error);
            chrome.storage.local.set({ toggles: [true, true] }, () => {
              console.log("done");
            });
          }
        });
        pageElements.push(element);
      }
    }
  };
  