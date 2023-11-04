import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


export default function setCommonMiddlewares(app) {
    const __filename = fileURLToPath(import.meta.url);
    const __middlewareDirname = path.dirname(__filename);
    const __dirname = path.dirname(__middlewareDirname);
    
    app.use(express.static(path.resolve(__dirname, 'public')));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.set('view engine', 'hbs');
    app.set('views', path.resolve(__dirname, 'views'));
}