import React,{Component} from 'react'
import ReactDom from 'react-dom'
import '../../../public/styles/material-media.less'

export default class Media extends Component{
    constructor(props){
        super(props);
        this.state={
            url:''
        }
        this.readPicture=this.readPicture.bind(this);
    }
    componentDidMount() {
        
    }
    readPicture(e){
        const self=this;
        const reader=new FileReader();
        const file=e.target.files[0];
        if(!/image\/\w+/.test(file.type)){
            alert('文件必须为图片格式!');
            return false;
        }
        reader.readAsDataURL(file);
        reader.onload=function(e){
            self.setState({url:this.result})
        }

    }
    render(){
        return(
            <div className='material-media'>
                <div>
                    <span>素材名称</span>
                    <input/>
                </div>
                <div className='media-file'>
                    <span>导入素材</span>
                    <input type="file" onChange={this.readPicture}/>
                </div>
                <div>
                    <img src={this.state.url} alt='jpg/png/jpeg'/>
                </div>
            </div>
        )
    }
}