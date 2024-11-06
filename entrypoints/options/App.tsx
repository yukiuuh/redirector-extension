import { ClarityIcons, cogIcon } from '@cds/core/icon';
import { Datagrid } from './components/Datagrid';
import { CdsButtonInline } from '@cds/react/button-inline';
import { uniqueFilter } from '@/src/utils';
import { RedirectSetting, redirectSettingsProvider } from '@/src/RedirectSetting';
import { ImportModal } from './components/ImportModal';
import { Header } from './components/Header';
import { EditModal } from './components/EditModal';
import { ConfirmModal } from './components/ConfirmModal';
import { exportRedirectSettings } from '../background';

ClarityIcons.addIcons(cogIcon);

function App() {
    const [redirectSettings, setRedirectSettings] = useState<RedirectSetting[]>([])
    const [showImportModal, setShowImportModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [indexToEdit, setIndexToEdit] = useState(-1)

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
                            <CdsButtonInline onClick={() => {
                                setIndexToEdit(-1)
                                setShowEditModal(true)
                            }}>Add</CdsButtonInline>
                            <CdsButtonInline onClick={() => { setShowImportModal(true) }}>Import</CdsButtonInline>
                            <CdsButtonInline onClick={() => { 
                                exportRedirectSettings(redirectSettings)
                            }}>Export</CdsButtonInline>
                            <CdsButtonInline onClick={() => {
                                setShowConfirmModal(true)
                            }}>Delete All</CdsButtonInline>
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
                        }}
                            onEdit={(i) => {
                                setShowEditModal(true)
                                setIndexToEdit(i)
                            }}
                            withAction={true} data={redirectSettings} />
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
            <EditModal indexToEdit={indexToEdit} visible={showEditModal} onCloseChange={() => {
                setShowEditModal(false)
            }} onActionOk={
                (r) => {
                    if (indexToEdit < 0) {
                        console.debug("Add", r)
                        redirectSettingsProvider.getValue().then(
                            redirectSettings => {
                                const newRedirectSettings = uniqueFilter(([] as RedirectSetting[]).concat(...redirectSettings, r))
                                redirectSettingsProvider.setValue(newRedirectSettings)
                                console.debug("newRedirectSettings", newRedirectSettings)
                            }).catch(e => {
                                console.error(e)
                            }).finally(() => {
                                setShowEditModal(false)
                            })
                    } else {
                        console.debug("Edit", r)
                        redirectSettingsProvider.getValue().then(
                            redirectSettings => {
                                // edit: delete old setting and add new setting
                                redirectSettings.splice(indexToEdit, 1)
                                const newRedirectSettings = uniqueFilter(([] as RedirectSetting[]).concat(...redirectSettings, r))
                                redirectSettingsProvider.setValue(newRedirectSettings)
                                console.debug("newRedirectSettings", newRedirectSettings)
                            }
                        ).catch(e => {
                            console.error(e)
                        }).finally(() => {
                            setShowEditModal(false)
                            setIndexToEdit(-1)
                        })
                    }
                }
            } />
            <ConfirmModal title="Confirm" message="Delete all redirect settings?" visible={showConfirmModal} onCloseChange={() => { setShowConfirmModal(false) }} onActionOk={() => {
                redirectSettingsProvider.setValue([])
                setShowConfirmModal(false)
            }} />
        </>
    );
}

export default App;
