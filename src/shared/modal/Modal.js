import React, { Component } from 'react';

import './Modal.css';

export default class Modal extends Component {
    componentDidMount() {
        // No need to remove this listener because Modal never gets unmounted
        document.addEventListener("keydown", this.handleEscPress, false);
    }

    handleEscPress = event => {
        if (this.props.isOpen && event.keyCode === 27)
            this.props.close(event);
    }

    handleOverlayClick = event => {
        if (event.target === event.currentTarget)
            this.props.close(event);
    }

    render() {
        return (
            <div className={`modal-overlay ${this.props.isOpen ? 'open' : ''}`}
                onClick={this.handleOverlayClick}>

                <div className="Modal" role="dialog">
                    <div className="Modal__header">
                        {this.props.header}
                    </div>
                    <div className="Modal__content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}