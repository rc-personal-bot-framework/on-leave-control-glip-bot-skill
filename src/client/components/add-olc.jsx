import { Component } from 'react-subx'
import FaqForm from './olc-form'

export default class AddFaq extends Component {
  state = {
    visible: false,
    loading: false
  }

  onSubmit = async (update, callback) => {
    this.setState({
      loading: true
    })
    let res = await this.props.store.add(update)
    this.setState({
      loading: false
    })
    if (res && callback) {
      callback()
    }
  }

  render () {
    return (
      <div className='pd1b'>
        <FaqForm
          onSubmit={this.onSubmit}
          submitting={this.state.loading}
          submitText='Add new'
        />
      </div>
    )
  }
}
