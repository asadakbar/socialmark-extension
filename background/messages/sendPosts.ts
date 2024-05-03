import { Storage } from "@plasmohq/storage"
//import { SecureStorage } from "@plasmohq/storage/secure"

const handler = async (req, res) => {
  const storage = new Storage()
  // const storage = new SecureStorage()
  // storage.setPassword("password");

  console.log("Inside SendPosts background message function")
  console.log("This is the req.body", req.body)
  const endpointUrl = "http://localhost:3000/api/v1/saved_posts"
  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + await storage.get("apiToken")
    },
    body: JSON.stringify({ posts: req.body }),
  });

  res.send(response);
}

export default handler;