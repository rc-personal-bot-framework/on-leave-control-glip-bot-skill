import { Component } from 'react-subx'
import { Table, Popconfirm, Icon, Spin, Modal } from 'antd'
import OlcForm from './olc-form'

export default class Olcs extends Component {
  state = {
    editting: false
  }

  del = (faq) => {
    this.props.store.del(faq.id)
  }

  edit = faq => {
    this.setState({
      editting: faq
    })
  }

  cancelEdit = () => {
    this.setState({
      editting: false
    })
  }

  submit = async (update, callback) => {
    let faq = this.state.editting
    this.props.store.loading = true
    let res = await this.props.store.update(
      faq.id,
      update
    )
    this.props.store.loading = false
    this.setState({
      editting: res ? false : faq
    })
    if (res && callback) {
      callback()
    }
  }

  empty () {
    return (
      <div className='pd2y aligncenter'>
        No faqs yet.
      </div>
    )
  }

  render () {
    let { faqs, loading } = this.props.store
    if (!faqs.length) {
      return this.empty()
    }
    let { editting } = this.state
    let src = faqs.map((f, i) => {
      return {
        ...f,
        index: i + 1
      }
    })
    let columns = [
      {
        title: 'Index',
        dataIndex: 'index',
        key: 'index'
      },
      {
        title: 'Trigger count',
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count
      },
      {
        title: 'Keywords',
        dataIndex: 'keywords',
        key: 'keywords'
      },
      {
        title: 'Answer',
        dataIndex: 'answer',
        key: 'answer'
      },
      {
        title: 'Ops',
        dataIndex: 'ops',
        key: 'ops',
        render: (text, faq) => {
          return (
            <div>
              <Icon
                type='edit'
                className='font16 mg1l pointer'
                onClick={() => this.edit(faq)}
              />
              <Popconfirm
                onConfirm={() => this.del(faq)}
              >
                <Icon
                  type='minus-circle'
                  className='font16 color-red mg1l pointer'
                />
              </Popconfirm>
            </div>
          )
        }
      }
    ]
    return (
      <div className='pd1b faq-items'>
        <Modal
          visible={!!editting}
          title='Edit FAQ Item'
          footer={null}
          onCancel={this.cancelEdit}
        >
          <OlcForm
            submitting={loading}
            faq={editting}
            onSubmit={this.submit}
            onCancel={this.cancelEdit}
            submitText='Update'
          />
        </Modal>
        <Spin spinning={this.props.store.loading}>
          <Table
            dataSource={src}
            columns={columns}
            rowKey='id'
          />
        </Spin>
      </div>
    )
  }
}
