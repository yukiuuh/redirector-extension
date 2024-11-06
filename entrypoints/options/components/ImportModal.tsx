import { getRedirectSettingFromCSV, RedirectSetting } from "@/src/RedirectSetting"
import FileLoader from "./FileLoader"
import { Modal } from "./Modal"
import { Datagrid } from "./Datagrid"
import { parseCSV } from "@/src/utils"
import { ControlStatus } from "@cds/core/forms"

type Props = {
    visible: boolean
    onCloseChange: (e: Event) => void
    onActionOk?: (redirectSettings: RedirectSetting[]) => void
    onChangeFiles?: (f: File[]) => void
}

export const ImportModal: React.FC<Props> = (props) => {
    const { visible, onCloseChange, onActionOk, onChangeFiles } = props
    const [importPreviewData, setImportPreviewData] = useState<RedirectSetting[]>([])
    const [fileStatus, setFileStatus] = useState<ControlStatus>("neutral")

    return visible ? (<Modal size="xl" title="Import" onCloseChange={
        onCloseChange
    }
        onActionOk={
            importPreviewData.length > 0 ?
                () => {
                    onActionOk && onActionOk(importPreviewData)
                    setImportPreviewData([])
                    setFileStatus("neutral")
                } : undefined
        }
    >
        <div cds-layout="vertical gap:md">
            <FileLoader status={fileStatus} onChangeFiles={
                (f) => {
                    onChangeFiles && onChangeFiles(f)
                    console.debug("file opened", f)
                    setFileStatus("neutral")
                    if (f.length == 0) {
                        // canceled
                        setImportPreviewData([])
                    }
                    f.map((file) => {
                        parseCSV(file).then(r => {
                            console.debug("file parsed", r)
                            setImportPreviewData(getRedirectSettingFromCSV(r.data))
                            setFileStatus("success")
                        }).catch(
                            (e) => {
                                console.error("failed to parse file", e)
                                setFileStatus("error")
                            }
                        )
                    })
                }
            }
            />
            <Datagrid data={importPreviewData} />
        </div>
    </Modal>) : <></>
} 