import { ClarityIcons, cogIcon } from '@cds/core/icon';
import { CdsIcon } from '@cds/react/icon';
import { Datagrid } from './components/Datagrid';
import { CdsButtonInline } from '@cds/react/button-inline';
import { Modal } from './components/Modal';
import FileLoader from './components/FileLoader';
import { parseCSV, uniqueFilter } from '@/src/utils';
import { RedirectSetting, redirectSettingsProvider, getRedirectSettingFromCSV, } from '@/src/RedirectSetting';

ClarityIcons.addIcons(cogIcon);

function App() {
    const [redirectSettings, setRedirectSettings] = useState<RedirectSetting[]>([])
    const [showImportModal, setShowImportModal] = useState(false)
    const [importPreviewData, setImportPreviewData] = useState<RedirectSetting[]>([])
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
                <header className="header header-6">
                    <div className="branding">
                        <a style={{ pointerEvents: "none" }}>
                            <CdsIcon shape="cog" style={{ pointerEvents: "none" }} />
                            <span className="title">Redirector Option</span>
                        </a>
                    </div>
                </header>
                <div className="content-container">
                    <div className="content-area" cds-layout="m-t:md">
                        <h3>Reidrect Settings</h3>
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
                                    setImportPreviewData([])
                                }
                            ).catch(e => {
                                console.error(e)
                            })
                        }} withAction={true} data={redirectSettings} />
                    </div>
                </div>
            </div>
            {showImportModal &&
                <Modal size="xl" title="Import" onCloseChange={() => {
                    setShowImportModal(false)
                    setImportPreviewData([])
                }}
                    onActionOk={importPreviewData.length > 0 ? ((e) => {
                        console.debug("Import start", e)
                        redirectSettingsProvider.getValue().then(
                            redirectSettings => {
                                const newRedirectSettings = uniqueFilter(([] as RedirectSetting[]).concat(...redirectSettings, ...importPreviewData))
                                redirectSettingsProvider.setValue(newRedirectSettings)
                                console.debug("newRedirectSettings", newRedirectSettings)
                                setImportPreviewData([])
                            }
                        ).catch(e => {
                            console.error(e)
                        })
                    }) : undefined}
                >
                    <div cds-layout="vertical gap:md">
                        <FileLoader onChangeFiles={(f) => {
                            console.debug("file opened", f)
                            if (f.length == 0) {
                                // canceled
                                setImportPreviewData([])
                            }
                            f.map((file) => {
                                parseCSV(file).then(r => {
                                    console.debug("file parsed", r)
                                    setImportPreviewData(getRedirectSettingFromCSV(r.data))
                                }).catch(
                                    (e) => {
                                        console.error("failed to parse file", e)
                                    }
                                )
                            })
                        }} />
                        <Datagrid data={importPreviewData} />
                    </div>
                </Modal>}
        </>
    );
}

export default App;
