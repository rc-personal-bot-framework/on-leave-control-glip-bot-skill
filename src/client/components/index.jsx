import { Component } from 'react-subx'
import { Spin, Icon } from 'antd'
import AddOlc from './add-olc'
import Olcs from './olcs'

export default class App extends Component {
  componentDidMount () {
    this.init()
  }

  init = async () => {
    let res = await this.props.store.getUser()
    if (res) {
      await this.props.store.list()
    }
  }

  render () {
    let { store } = this.props
    return (
      <Spin spinning={store.fetchingUser}>
        <div className='wrap'>
          <div className='pd1y pd3b'>
            <a href={window.rc.redirect}>
              <Icon type='home' /> Back to App home
            </a>
          </div>
          <h1>On leave control setting</h1>
          <p>You can set on leave time and on leave message, during on leave time, anyone mentions you or send private message, will get auto reponse message set by you.</p>
          <AddOlc store={store} />
          <Olcs store={store} />
        </div>
      </Spin>
    )
  }
}
