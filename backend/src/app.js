import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (!allowedOrigins.includes(origin)) {
            return callback(new Error("Not allowed by CORS"), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extented: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser());


// Routes import
import userRouter from "./routes/user.routes.js";



// routes declaration
app.use("/api/v1/users", userRouter);



export default app;