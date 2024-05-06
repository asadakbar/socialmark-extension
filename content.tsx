import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import { useMessage } from "@plasmohq/messaging/hook"
import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  //matches: ["<all_urls>"],
  matches: ["https://www.linkedin.com/my-items/saved-posts/"],
  all_frames: true
}

const GrabData = () => {
  
  const { data } = useMessage<string, string>(async (req, res) => {
    if (req.name === "grabData") {
      console.log("inside the content script useMessage")
      //res.send(document.querySelector(req.body).textContent)

      const fetcher = SavedPostsFetcher()
      fetcher.grabData()

      //res.send("response hello");
    }
  })
  console.log("this is the data", data)

  useEffect(() => {

  })
}

export default GrabData

// ******************************************* //

function SavedPostsFetcher() {
  /*
  function init() {
    setupListeners()
  }

  function setupListeners() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.type === "grabData") { grabData() }
    });
  }
  */

  async function grabData(){
    const parentTree = document.querySelectorAll(
      "ul.reusable-search__entity-result-list",
    )[0];   

    await scrollForAllSavedItems()
    const results = extractDataFromHTML(parentTree);
    returnFetchedPosts(results)
  }
  
  async function returnFetchedPosts(posts) {

    sendToBackground({ name: "sendPosts", body: posts })
    /*
    await chrome.runtime.sendMessage({ 
      type: 'dataRetrieved',
      payload: posts
    });
    */
  }

  async function scrollForAllSavedItems() {
    let previousHeight;
    let newHeight = document.body.scrollHeight;
    do {
      previousHeight = newHeight;
      window.scrollTo(0, previousHeight);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      newHeight = document.body.scrollHeight;
    } while (previousHeight !== newHeight);
  }

  function extractDataFromHTML(parentElement) {
    const posts = parentElement.querySelectorAll(
      ".reusable-search__entity-result-list .reusable-search__result-container",
    );
    const data = [];
    posts.forEach((post) => {
      const postId = getPostId(post);
      const postContent = extractOptionalText(post, ".entity-result__content-summary", ".entity-result__summary"); 
      const postUrl = getPostUrl(post);
      const rawPostDate = getDateAndRepostInfo(post);
      const postDate = getPostDate(post);
      const dateAndRepostInfo = getDateAndRepostInfo(post);
      const mediaUrl = post.querySelectorAll("img")[1]?.currentSrc || "";
      const isMediaVideo = isVideoPost(post);

      const linkedinPosterName = post.querySelector("img").alt;
      const linkedinHeadline = extractText(post, ".entity-result__primary-subtitle");
      const linkedinProfileUrl = post.querySelector(".entity-result__title-text a").href
      const linkedinProfileImageUrl = post.querySelector("img").currentSrc;
      const linkedinRelationshipLevel = extractText(post, ".entity-result__badge-text");

      // Backend will look at dateAndRepostInfo to extract multiple pieces of data
      // date
      // isRepost
      // repostedFrom

      // Backend will look at 
      // - postersSubtitle to assess if person is company
      // - postersName is companyName if postersSubtitle mentions followers

      data.push({
        postData: {
          postContent,
          postUrl,
          postId,
          rawPostDate,
          postDate,
          dateAndRepostInfo,
          mediaUrl,
          isMediaVideo,
        },
        posterData: {
          linkedinProfileId: extractLinkedinProfileId(linkedinProfileUrl),
          linkedinPosterName,
          linkedinHeadline,
          linkedinProfileUrl,
          linkedinProfileImageUrl,
          linkedinRelationshipLevel
        }
      });
    });

    return data;
  }

  function getPostIdSlug(post) {
    const postIdSlug = post.querySelector("[data-chameleon-result-urn]").dataset.chameleonResultUrn;
    return postIdSlug
  }

  function getPostId(post) {
    const postIdSlug = getPostIdSlug(post);
    return postIdSlug.split(":")[3];
  } 

  function getPostDate(post) {
    const postId = getPostId(post);
    const asBinary = BigInt(postId).toString(2);
    const first41Chars = asBinary.slice(0, 41);
    const unixTimestamp = parseInt(first41Chars, 2);
    const dateObject = new Date(unixTimestamp);
    const humanDateFormat = dateObject.toUTCString()+" (UTC)";
    return humanDateFormat
  }

  function getDateAndRepostInfo(post) {
    return post.querySelector(".entity-result__primary-subtitle").nextElementSibling?.innerText.trim() || "";
  }

  function getPostUrl(post) {
    const baseUrl = "https://www.linkedin.com/feed/update/";
    const postIdSlug = getPostIdSlug(post);
    return `${baseUrl}${postIdSlug}`;
  }

  function isVideoPost(post) {
    return post.querySelector(".ivm-view-attr__video-icon") ? true : false;
  }

  function extractText(post, klass) {
    return post.querySelector(klass)?.innerText.trim() || "";
  }

  function extractOptionalText(post, klass, secondKlass) {
    return post.querySelector(`${klass}, ${secondKlass}`)?.innerText.trim() || "";
  }

  function extractLinkedinProfileId(url) {
    const regex = /(?:\/in\/|\/company\/)([^\/\?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  return {
    // init: init,
    grabData: grabData
  }
}

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   console.log("inside listener in content.ts")
//   console.log("this is the message object")
//   console.log(message)
//   if (message.name === "grabData") {
//     console.log("inside grabData listener in content.js")
//     console.log("This is the message", message)
//     console.log("This is the sender", sender)
//   } 

//   if (message.type === "posts" && message.payload) {
//     console.log("inside posts listener in background.js")
//     console.log("This is the message", message)
//     console.log("This is the sender", sender)
//   }
// })