import { WebStorageStateStore } from "oidc-client-ts"
import { AuthProviderProps } from "react-oidc-context"

export const oidcConfig: AuthProviderProps = {
  authority: KEYCLOAK_REALM_URL,
  client_id: KEYCLOAK_CLIENT_ID,
  redirect_uri: `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`,
  silent_redirect_uri: `${window.location.origin}${import.meta.env.BASE_URL}auth/silent-renew`,
  automaticSilentRenew: true,
  response_type: "code",
  scope: "openid profile email",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname)
  },
}
