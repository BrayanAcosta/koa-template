import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import dotenv from 'dotenv'

import { errorCatcherMdw, setFinalResponseMdw, setResponseTimeMdw } from './config-server/middlewares.js'
import router from './config-server/routers/routers-app.js'


dotenv.config()


const app = new Koa()

app.use(errorCatcherMdw)
app.use(setFinalResponseMdw)
app.use(setResponseTimeMdw)
app.use(bodyParser())

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(process.env.SERVER_PORT , () => console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}`))