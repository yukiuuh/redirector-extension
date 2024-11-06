import { deleteAllRedirectRules, enableAllRedirectRules, redirectEnabledProvider, RedirectSetting, redirectSettingsProvider } from "@/src/RedirectSetting";
import Papa from "papaparse";

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

export const parseRedirectSettingsToCsv = (redirectSettings: RedirectSetting[]) => {
  return Papa.unparse(redirectSettings, { header: false, quotes: true })
}

export const exportRedirectSettings = (redirectSettings: RedirectSetting[]) => {
  try {
    const blob = new Blob([parseRedirectSettingsToCsv(redirectSettings)], { type: "application/json" })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "redirector.csv"

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Export Error:", error)
  }
}
