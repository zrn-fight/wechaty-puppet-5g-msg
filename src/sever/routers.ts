import Router from 'koa-router'
import type { WalnutMessagePayload } from '../help/struct'
import { log }  from 'wechaty-puppet'
import type PuppetWalnut from '../puppet-walnut.js'
const router = new Router()

router.get('/sms/notifyPath', async (ctx: any) => {
  log.info(ctx.header)
})

router.post('/sms/messageNotification/sip:20210401@botplatform.rcs.chinaunicom.cn/messages', async (ctx: any) => {
  const puppet: PuppetWalnut = ctx.puppet
  const message: WalnutMessagePayload = ctx.request.body
  puppet.cacheManager?.setMessage(message.messageId, message)
  puppet.emit('message', { messageId: message.messageId })
  ctx.response.body = {
    messageId: message.messageId,
    conversationId: message.conversationId,
    contributionId: message.contributionId,
    errorCode: 0,
    errorMessage: '',
  }
})

router.post('/sms/deliveryNotification/sip:20210401@botplatform.rcs.chinaunicom.cn/status', async (ctx: any) => {
  if (ctx.request.body.deliveryInfoList[0].errorCode !== 0) {
    log.warn('puppet-5g sever', 'message send error')
  }
  ctx.response.body = {
    errorCode: 0,
    errorMessage: '',
  }
})

export default router.routes()
