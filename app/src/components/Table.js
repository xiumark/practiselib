import React, {Component} from 'react';

/**
 * Table 组件
 * keyField:string 指定key
 * columns:[{title,field},..others] 列属性显示，title：列名称，field：列属性
 * data:[{esn,name,...},..other]
 * allChecked:bool 全选或全取消属性
 * allCheckChange:Func(value:bool) 全选或全取消事件，value:true:全选，false:取消
 * rowCheckChange:Func(rowId:Num,value:bool) 选中或取消事件
 * rowEdit:Func(rowId:Num) 编辑事件
 * rowDelete:Func(rowId:Num) 删除事件
 */
export default class Table extends Component {
    constructor(props) {
        super(props);
        this.allCheckChange = this.allCheckChange.bind(this);
        this.rowCheckChange = this.rowCheckChange.bind(this);
        this.rowEdit = this.rowEdit.bind(this);
        this.rowDelete = this.rowDelete.bind(this);
        this.rowClick = this.rowClick.bind(this);
    }

    allCheckChange() {
        this.props.allCheckChange && this.props.allCheckChange();
    }

    rowCheckChange(rowId, value) {
        this.props.rowCheckChange && this.props.rowCheckChange(rowId, value);
    }

    rowEdit(rowId) {
        this.props.rowEdit && this.props.rowEdit(rowId);
    }

    rowDelete(rowId) {
        this.props.rowDelete && this.props.rowDelete(rowId);
    }

    rowClick(row){
        this.props.rowClick && this.props.rowClick(row);
    }

    render() {
        let {columns=[], data=[], allChecked, keyField, isEdit, className=''} = this.props;
        return (
            <div className={`table-responsive ${className}`}>
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th className={allChecked === undefined?'hidden':''}><input type="checkbox"
                                                                                    checked={allChecked}
                                                                                    onChange={this.allCheckChange}/>
                        </th>
                        {
                            columns.map((item, index)=> {
                                return <th key={index}>{item.title}</th>
                            })
                        }
                        {
                            isEdit && <th></th>
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((row, index)=> {
                            return <tr key={index} onClick={()=>this.rowClick(row)}>
                                <td className={allChecked === undefined?'hidden':''}>
                                    {
                                        <input type="checkbox" checked={row.get('checked')} onChange={(e)=>keyField && this.rowCheckChange(row.get(keyField),e.target.checked)}/>
                                    }
                                </td>
                                {
                                    columns.map(function (item, index) {
                                        return <td key={index}>{row.get(item.field)}</td>
                                    })
                                }
                                {
                                    isEdit &&
                                        <td>
                                        <a className="btn" onClick={()=>keyField && this.rowEdit(row.get(keyField))}><span className="glyphicon glyphicon-edit"></span></a>
                                        <a className="btn" onClick={()=>keyField && this.rowDelete(row.get(keyField))}><span className="glyphicon glyphicon-trash"></span></a>
                                        </td>
                                }


                            </tr>
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}