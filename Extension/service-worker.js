chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message from content script");
    
    if (request.phrase) {
      (async () => {
        const res = await (
          await fetch("http://127.0.0.1:8000/removeToxic", {
            method: "POST",
            
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({
              sentence_for_analysis: request.phrase,
            }),

          })
        ).json();
        sendResponse({ type: "response", result: res });
      })();
  


      return true;
    }
  });
  
  // const respond = async (response) => {
  //   const [tab] = await chrome.tabs.query({
  //     active: true,
  //     lastFocusedWindow: true,
  //   });
  //   await chrome.tabs.sendMessage(tab.id, { type: "response", result: response });
  // };
  