import { Component } from 'react'
import FaqForm from './faq-form'
import { Col, Row, Icon, Popconfirm, Spin } from 'antd'

export default class Faqs extends Component {
  state = {
    editting: false,
    updating: false
  }

  edit = () => {
    this.setState({
      editting: true
    })
  }

  del = () => {
    this.props.store.del(this.props.faq.id)
  }

  submit = async (update, callback) => {
    this.setState({
      updating: true
    })
    let res = await this.props.store.update(
      this.props.faq.id,
      update
    )
    this.setState({
      updating: false,
      editting: !res
    })
    if (res && callback) {
      callback()
    }
  }

  cancelEdit = () => {
    this.setState({
      editting: false
    })
  }

  renderEdit () {
    return (
      <Spin spinning={this.state.updating}>
        <div className='faq-item'>
          <FaqForm
            submitting={this.state.updating}
            faq={this.props.faq}
            onSubmit={this.submit}
            onCancel={this.cancelEdit}
            submitText='Update'
          />
        </div>
      </Spin>
    )
  }

  renderView () {
    let { keywords, answer, count } = this.props.faq
    let { index } = this.props
    return (
      <Spin spinning={this.state.updating}>
        <Row className='faq-item'>
          <Col span={1}>
            <div className='pd1x pd1y'>{index + 1}</div>
          </Col>
          <Col span={7}>
            <div className='pd1x pd1y'>{keywords}</div>
          </Col>
          <Col span={9}>
            <div className='pd1x pd1y'>{answer}</div>
          </Col>
          <Col span={1}>
            <div className='pd1x pd1y'>{count}</div>
          </Col>
          <Col span={6} className='faq-op'>
            <div className='pd1x pd1y'>
              <Icon
                type='edit'
                className='font16 mg1l pointer'
                onClick={this.edit}
              />
              <Popconfirm
                onConfirm={this.del}
              >
                <Icon
                  type='minus-circle'
                  className='font16 color-red mg1l pointer'
                />
              </Popconfirm>
            </div>
          </Col>
        </Row>
      </Spin>
    )
  }

  render () {
    return this.state.editting
      ? this.renderEdit()
      : this.renderView()
  }
}
