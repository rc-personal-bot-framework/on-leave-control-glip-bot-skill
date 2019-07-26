let skill = process.env.NODE_ENV === 'production'
  ? require('../dist/server/index')
  : require('../src/server/index')

exports.name = 'test bot'
exports.description = 'test bot'
exports.homepage = 'https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-skill-faq#readme'
exports.skills = [skill]
