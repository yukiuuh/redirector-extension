import { ClarityIcons, cogIcon } from '@cds/core/icon';
import { CdsIcon } from '@cds/react/icon';

ClarityIcons.addIcons(cogIcon);

function App() {

    return (
        <>
            <div className="main-container">
                <div className="alert alert-app-level alert-info">
                </div>
                <header className="header header-6">
                    <div className="branding">
                        <a href="#">
                            <CdsIcon shape="cog"></CdsIcon>
                            <span className="title">Redirector Option</span>
                        </a>
                    </div>
                </header>
                <div className="content-container">
                    <div className="content-area" cds-layout="m-t:md">
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
