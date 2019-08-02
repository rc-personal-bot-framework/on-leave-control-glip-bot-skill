import { Component } from 'react'
import {
  Button, Form, Col, Row, Input, Spin, DatePicker,
  Select
} from 'antd'
import copy from 'json-deep-copy'
import moment from 'moment'
import { timezones } from './timezones'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const localTimeZoneoffset = -new Date().getTimezoneOffset()
const localTimezoneHour = localTimeZoneoffset / 60

@Form.create()
class AddOlc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      olc: copy(props.olc || {})
    }
  }

  validateFieldsAndScroll = () => {
    let { validateFieldsAndScroll } = this.props.form
    return new Promise(resolve => {
      validateFieldsAndScroll((errors, values) => {
        if (errors) resolve(false)
        else resolve(values)
      })
    })
  }

  onChangeTimezone = hour => {
    let old = this.props.form.getFieldValue('timezone')
    let [from, to] = this.props.form.getFieldValue('timeRange')
    let nfrom = from.utc().utcOffset(Number(hour) * 60)
    let nto = to.utc().utcOffset(Number(hour) * 60)
    this.props.form.setFieldsValue({
      timeRange: [nfrom, nto]
    })
    console.log(old, 'old')
    console.log(hour, 'hour')
  }

  submit = async (e) => {
    e.preventDefault()
    let res = await this.validateFieldsAndScroll()
    if (!res) {
      return
    }
    let [timefrom, timeto] = res.timeRange
    let { timezone } = res
    timefrom = timefrom.valueOf()
    timeto = timeto.valueOf()
    timezone = `${Number(timezone)}:${Number(timezone) * 60}`
    res.timezone = timezone
    res.timefrom = timefrom
    res.timeto = timeto
    delete res.timeRange
    this.props.onSubmit(res, () => {
      this.setState({
        olc: copy(this.props.olc || {})
      }, () => this.props.form.resetFields())
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    let {
      timefrom = moment().utc().utcOffset(localTimeZoneoffset).add(1, 'day'),
      timeto = moment().utc().utcOffset(localTimeZoneoffset).add(2, 'day'),
      timezone = `${localTimezoneHour}:${localTimeZoneoffset}`,
      note = ''
    } = this.state.olc
    let offset = Number(timezone.split(':')[1])
    let hour = offset / 60
    hour = hour > 0 ? '+' + hour : '' + hour
    let from = moment.isMoment(timefrom)
      ? timefrom
      : moment(timefrom).utc().utcOffset(offset)
    let to = moment.isMoment(timeto)
      ? timeto
      : moment(timeto).utc().utcOffset(offset)
    let opts = timezones.map(t => {
      return (
        <Select.Option value={t.hours} key={t.hours}>
          {t.title}({t.minites})
        </Select.Option>
      )
    })
    return (
      <Spin spinning={this.props.submitting}>
        <Form layout='vertical' onSubmit={this.submit}>
          <Row>
            <Col span={19}>
              <div className='pd1x pd1y'>
                <FormItem label='Time range'>
                  {
                    getFieldDecorator('timeRange', {
                      initialValue: [from, to],
                      rules: []
                    })(
                      <RangePicker showTime />
                    )
                  }
                </FormItem>
                <FormItem label='Timezone'>
                  {
                    getFieldDecorator('timezone', {
                      initialValue: hour,
                      rules: []
                    })(
                      <Select onChange={this.onChangeTimezone}>
                        {opts}
                      </Select>
                    )
                  }
                </FormItem>
                <FormItem label='Note'>
                  {
                    getFieldDecorator('note', {
                      initialValue: note,
                      rules: [
                        {
                          required: true,
                          message: 'Please input your on leave note'
                        }
                      ]
                    })(
                      <Input.TextArea rows={2} placeholder='On leave note' />
                    )
                  }
                </FormItem>
              </div>
            </Col>
            <Col span={5}>
              <div className='pd1x pd1y'>
                <Button
                  htmlType='submit'
                  type='primary'
                  className='olc-sub mg1r'
                >
                  {this.props.submitText}
                </Button>
                {
                  this.props.onCancel
                    ? (
                      <Button
                        type='ghost'
                        className='olc-sub'
                        onClick={this.props.onCancel}
                      >
                        Cancel
                      </Button>
                    )
                    : null
                }
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    )
  }
}

export default AddOlc
