import { CdsGrid, CdsGridCell, CdsGridColumn, CdsGridRow } from "@cds/react/grid"
import { CdsDropdown } from "@cds/react/dropdown"
import { CdsButton } from "@cds/react/button"
import { CdsButtonAction } from "@cds/react/button-action"
import { MouseEvent, useId } from "react"

type Props = {
    data: any[]
    withAction?: boolean
    onDeleted?: (index: number) => void
    onEdit?: (index: number) => void
}

export const Datagrid: React.FC<Props> = (props) => {
    const { data, onDeleted, onEdit } = props
    const baseId = useId()
    const columns = data.length > 0 ? Object.keys(data[0]) : []
    const [dropdownAnchor, setDropdownAnchor] = useState("")
    const withAction = props?.withAction || false

    const onClickButtonAction = (e: MouseEvent) => {
        setDropdownAnchor(e.currentTarget.id)
    }

    return (
        <>
            <CdsGrid height="60vh">
                {withAction && <CdsGridColumn type="action"></CdsGridColumn>}
                {columns.map((c) => (<CdsGridColumn>{c}</CdsGridColumn>))}
                {data.map((d, i) => (
                    <CdsGridRow>
                        {withAction &&
                            <CdsGridCell>
                                <CdsButtonAction id={`${baseId}${i.toString()}`} onClick={onClickButtonAction} />
                            </CdsGridCell>
                        }
                        {Object.values(d).map(v =>
                            (<CdsGridCell>{v as string}</CdsGridCell>))}
                    </CdsGridRow>
                ))}
            </CdsGrid>
            <CdsDropdown anchor={CSS.escape(dropdownAnchor)} hidden={dropdownAnchor == ""} onCloseChange={(e) => { setDropdownAnchor("") }}>
                <CdsButton block action="flat" size="sm" onClick={
                    (e) => {
                        const indexToEdit = parseInt(dropdownAnchor.replace(baseId, ""))
                        onEdit && onEdit(indexToEdit)
                        setDropdownAnchor("")
                    }
                }>Edit</CdsButton>
                <CdsButton block action="flat" size="sm" onClick={(e) => {
                    const indexToDelete = parseInt(dropdownAnchor.replace(baseId, ""))
                    onDeleted && onDeleted(indexToDelete)
                    setDropdownAnchor("")
                }}>Delete</CdsButton>
            </CdsDropdown>
        </>
    )
}