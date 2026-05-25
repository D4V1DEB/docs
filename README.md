# Lab docs colaborativo

## 1. Instalar Node.js

## 2. Instalar dependencias
yjs, y-websocket, ws, tiptap, react, concurrently
```bash
npm install
```
## Nota: habilitar firewall en windows

Windows (PowerShell como admin):
```powershell
New-NetFirewallRule -DisplayName "Lab Docs Vite 5173" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5173
New-NetFirewallRule -DisplayName "Lab Docs Yjs 1234" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 1234
```
## 4. Ejecutar la app
```bash
npm run dev
```