import { Toaster } from "sonner"
import RoutesList from "./routes"
import { useEffect } from "react";
const App = () => {

  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link') as HTMLLinkElement;
    }
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return (
    <>
      <RoutesList />
      <Toaster theme="dark" richColors />
    </>
  )
}

export default App
