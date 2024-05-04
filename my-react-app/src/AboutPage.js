import React from 'react';
import { Typography, Card, Button, Layout, ConfigProvider } from 'antd';
import 'antd/dist/reset.css'; // 引入Ant Design样式
import './App.css';

const { Title, Paragraph } = Typography;
const { Header, Content } = Layout;

const AboutPage = () => {
  return (
    <ConfigProvider>
      <Content style={{width: '150%', transform: 'translate(-15%, 0)'}}>
          <Card style={{ borderRadius: '8px', border: '8px solid lightblue'}}>
          <Title level={2} style={{ color: 'black',  display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Auto Job</Title>
          <Paragraph style={{fontSize: 20,}}>
              Automated Job Finder, or Auto Job (The Project) is a non-profit initiative that thrives to use simple technology to make big impact. Statistics show that public servants change positions every 18 months, and a sample survey confirms public servants take manual position search on a weekly basis. Starting with serving public servants, the Project aims to replace such manual search with a customized weekly report on the most recent job market. Unlike Seek/Indeed, the Project will provide much more specific customization including position classification, department, security clearance requirement, etc.
          </Paragraph>
          <Paragraph style={{fontSize: 20,}}>
              Apart from directly serving individuals, the Project seeks to collaborate with jurisdictions and universities to establish a smart connection between university students and the government job markets. Although the initial scope is mostly on public servant positions, the Project will scale to the general job market and bring benefit to the whole Australian labor force.
          </Paragraph>
          <Button type="primary" style={{marginLeft:'85%'}}>Learn More</Button>
          </Card>
      </Content>
    </ConfigProvider>
  );
};

export default AboutPage;