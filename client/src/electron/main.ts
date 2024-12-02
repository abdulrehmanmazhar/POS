import {app, BrowserWindow } from "electron"
import path from "path"
import { isDev } from "./util.js";

type test = string;

app.on("ready",()=>{
    const mainWindow = new BrowserWindow({});
    mainWindow.loadFile(path.join(app.getAppPath(),"/dist-react/index.html"));

    if(isDev()){
        mainWindow.loadURL('http://localhost:5173')
    }else{
        mainWindow.loadURL(path.join(app.getAppPath(),`/dist-react/index.html`))
    }
})