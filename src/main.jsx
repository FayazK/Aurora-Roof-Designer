import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/index.css'
import {ConfigProvider} from "antd";
import {RecoilRoot} from "recoil";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </ConfigProvider>
  </React.StrictMode>,
)
