import { Modal } from "./Modal"

type Props = {
    title: string
    message: string
    onCloseChange: (e: Event) => void
    size?: 'default' | 'sm' | 'lg' | 'xl'
    onActionOk?: (e: React.MouseEvent) => void
    visible: boolean
}

export const ConfirmModal: React.FC<Props> = (props) => {
    const { visible, title, onCloseChange, onActionOk, message } = props
    const size = props?.size || 'default'
    return (<>
        {visible &&
            <Modal size={size} onCloseChange={onCloseChange} onActionOk={onActionOk} title={title} ><p cds-text="body">{message}</p></Modal>}
    </>)
}