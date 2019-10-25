import React ,{Component, useState } from 'react';
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Icon from './Icon'
import './index.scss'
// 请实现支持如下代码的InputNumber组件，可以受控和非受控。
// 受控组件value和onChange绑定在一起，出错概率小，但是必须把onChange事件写出来
// 非受控即使onChange不写也会改变value，不受控制，可能出现不可预知的错误
class InputNumber extends Component{
	constructor(props){
		super(props)
		this.state = {
			focus: false,
			showerror: false,
			innerValue: ''
		}
	}
	static propTypes = {
		value: PropTypes.string,
		onChange: PropTypes.func,
		size:PropTypes.string,
	}

	static defaultProps = {
		size: 'middle',
		onChange: () => {}
	}

	get isControl(){
		return 'value' in this.props
	}

	get value() {
		if(this.isControl){
			return this.props.value
		} else {
			return this.state.innerValue
		}
	}

	render() {
		const {
			focus,
			showerror
		} = this.state
		const {
			icon,
			children,
			size,
			prefix,
			suffix,
			onChange,
			rule = /\d/,
			message = "只允许输入数字",
			...rest

		} = this.props
		let cls = classNames({
			input: true,
			focus,
			[`size-${size}`]: true,
			'react-ui__input': true
		})
		return (
			<div>
				<div className={cls}>
					{prefix && <Icon name={prefix}/>}
					<input
						value={this.value}

						onFocus={e => {
							this.setState({
								focus: true,
								showerror: !rule.test(this.value)
							})
						}}
						onBlur={e => {
							this.setState({focus: false})
						}}
						onChange={(e) => {
							if(!this.isControl){
								this.setState({
									innerValue: e.target.value
								})
							}
							this.props.onChange(e)
							console.log(rule.test(this.value))
						}}
					/>
					{suffix && <Icon name={suffix}/>}
				</div>
				<p className = {showerror ? 'error':'hide error'}>
					{message}
				</p>
			</div>
		)
	}

	componentDidMount() {
		this.setState({
			innerValue: this.props.defaultValue
		})
	}

}

function App (){
	const [value,setValue] = useState('aaa')

	return (
			<div>
			<InputNumber value={value} onChange={e=>{setValue(e.target.value)}}/>
			<InputNumber defaultValue={value} onChange={e=>{}}/>
			</div>
	)
}
export default App

