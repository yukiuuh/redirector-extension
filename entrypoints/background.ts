import { deleteAllRedirectRules, enableAllRedirectRules, redirectEnabledProvider, redirectSettingsProvider } from "@/src/RedirectSetting";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason != browser.runtime.OnInstalledReason.INSTALL) return
    const INITIAL_SETTINGS = [
      { source: "example.com", target: "example.org" }
    ]
    redirectSettingsProvider.setValue(INITIAL_SETTINGS).then(
      () => {
        deleteAllRedirectRules().then(
          () => {
            enableAllRedirectRules(INITIAL_SETTINGS)
          }
        )
      }
    )
  })

  redirectSettingsProvider.watch(async (newValue, oldValue) => {
    console.debug("redirectSettings changed:", oldValue, newValue)
    if (await redirectEnabledProvider.getValue()){
      await deleteAllRedirectRules()
      await enableAllRedirectRules(newValue)
    }
  })
});
