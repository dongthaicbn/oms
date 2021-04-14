import React from 'react';

import Header from '../header-login/Header'
import { Row, Col } from 'antd';
import Footer from '../footer-login/Footer'
import './ContainerLogin.scss'
export default function ContainerLogin(props) {
    return (
        <div className="wapper-login">
            <div className="container-login">
                <Header />
                <Row className="row-container" style={props.styleRowContainer}>
                    <Col xs={2} sm={6} md={6} />
                    <Col xs={20} sm={12} md={12} style={{justifyContent: 'center', display: 'flex'}}>
                        <div className="container-form" style={props.styleContainerForm}>
                            {props.children}
                        </div>
                    </Col>
                </Row>
                <Footer />
            </div>
        </div>
    )
}