import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

function OptionsIndex() {
  const insecureStorageInstance = new Storage({
    area: "local",
  });

  const [apiToken, setApiToken] = useStorage(
    "apiToken",  (v) => v === undefined ? "": v)

  return (
    <div>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      <h2>This is the Option UI page!</h2>
      <input onChange={(e) => setApiToken(e.target.value)} value={apiToken} />
      <p>Api Token {apiToken == undefined ? "undefined" : apiToken}</p>
    </div>
  )
}

export default OptionsIndex