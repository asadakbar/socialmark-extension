import { useEffect, useState } from "react"

import { sendToContentScript } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

function IndexPopup() {
  const [currentTab, setCurrentTab] = useState(null)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentTab(tabs[0])
    })
  }, [])

  const [apiToken] = useStorage("apiToken")

  const handleScrapePostClick = () => {
    console.log("inside handleClick")
    console.log("This is the tab", currentTab)
    sendToContentScript({ name: "grabData", body: "request hello" }).then(
      (data) => {
        console.log("this is the data", data)
      }
    )
    //chrome.tabs.sendMessage(currentTab.id, { type: "grabData" })
    console.log("endof handleScrapePostClick")
  }

  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>
        Welcome to Socialmark{" "}
        <a href="https://www.plasmo.com" target="_blank">
          Socialmark
        </a>{" "}
        Extension!
      </h2>
      <p>ApiToken:{
        apiToken == undefined ? "undefined" : apiToken
      }</p>
      {apiToken ? (
        <>
          <button onClick={handleScrapePostClick}>Upload Saved Posts</button>
        </>
      ) : (
        <>
          <h3>Please enter your api token in the extension options</h3>
          <a href="/options.html" target="_blank">
            Extension Options
          </a>
        </>
      )}
      <br />
      <br />
      Your Token:
      {apiToken ? (
        " Saved"
      ) : (
        <a href="/options.html" target="_blank">
          Enter Here
        </a>
      )}{" "}
    </div>
  )
}

export default IndexPopup
