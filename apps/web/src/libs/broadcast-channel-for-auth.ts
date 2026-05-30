import { useAuthStore } from "@/stores/auth-store"

const AUTH_LOGOUT_BROADCAST = 'servexa-warranty-auth-logout'

let logoutBroadcastAttached = false

export function postLogoutBroadcast(): void {
  if (typeof BroadcastChannel === 'undefined') {
    return
  }
  const channel = new BroadcastChannel(AUTH_LOGOUT_BROADCAST)
  channel.postMessage('logout')
  channel.close()
}

export function attachLogoutBroadcastListener(): void {
  if (typeof BroadcastChannel === 'undefined' || logoutBroadcastAttached) {
    return
  }
  logoutBroadcastAttached = true
  const channel = new BroadcastChannel(AUTH_LOGOUT_BROADCAST)
  channel.addEventListener('message', (event) => {
    if (event.data === 'logout') {
      void useAuthStore.getState().auth.logout({ skipBroadcast: true })
    }
  })
}
