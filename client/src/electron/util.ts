require("cross-env").config({});
export function isDev(): boolean{
    return process.env.NODE_ENV === 'development'; 
}