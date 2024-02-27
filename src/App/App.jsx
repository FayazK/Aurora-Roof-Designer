import '../assets/css/App.css';
import {Button, Layout, theme} from "antd";
import Designer from "./Designer";
import {useRecoilState} from "recoil";
import {drawingAtom} from "../helpers/atom";


const {Header, Content} = Layout;

function App() {
    const [isDrawing, setIsDrawing] = useRecoilState(drawingAtom);
    const {token: {colorBgContainer},} = theme.useToken();

    const handleDrawing = () => {
        setIsDrawing(!isDrawing);
    }

    return (<Layout>
        <Header
            style={{
                height: '60px', display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer
            }}
        >
            <Button onClick={handleDrawing}>{isDrawing ? 'Stop Drawing' : 'Start Drawing'}</Button>
        </Header>
        <Content style={{height: 'calc(100vh - 60px)'}}>
            <Designer/>
        </Content>
    </Layout>);
}

export default App;
