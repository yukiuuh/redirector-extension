import { ClarityIcons, cogIcon } from '@cds/core/icon';
import { Datagrid } from './components/Datagrid';
import { CdsButtonInline } from '@cds/react/button-inline';
import { uniqueFilter } from '@/src/utils';
import { RedirectSetting, redirectSettingsProvider } from '@/src/RedirectSetting';
import { ImportModal } from './components/ImportModal';
import { Header } from './components/Header';

ClarityIcons.addIcons(cogIcon);

function App() {
    const [redirectSettings, setRedirectSettings] = useState<RedirectSetting[]>([])
    const [showImportModal, setShowImportModal] = useState(false)
    useEffect(() => {
        redirectSettingsProvider.getValue().then(
            v => {
                setRedirectSettings(v)
            }
        ).catch(e => {
            console.error(e)
        })
        const unwatch = redirectSettingsProvider.watch((newValue, oldValue) => {
            console.debug("redirectSettings changed:", oldValue, newValue)
            setRedirectSettings(newValue)
        })
    }, [])

    return (
        <>
            <div className="main-container">
                <div className="alert alert-app-level alert-info">
                </div>
                <Header />
                <div className="content-container">
                    <div className="content-area" cds-layout="m-t:md">
                        <h3>Redirect Settings</h3>
                        <div cds-layout="horizontal gap:lg p:md">
                            {/* <CdsButtonInline onClick={() => { console.debug("Add redirect setting")}}>Add</CdsButtonInline> */}
                            <CdsButtonInline onClick={() => { setShowImportModal(true) }}>Import</CdsButtonInline>
                            <CdsButtonInline onClick={() => { redirectSettingsProvider.setValue([]) }}>Delete All</CdsButtonInline>
                            {/* <CdsButtonInline>Export</CdsButtonInline> */}
                        </div>
                        <Datagrid onDeleted={(i) => {
                            redirectSettingsProvider.getValue().then(
                                redirectSettings => {
                                    redirectSettings.splice(i, 1)
                                    redirectSettingsProvider.setValue(redirectSettings)
                                    console.debug("newRedirectSettings", redirectSettings)
                                }
                            ).catch(e => {
                                console.error(e)
                            })
                        }} withAction={true} data={redirectSettings} />
                    </div>
                </div>
            </div>
            <ImportModal visible={showImportModal} onCloseChange={() => {
                setShowImportModal(false)
            }} onActionOk={((r) => {
                console.debug("Import", r)
                redirectSettingsProvider.getValue().then(
                    redirectSettings => {
                        const newRedirectSettings = uniqueFilter(([] as RedirectSetting[]).concat(...redirectSettings, ...r))
                        redirectSettingsProvider.setValue(newRedirectSettings)
                        console.debug("newRedirectSettings", newRedirectSettings)
                    }).catch(e => {
                        console.error(e)
                    }).finally(() => {
                        setShowImportModal(false)
                    })
            })}
            />
        </>
    );
}

export default App;
