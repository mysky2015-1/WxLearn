import React,{Component} from 'react'
import PropTypes from 'prop-types'
import '../../webfont/iconfont.css'

class Icon extends Component{
  // 组件规范，实现UI组件库必需的，相当于简单文档
	static propTypes = {
		name: PropTypes.string
	}
	static defaultProps = {
		name: 'aaa'
	}
	render() {
		const {
			name,
			...rest
		} = this.props
		return (
      <span {...rest} className={`icon iconfont icon-${name}`}></span>
		)
	}
}
export default Icon
