import './App.css';
import {Button, Layout} from "antd";
import Designer from "./Designer";


const {Header, Content, Footer, Sider} = Layout;

function App() {
    return (<Layout>
        <Header
            style={{
                height:'60px',
                display: 'flex', alignItems: 'center',
            }}
        >
            Header Toolbar
        </Header>
        <Content>
            <Designer />
        </Content>
    </Layout>);
}

export default App;
