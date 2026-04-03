import { Redirect } from "expo-router";

export default function IndexScreen() {
  const isLoggedIn = true; // later API / token se aayega

  return <Redirect href={isLoggedIn ? "/home" : "/signup"} />;
}
