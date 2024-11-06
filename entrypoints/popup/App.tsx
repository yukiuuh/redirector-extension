import { useState } from 'react';
import { CdsToggle } from '@cds/react/toggle';
import { CdsIcon } from '@cds/react/icon';
import { ClarityIcons, cogIcon } from '@cds/core/icon';
import { CdsButtonInline } from '@cds/react/button-inline';
import { deleteAllRedirectRules, enableAllRedirectRules, redirectEnabledProvider, redirectSettingsProvider } from '@/src/RedirectSetting';

ClarityIcons.addIcons(cogIcon);

function App() {
  const [redirectEnabled, setRedirectEnabled] = useState(true)
  useEffect(() => {
    redirectEnabledProvider.getValue().then(
      v => {
        setRedirectEnabled(v)
      }
    ).catch(e => {
      console.error(e)
    })
    const unwatch = redirectEnabledProvider.watch(async (newValue, oldValue) => {
      console.debug("redirectEnabled changed:", oldValue, newValue)
      setRedirectEnabled(newValue)
      const redirectSettings = await redirectSettingsProvider.getValue()
      if (newValue) {
        enableAllRedirectRules(redirectSettings)
      } else {
        deleteAllRedirectRules()
      }
    })
  }, [])

  return (
    <>
      <div cds-layout="vertical p:md gap:md">
        <div cds-layout="horizontal align:vertical-center">
          <h1 cds-text="section">Redirector</h1>
          <CdsToggle cds-layout="align:right">
            <label></label>
            <input type="checkbox" checked={redirectEnabled} onChange={() => {
              redirectEnabledProvider.setValue(!redirectEnabled)
            }} />
          </CdsToggle>
          <CdsButtonInline onClick={() => {
            browser.runtime.openOptionsPage()
          }}>
            <CdsIcon shape="cog" />
          </CdsButtonInline>
        </div>
      </div>
    </>
  );
}

export default App;
