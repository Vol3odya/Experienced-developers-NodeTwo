import express from "express";
import cors from "cors";

import { env } from "./utils/env.js";

import waterRouter from './routers/water.js';

import { notFoundHendler } from "./middlewares/notFoundHendler.js";
import { errorHendler } from "./middlewares/errorHendler.js";


/*import { logger } from "./middlewares/legger.js";*/
import authRouter from "./routers/auth.js";
import usersRoter from "./routers/users.js";
import cookieParser from "cookie-parser";
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';


export const setupServer = () => {
    const app = express();
    app.use(cors());

    app.use(express.json());

    app.use(cookieParser());
    //app.use(logger);

    app.use("/auth", authRouter);
    app.use('/users', usersRoter);

    /*app.use("/contacts", contactsRouter);*/

    app.use('/uploads', express.static(UPLOAD_DIR));

    app.use('/api-docs', swaggerDocs());

    app.use('/water', waterRouter);

    app.use(notFoundHendler);

    app.use(errorHendler);

    const port = Number(env("PORT", 3000));

    app.listen(port, () => console.log(`Server is running on port ${port}`));
};
