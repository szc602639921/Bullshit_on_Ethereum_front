import React, { Component } from 'react';

class Dropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
        };

        this.name = '';

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    showMenu(event) {
        event.preventDefault();

        this.setState({ showMenu: true }, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu() {
        this.setState({ showMenu: false }, () => {
            document.removeEventListener('click', this.closeMenu);
        });
    }

    clickHandler(b) {
        var v = b.target.value;
        this.props.callback(v);
        this.name = v;
        this.forceUpdate()
    }

    render() {
        var cl = this.clickHandler;
        return (
            <div>
                <button onClick={this.showMenu}>
                    {this.name=='' ? this.props.name:this.name}
        </button>

                {
                    this.state.showMenu
                        ? (
                            <div className="menu">
                                     {this.props.list.map(function(listValue){
                                        return <button onClick={cl} value={listValue} key={listValue}> {listValue}</button>;
                                    })}

                            </div>
                        )
                        : (
                            null
                        )
                }
            </div>
        );
    }
}

export default Dropdown;