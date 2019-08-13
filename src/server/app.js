/**
 * extend app
 */

import { resolve } from 'path'
import Olc from './model'
import { generate } from 'shortid'
import copy from 'json-deep-copy'
import _ from 'lodash'
import express from 'express'
import { extraPath, jwtPrefix, defaultState, authUrlDefault } from 'ringcentral-personal-chatbot/dist/server/common/constants'
import { jwtAuth } from 'ringcentral-personal-chatbot'

const pack = require(resolve(__dirname, '../../package.json'))
const viewPath = resolve(__dirname, '../views/index.pug')
const staticPath = resolve(__dirname, '../../dist/static')

const { RINGCENTRAL_CHATBOT_SERVER, SERVER_HOME } = process.env

export default (app) => {
  app.use(
    express.static(staticPath)
  )

  app.get('/skill/olc/setting', async (req, res) => {
    let data = {
      redirect: extraPath + SERVER_HOME,
      title: pack.name,
      jwtPrefix,
      version: pack.version,
      defaultState,
      authUrlDefault,
      server: RINGCENTRAL_CHATBOT_SERVER
    }
    data._global = copy(data)
    res.render(viewPath, data)
  })

  app.post('/skill/olc/op', jwtAuth, async (req, res) => {
    let { user } = req
    let { id: userId } = user || {}
    if (!userId) {
      res.status(401)
      return res.send({
        status: 1,
        msg: 'please login first'
      })
    }
    let {
      id,
      action,
      update
    } = req.body
    if (
      !['add', 'update', 'del', 'list'].includes(action) ||
      (id && !_.isString(id)) ||
      (action === 'add' && !_.isPlainObject(update)) ||
      (action === 'update' && (!_.isPlainObject(update) || !id)) ||
      (action === 'del' && !id)
    ) {
      res.status(400)
      return res.send({
        status: 1,
        error: 'params not right'
      })
    }
    let result
    if (action === 'list') {
      result = await Olc.findAll({
        where: {
          user_id: userId
        }
      })
      result = result.map(r => {
        return r.get
          ? r.get({
            plain: true
          })
          : r
      })
    } else if (action === 'del') {
      result = await Olc.destroy({
        where: {
          id: id,
          user_id: userId
        }
      })
    } else if (action === 'add') {
      result = await Olc.create({
        ...update,
        id: generate(),
        user_id: userId
      })
    } else if (action === 'update') {
      result = await Olc.update(update, {
        where: {
          id,
          user_id: userId
        }
      })
    }
    let data = {
      status: 0,
      result
    }
    res.send(data)
  })
}
