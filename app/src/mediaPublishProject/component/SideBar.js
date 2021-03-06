/**
 * Created by a on 2018/3/8.
 */
import React, {Component} from 'react';

export default class HeadBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsPopup: false,
    };
  }

  onClick(key) {
    if (key === 'add' && this.props.isPopup) {
      return this.setState({IsPopup: true});
    } else if (key === 'general') {
      this.setState({IsPopup: false});
    }
    this.props.onClick && this.props.onClick(key);
  }

  render() {
    const {IsPopup} = this.state;
    const {isEdit, isPopup, formatIntl} = this.props;
    return <div className="sidebar">
      <div className="edit-container">
        <div className="glyphicon glyphicon-plus" title={formatIntl(isEdit?'mediaPublish.plan.add':'mediaPublish.scene.add')}
          onClick={(event) => {event.stopPropagation();event.preventDefault();this.onClick('add')}} role="presentation"></div>
        <div className="glyphicon icon_delete pull-right" title={formatIntl('app.delete')}
          onClick={() => this.onClick('remove')} role="presentation"></div>
        <div className="glyphicon glyphicon-arrow-down pull-right" title={formatIntl("app.move.down")}
          onClick={() => this.onClick('down')} role="presentation"></div>
        <div className="glyphicon glyphicon-arrow-up pull-right" title={formatIntl("app.move.up")}
          onClick={() => this.onClick('up')} role="presentation"></div>
        <div className={'glyphicon icon_edit pull-right ' + (isEdit ? '' : 'hidden')} title={formatIntl('mediaPublish.plan.edit')}
          onClick={() => this.onClick('edit')} role="presentation"></div>
      </div>
      <div className={'add-poppup ' + (IsPopup && isPopup ? 'active' : '')}>
        <span className="glyphicon glyphicon-triangle-top"></span>
        <span className="icon icon_mediaPublish_general"
          onClick={() => this.onClick('general')} role="presentation"></span>
        {/*<span className="icon icon_mediaPublish_cycle" onClick={()=>this.onClick("cycle")}></span>
                 <span className="icon icon_mediaPublish_regular" onClick={()=>this.onClick("regular")}></span>*/}
      </div>
      {this.props.children}
    </div>;
  }
}
