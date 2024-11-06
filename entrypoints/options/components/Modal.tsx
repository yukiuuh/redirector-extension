import { CdsButton } from "@cds/react/button"
import { CdsModal, CdsModalActions, CdsModalContent, CdsModalHeader } from "@cds/react/modal"

type Props = {
    title: string
    onCloseChange: (e: Event) => void
    children?: React.ReactNode
    size?: 'default' | 'sm' | 'lg' | 'xl'
    onActionOk?: (e: React.MouseEvent) => void
}

export const Modal: React.FC<Props> = (props) => {
    const { title, onCloseChange, onActionOk } = props
    const size = props?.size || 'default'
    return (<>
        <CdsModal size={size} onCloseChange={onCloseChange}>
            <CdsModalHeader>
                <h3 cds-text="section">{title}</h3>
            </CdsModalHeader>
            <CdsModalContent>
                {props.children}
            </CdsModalContent>
            {onActionOk &&
                <CdsModalActions>
                    <CdsButton onClick={onActionOk}>OK</CdsButton>
                </CdsModalActions>
            }
        </CdsModal>
    </>)
}