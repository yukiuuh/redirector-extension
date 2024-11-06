import { RedirectSetting, redirectSettingsProvider } from "@/src/RedirectSetting"
import { Modal } from "./Modal"
import { regexUrlFilter } from "@/src/utils"
import { CdsControlAction, CdsFormGroup } from "@cds/react/forms"
import { CdsInput } from "@cds/react/input"
import { CdsCard } from "@cds/react/card"


type Props = {
    visible: boolean
    onCloseChange: (e: Event) => void
    onActionOk?: (redirectSetting: RedirectSetting) => void
    indexToEdit: number
}

export const EditModal: React.FC<Props> = (props) => {
    const { visible, onCloseChange, onActionOk, indexToEdit } = props
    const mode: 'edit' | 'add' = indexToEdit >= 0 ? 'edit' : 'add'
    const [source, setSource] = useState("")
    const [target, setTarget] = useState("")
    const [regexpValid, setRegexpValid] = useState(false)

    useEffect(() => {
        browser.declarativeNetRequest.isRegexSupported({ regex: regexUrlFilter(source) }).then(
            (res) => {
                setRegexpValid(res.isSupported)
                console.debug("Regexp Checked:", res)
            }
        )

    }, [source])

    useEffect(() => {
        if (indexToEdit >= 0) {
            redirectSettingsProvider.getValue().then((rs) => {
                const r = rs[indexToEdit]
                setSource(r.source)
                setTarget(r.target)
            })
        }
    }, [indexToEdit])

    return visible ? (<Modal size="xl" title={mode == 'edit' ? "Edit" : "Add"} onCloseChange={
        onCloseChange
    }
        onActionOk={
            source.length > 0 && target.length > 0 ?
                () => { onActionOk && onActionOk({ source, target }) } : undefined
        }
    >
        <div cds-layout="vertical gap:md">
            <CdsCard>
                <div cds-layout="gap:md vertical">
                    <div cds-layout="gap:md vertical p:md">
                        <CdsFormGroup>
                            <CdsInput status={regexpValid ? "neutral" : "error"}>
                                <label>source</label>
                                <input onChange={(e) => { setSource(e.currentTarget.value) }} value={source} />
                                <CdsControlAction inert style={{ pointerEvents: "none" }} action="prefix">http(s)://</CdsControlAction>
                            </CdsInput>
                            <CdsInput>
                                <label>target</label>
                                <input onChange={(e) => { setTarget(e.currentTarget.value) }} value={target} />
                                <CdsControlAction inert style={{ pointerEvents: "none" }} action="prefix">http(s)://</CdsControlAction>
                            </CdsInput>
                        </CdsFormGroup>
                    </div>
                </div>
            </CdsCard>

        </div >
    </Modal >) : <></>
} 