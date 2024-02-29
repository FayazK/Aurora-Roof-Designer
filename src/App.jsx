import './assets/App.css'
import {Button, Layout, theme} from "antd";
import {useRecoilState} from "recoil";
import {drawingAtom} from "./helpers/atoms.js";
import Designer from "./Components/Designer.jsx";
const {Header, Content} = Layout;

function App() {
    const [isDrawing, setIsDrawing] = useRecoilState(drawingAtom);
    const {token: {colorBgContainer},} = theme.useToken();

    const handleDrawing = () => {
        setIsDrawing(!isDrawing);
    }// handleDrawing

    return (<Layout>
        <Header className={'header'} style={{backgroundColor: colorBgContainer}}>
            <Button onClick={handleDrawing}>{isDrawing ? 'Stop Drawing' : 'Start Drawing'}</Button>
        </Header>
        <Content style={{height: 'calc(100vh - 60px)'}}>
            <Designer/>
        </Content>
    </Layout>);
}

export default App
