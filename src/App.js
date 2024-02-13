import './App.css';
import {Layout} from "antd";
import Designer from "./Designer";


const {Header, Content} = Layout;

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
        <Content style={{height:'calc(100vh - 60px)'}}>
            <Designer />
        </Content>
    </Layout>);
}

export default App;
