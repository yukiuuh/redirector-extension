import { storage } from 'wxt/storage'
import { regexUrlFilter } from './utils'
const REDIRECT_SETTING_KEY = 'local:redirectSettings'
const REDIRECT_ENABLED_KEY = 'local:redirectEnabled'

export interface RedirectSetting {
    source: string
    target: string
}

export const redirectSettingsProvider = storage.defineItem<RedirectSetting[]>(REDIRECT_SETTING_KEY, { fallback: [], version: 1 })
export const redirectEnabledProvider = storage.defineItem<boolean>(REDIRECT_ENABLED_KEY, { fallback: true, version: 1 })

export async function addRedirectRule(id: number, sourceDomain: string, targetDomain: string) {
    await browser.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: id,
                action: {
                    type: browser.declarativeNetRequest.RuleActionType.REDIRECT,
                    redirect: {
                        regexSubstitution: `\\1${targetDomain}\\2`
                    }
                },
                condition: {
                    regexFilter: regexUrlFilter(sourceDomain),
                    resourceTypes: [browser.declarativeNetRequest.ResourceType.MAIN_FRAME]
                }
            }
        ]
    })
}

export const deleteAllRedirectRules = async () => {
    const rules = await browser.declarativeNetRequest.getDynamicRules()
    const ruleIds = rules.map(rule => rule.id)
    return await browser.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds })
}

export const enableAllRedirectRules = async (redirectSettings: RedirectSetting[]) => {
    redirectSettings.forEach(
        (setting, i) => {
            addRedirectRule(i + 1, setting.source, setting.target)
        }
    )
}

export const getRedirectSettingFromCSV = (csvData: string[][]): RedirectSetting[] => {
    return csvData.filter((row) => {
        if (row.length != 2) return false
        return true
    }).map(r => ({ source: r[0], target: r[1] }))
}