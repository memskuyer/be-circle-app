import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const port = process.env.PORT;
import rootRouter from './routes/root.routes';
import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import threadRouter from './routes/thread.routes';
import likeRouter from './routes/likes.routes';
import replyRouter from './routes/reply.routes';
import followRouter from './routes/follow.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../swagger/swagger-output.json';
import { errorHandler } from './middlewares/error.middleware';
var cors = require('cors');

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    customSiteTitle: 'Circle App API',
    customfavIcon: 'NONE',
    isExplorer: true,
    customJs:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customCss: `
              .swagger-ui .topbar { display: none } 
              .information-container.wrapper { background:rgb(0, 225, 255); padding: 2rem } 
              .information-container .info { margin: 0 } 
              .information-container .info .main { margin: 0 !important} 
              .information-container .info .main .title { color:rgb(0, 0, 0)} 
              .renderedMarkdown p { margin: 0 !important; color:rgb(0, 0, 0) !important }
              `,
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);
app.use(rootRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/threads', threadRouter);
app.use('/likes', likeRouter);
app.use('/reply', replyRouter);
app.use('/follow', followRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
