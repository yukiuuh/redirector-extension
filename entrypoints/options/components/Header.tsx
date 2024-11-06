import { ClarityIcons, cogIcon } from '@cds/core/icon';
import { CdsIcon } from '@cds/react/icon';
ClarityIcons.addIcons(cogIcon);

type Props = {

}
export const Header: React.FC<Props> = (props) => {
    return (<header className="header header-6">
        <div className="branding">
            <a style={{ pointerEvents: "none" }}>
                <CdsIcon shape="cog" style={{ pointerEvents: "none" }} />
                <span className="title">Redirector Option</span>
            </a>
        </div>
    </header>)
}