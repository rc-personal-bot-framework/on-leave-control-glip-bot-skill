import { Component } from 'react'
import { Button, Form, Col, Row, Input, Spin, DatePicker } from 'antd'
import copy from 'json-deep-copy'
import moment from 'moment'

const { RangePicker } = DatePicker
const FormItem = Form.Item

@Form.create()
class AddOlc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      faq: copy(props.faq || {})
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

  submit = async (e) => {
    e.preventDefault()
    let res = await this.validateFieldsAndScroll()
    if (!res) {
      return
    }
    this.props.onSubmit(res, () => {
      this.setState({
        faq: copy(this.props.faq || {})
      }, () => this.props.form.resetFields())
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    let { keywords, answer } = this.state.faq
    return (
      <Spin spinning={this.props.submitting}>
        <Form layout='vertical' onSubmit={this.submit}>
          <Row>
            <Col span={9}>
              <div className='pd1x pd1y'>
                <FormItem label='Keywords(split by ",")'>
                  {
                    getFieldDecorator('keywords', {
                      initialValue: keywords,
                      rules: [
                        {
                          required: true,
                          message: 'Please input your keywords, seprate by space'
                        }
                      ]
                    })(
                      <Input.TextArea />
                    )
                  }
                </FormItem>
              </div>
            </Col>
            <Col span={10}>
              <div className='pd1x pd1y'>
                <FormItem label='Answer'>
                  {
                    getFieldDecorator('answer', {
                      initialValue: answer,
                      rules: [
                        {
                          required: true,
                          message: 'Please input your Answer'
                        }
                      ]
                    })(
                      <Input.TextArea />
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
                  className='faq-sub mg1r'
                >
                  {this.props.submitText}
                </Button>
                {
                  this.props.onCancel
                    ? (
                      <Button
                        type='ghost'
                        className='faq-sub'
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

export default AddFaq
