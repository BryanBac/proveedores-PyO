import { Component } from "react";
import styles from "../styles/modal.module.css";

export default class Modal extends Component {
    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <div class={styles.body}>
                <div>{this.props.children}</div>
            </div>
        );
    }
}