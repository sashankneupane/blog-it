import express from "express";
import path from "path";
// import cors from "cors";
import { create, engine } from "express-handlebars";
import layouts from "handlebars-layouts";
import { fileURLToPath } from "url";

export default function setCommonMiddlewares(app) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(path.dirname(__filename));

  // const allowedOrigins = [
  //   "http://localhost:3000",
  //   "https://localhost:3000",
  //   "http://ait-project.sashankneupane.com"
  // ]

  // const corsOptions = {
  //   origin: allowedOrigins,
  //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   credentials: true,
  // };

  // app.use(cors(corsOptions));
  app.use(express.static(path.resolve(__dirname, "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const viewsDir = path.resolve(__dirname, "views");
  const layoutsDir = path.resolve(viewsDir, "layouts");
  const partialsDir = path.resolve(viewsDir, "partials");

  const exphbs = create({
    extname: ".hbs",
    defaultLayout: "layout",
    engine: engine({
      layoutsDir: layoutsDir,
      partialsDir: partialsDir,
    }),
    helpers: {
      formatDate: function (date) {
        const options = { month: "short", day: "numeric", year: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
      },
      formatTimeElapsed: function (timestamp) {
        const now = new Date();
        const secondsAgo = Math.floor((now - new Date(timestamp)) / 1000);

        if (secondsAgo < 60) {
          return secondsAgo + " seconds ago";
        } else if (secondsAgo < 3600) {
          const minutes = Math.floor(secondsAgo / 60);
          return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
        } else if (secondsAgo < 86400) {
          const hours = Math.floor(secondsAgo / 3600);
          return hours + (hours === 1 ? " hour ago" : " hours ago");
        } else {
          const days = Math.floor(secondsAgo / 86400);
          return days + (days === 1 ? " day ago" : " days ago");
        }
      },
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  });

  layouts.register(exphbs.handlebars);

  app.engine("hbs", exphbs.engine);
  app.set("view engine", "hbs");
}
