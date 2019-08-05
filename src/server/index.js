import Olc from './model'
import extendApp from './app'

export const name = 'Bot skill: On leave control'
export const description = 'On leave control bot skill for [ringcentral-personal-chatbot-js], click bot settings to set your rules.'
export const homepage = 'https://github.com/rc-personal-bot-framework/on-leave-control-glip-bot-skill#readme'

export const onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled, // hanlded by prev skills
  shouldUseSignature // should use signature like "send by bot skill xxx" in message.
}) => {
  if (handled) {
    return false
  }
  await Olc.sync()
  let olcs = await Olc.findAll({
    where: {
      user_id: user.id
    }
  })
  olcs = olcs.map(r => {
    return r.get
      ? r.get({
        plain: true
      })
      : r
  })
  let res = false
  let now = Date.now()
  let sign = shouldUseSignature
    ? `\n(send by [${exports.name}](${exports.homepage}))`
    : ''
  for (let olc of olcs) {
    let {
      timefrom,
      timeto,
      note
    } = olc
    if (now >= timefrom && now <= timeto) {
      res = true
      await Olc.update({
        count: (olc.count || 0) + 1
      }, {
        where: {
          id: olc.id
        }
      })
      await user.sendMessage(group.id, {
        text: note + sign
      })
    }
  }
  return res
}

export const appExtend = extendApp
export const settingPath = '/skill/olc/setting'
