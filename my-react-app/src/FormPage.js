import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ConfigProvider,
  Form,
  Input,
  Button,
  message,
  Layout,
  Menu,
  Card,
  Select,
  Typography,
} from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import 'antd/dist/reset.css';
import './index.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const FormPage = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
      try {
        const response = await fetch('http://localhost:3001/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          const result = await response.json();
          console.log('Submission result:', result);
          message.success('Form submitted successfully!');
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        message.error('Form submission failed!');
      }
    };  
  
    return (
      <ConfigProvider locale={zhCN}>
        <Content style={{width: '150%', transform: 'translate(-15%, 0)'}}>
          <Card style={{ borderRadius: '8px', border: '8px solid lightblue'}}>
            <Title level={2} style={{ color: 'black',  display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Application Form</Title>
            <div className="site-layout-content" style={{ margin: '30px auto', maxWidth: 600 }}>
              <Form form={form} name="user-info" onFinish={onFinish} autoComplete="off">
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not a valid email!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="name"
                  label="Name"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="keywords"
                  label="Keywords"
                  rules={[{ required: true, message: 'Please input at least one keyword!' }]}
                >
                  <Select mode="tags" style={{ width: '100%' }} placeholder="Input keywords">
                    {/* Dynamically generated options, if necessary */}
                  </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Content>
      </ConfigProvider>
    );
};

export default FormPage;