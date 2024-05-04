import React, { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import { Layout, Menu, Modal, Button, Form, Input, Image, Switch } from 'antd';
import { MailOutlined, AppstoreOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { Outlet, Link } from 'react-router-dom';
import './App.css';
import 'react-chat-widget/lib/styles.css';
import { Widget, addResponseMessage } from 'react-chat-widget';

const { Header, Content, Footer } = Layout;

const AuthForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true); // 新增状态来控制显示登录还是注册

  const toggleForm = () => {
    setIsLogin(!isLogin); // 切换表单
  };

  return (
    <Modal
      visible={visible}
      title={isLogin ? "Login" : "Register"} // 根据状态动态更改标题
      okText={isLogin ? "Login" : "Register"} // 根据状态动态更改确认按钮文本
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values, isLogin);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        {!isLogin && ( // 如果是注册表单，额外显示邮箱输入项
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={toggleForm}>
            {isLogin ? "Need an account? Register" : "Already have an account? Login"} 
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Chatbot = () => {
  useEffect(() => {
    addResponseMessage('Welcome to our website!');
  }, []);

  // 处理用户消息
  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // 现在这里只是输出到控制台，可以集成聊天机器人后端
    addResponseMessage("Your message is important to us! We'll be with you shortly.");
  };

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="AutoJob"
      subtitle="Q&A"
    />
  );
};

const AppLayout = () => {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  const handleWelcomeScreenFadeOut = () => {
    setShowWelcomeScreen(false); // 移除欢迎屏幕
  };

  const [visible, setVisible] = useState(false);

  const onCreate = (values, isLogin) => {
    console.log('Received values of form: ', values);
    console.log('Form type: ', isLogin ? "Login" : "Register");
    setVisible(false);
    // 在这里添加登录或注册逻辑
  };
  
  return (
    <div>
    {showWelcomeScreen && <WelcomeScreen onFadeOut={handleWelcomeScreenFadeOut}/>}
      <div className="main-content">
        <Layout className="layout">
          <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Menu theme='dark' mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1}}>
              <Menu.Item key="1" icon={<MailOutlined />}><Link to="/">Home</Link></Menu.Item>
              <Menu.Item key="2" icon={<AppstoreOutlined/>}><Link to="/form">Form</Link></Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}><Link to="/about">About</Link></Menu.Item>
              <Menu.Item key="4" icon={<LoginOutlined />} onClick={() => setVisible(true)}>Login/Register</Menu.Item>
            </Menu>
            <div style={{ marginLeft: 'auto' }}>
            <Image src="/sources/logo.png" alt="logo" style={{ maxWidth: '100px', maxHeight: '40px', borderRadius: '8px', border: '3px solid black' }} />
            </div>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <div className="site-layout-content" style={{ margin: '100px auto', maxWidth: 600 }}>
              <Outlet /> {/* 用于渲染匹配的路由组件 */}
            </div>
          </Content>
          <AuthForm
            visible={visible}
            onCreate={onCreate}
            onCancel={() => {
              setVisible(false);
            }}
          />
        </Layout>
      </div>
      <Chatbot />
      <Footer style={{ textAlign: 'center', background: 'black', color:'white'}}>AutoJob ©2024 Created by AutoJob ANU</Footer>
    </div>
  );
};

export default AppLayout;
