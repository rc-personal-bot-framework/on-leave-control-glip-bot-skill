import Sequelize from 'sequelize'

import sequelize from 'ringcentral-personal-chatbot/dist/server/models/sequelize'

export default sequelize.define('olc', {
  id: { // Glip user ID
    type: Sequelize.STRING,
    primaryKey: true
  },
  user_id: { // glip user name
    type: Sequelize.STRING
  },
  time_from: { // on leave time from
    type: Sequelize.STRING
  },
  time_to: { // on leave time to
    type: Sequelize.STRING
  },
  time_def: {
    type: Sequelize.STRING
  },
  note: { // response note
    type: Sequelize.STRING
  },
  token: { // user token
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
