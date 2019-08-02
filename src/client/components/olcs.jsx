import { Component } from 'react-subx'
import { Table, Popconfirm, Icon, Spin, Modal } from 'antd'
import moment from 'moment'
import OlcForm from './olc-form'

const format = 'YYYY-MM-DD HH:mm'

export default class Olcs extends Component {
  state = {
    editting: false
  }

  del = (olc) => {
    this.props.store.del(olc.id)
  }

  edit = olc => {
    this.setState({
      editting: olc
    })
  }

  cancelEdit = () => {
    this.setState({
      editting: false
    })
  }

  submit = async (update, callback) => {
    let olc = this.state.editting
    this.props.store.loading = true
    let res = await this.props.store.update(
      olc.id,
      update
    )
    this.props.store.loading = false
    this.setState({
      editting: res ? false : olc
    })
    if (res && callback) {
      callback()
    }
  }

  empty () {
    return (
      <div className='pd2y aligncenter'>
        No items yet.
      </div>
    )
  }

  render () {
    let { olcs, loading } = this.props.store
    if (!olcs.length) {
      return this.empty()
    }
    let { editting } = this.state
    let src = olcs.map((f, i) => {
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
        title: 'Time range',
        dataIndex: 'timerange',
        key: 'timerange',
        render: (text, olc) => {
          let {
            timefrom,
            timeto,
            timezone
          } = olc
          let offset = Number(timezone.split(':')[1])
          let f = moment(timefrom).utc.utcOffset(offset).format(format)
          let t = moment(timeto).utc.utcOffset(offset).format(format)
          return `${f} ~ ${t}`
        }
      },
      {
        title: 'Timezone',
        dataIndex: 'timezone',
        key: 'timezone'
      },
      {
        title: 'Note',
        dataIndex: 'note',
        key: 'note'
      },
      {
        title: 'Ops',
        dataIndex: 'ops',
        key: 'ops',
        render: (text, olc) => {
          return (
            <div>
              <Icon
                type='edit'
                className='font16 mg1l pointer'
                onClick={() => this.edit(olc)}
              />
              <Popconfirm
                onConfirm={() => this.del(olc)}
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
      <div className='pd1b olc-items'>
        <Modal
          visible={!!editting}
          title='Edit olc Item'
          footer={null}
          onCancel={this.cancelEdit}
        >
          <OlcForm
            submitting={loading}
            olc={editting}
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
