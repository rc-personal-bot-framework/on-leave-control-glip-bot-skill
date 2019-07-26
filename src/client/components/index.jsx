import { Component } from 'react-subx'
import { Spin } from 'antd'
import AddOlc from './add-olc'
import Olcs from './olcs'

export default class App extends Component {
  componentDidMount () {
    this.init()
  }

  init = async () => {
    await this.props.store.getUser()
    await this.props.store.list()
  }

  render () {
    let { store } = this.props
    return (
      <Spin spinning={store.fetchingUser}>
        <div className='wrap'>
          <h1>On leave control setting</h1>
          <p>You can set on leave time and on leave message, during on leave time, anyone mentions you or send private message, will get auto reponse message setted by you.</p>
          <AddOlc store={store} />
          <Olcs store={store} />
        </div>
      </Spin>
    )
  }
}
