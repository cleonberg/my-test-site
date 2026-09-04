import React from "react";
import { signInWithGooglePopup, signInWithGoogleRedirect, signOutUser } from "../auth";

export default function GoogleSignIn({ useRedirect = false }) {
  return (
    <div>
      <button onClick={() => (useRedirect ? signInWithGoogleRedirect() : signInWithGooglePopup())}>
        Sign in with Google
      </button>
      <button onClick={() => signOutUser()}>Sign out</button>
    </div>
  );
}
