import { verifyToken } from "./auth/token-generator.js"

export async function setFinalResponseMdw (ctx: any, next:any) {
  await next()
  console.log(ctx);
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.URL} - ${rt}`)
}

export async function setResponseTimeMdw (ctx: any, next: any) {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
}


export const validateTokenMiddleware = async (ctx: any, next: any) => {
  const BEARER_START = 'Bearer '
  const checkStringStartWith = (str: string, start: string) => str.startsWith(start)
  
  function checkTokenExists (token: string): string {
    if (!token) {
      throw new Error('Token not found')
    }

    if (!checkStringStartWith(token, BEARER_START)) {
      throw new Error('Token invalid format')
    }

    const bearerJwt = String(token.split(BEARER_START)[1])
    return bearerJwt
  }
  console.log(ctx.headers.authorization)
  const token = checkTokenExists(ctx.headers.authorization)

  try{
    ctx.currentUser = await verifyToken(token)
  }catch(error){
    console.log('paso del error. ',error)
    throw new Error('Error parsing token')
  }
  await next()
}

export const errorCatcherMdw = async (ctx: any, next: any) =>{
  try{
    await next();
  }catch (err:any) {
    ctx.status = err?.cause?.code ?? 500
    ctx.body = err?.message ?? 'unknown error'
    ctx.app.emit('error', err, ctx)
  }
} 