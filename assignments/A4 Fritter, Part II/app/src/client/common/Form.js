import React from 'react';

class Form extends React.Component {

  constructor (props) {
    super(props);

    // is there just one child, or more; put in an array.
    const children =  props.children instanceof Array ?
                      props.children :
                      [ props.children ];

    this.childList = children.map(( child )=>{
      console.log(child.type);
      if ( child.type === 'input' ) {
        //pass onChange callback
        child.props.onChange = this.onChange.bind(this); 
      }

      return <li>{child}</li>;
    });

    this.state = props.state;

  }

  /**
  * Set child's field new state
  */
  onChange ( event ) {
    const name  = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    })
  }

  async onApply () {
    const state = await this.props.onApply( this.state );
    this.setState( state );
  }

  //TODO wrap in <dialog ...>?

  render () {
    return (
      <ul>
        {this.childList}
      </ul>
    )
  }
};

export default Form;
