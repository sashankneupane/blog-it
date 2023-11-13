import express from "express";
import path from "path";
import { create, engine } from "express-handlebars"; 
import { fileURLToPath } from "url";

export default function setCommonMiddlewares(app) {
  const __filename = fileURLToPath(import.meta.url);
  const __middlewareDirname = path.dirname(__filename);
  const __dirname = path.dirname(__middlewareDirname);

  app.use(express.static(path.resolve(__dirname, "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const viewsDir = path.resolve(__dirname, "views");
  const layoutsDir = path.resolve(viewsDir, "layouts");
  const partialsDir = path.resolve(viewsDir, "partials");

  const exhbs = create({
    extname: ".hbs",
    engine: engine(
      {
        defaultLayout: 'layout',
        layoutsDir: layoutsDir,
        partialsDir: partialsDir,
      },
    ),
    helpers: {
      formatDate: function (date) {
        return new Date(date).toLocaleDateString("en-US");
      },
    }
  });

  app.engine("hbs", exhbs.engine);
  app.set("view engine", "hbs");
}