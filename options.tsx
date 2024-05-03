import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
//import { SecureStorage } from "@plasmohq/storage/secure"

function OptionsIndex() {
  //const secureStorageInstance = new SecureStorage({
    //area: "local"
  //})
  const insecureStorageInstance = new Storage({
    area: "local",
  });

  // secureStorageInstance.setPassword("password")

  const [apiToken, setApiToken] = useStorage({
    key: "apiToken",
    instance: insecureStorageInstance,
  })

  return (
    <div>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      <h2>This is the Option UI page!</h2>
      <input onChange={(e) => setApiToken(e.target.value)} value={apiToken} />
    </div>
  )
}

export default OptionsIndex