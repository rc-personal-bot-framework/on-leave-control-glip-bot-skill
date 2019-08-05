import Sequelize from 'sequelize'
import { generate } from 'shortid'
import sequelize from 'ringcentral-personal-chatbot/dist/server/models/sequelize'

export default sequelize.define('olc', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: generate
  },
  user_id: {
    type: Sequelize.STRING,
    defaultValue: generate
  },
  timefrom: {
    type: Sequelize.INTEGER
  },
  timeto: {
    type: Sequelize.INTEGER
  },
  timezone: {
    type: Sequelize.STRING
  },
  timedef: {
    type: Sequelize.STRING
  },
  note: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.JSON
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  data: {
    type: Sequelize.JSON
  },
  type: {
    type: Sequelize.STRING,
    defaultValue: 'def'
  },
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})
