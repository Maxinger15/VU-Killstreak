// Declare the WebUI object provided by VU
declare const WebUI: {
    Call: (event: string, ...args: any[]) => void;
};

// Extend the Window interface to add your custom functions (for Lua calls)
interface Window {
    OnKill?: (data: string) => void;
    OnConnected?: (data: string) => void;
    OnLeft?: (data: string) => void;
}