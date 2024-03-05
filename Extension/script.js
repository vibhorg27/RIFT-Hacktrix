window.onload = function () {
    chrome.storage.local.get(["toggles"], (result) => {
      document.getElementById("harmfulLanguage").checked = result.toggles[0];
      document.getElementById("toxicity").checked = result.toggles[1];
    });
    chrome.storage.local.get(["inappropriate-words"], (result) => {
      try {
        if (!result["inappropriate-words"]) {
          chrome.storage.local.set(
            {
              "inappropriate-words": [
                "damn",
                "fudge",
                "darn",
                "Flipping",
              ],
            },
            () => {
              console.log("Default List");
            }
          );
        } else {
          document.getElementById("inappropriate-words").value =
            result["inappropriate-words"].join(",");
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  
  const checkSettings = document.querySelector("#checkSettings");
  
  checkSettings.addEventListener("click", (event) => {
    let checkboxes = document.querySelectorAll('input[name="toggle"]');
    let values = [];
    checkboxes.forEach((checkbox) => {
      values.push(checkbox.checked);
    });
    chrome.storage.local.set({ toggles: values }, () => {
      document.getElementById("success").innerText = "Successfully Saved";
    });
    chrome.storage.local.set(
      {
        "inappropriate-words": document
          .getElementById("inappropriate-words")
          .value.split(","),
      },
      () => {
        document.getElementById("success").innerText = "Successfully Saved";
      }
    );
  });
  