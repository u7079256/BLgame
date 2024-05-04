import React from 'react';
import { Typography, Card, Button, Layout, ConfigProvider, Collapse, List } from 'antd';
import { Column } from '@ant-design/charts';
import 'antd/dist/reset.css'; // 引入Ant Design样式
import './App.css';

const { Title, Paragraph } = Typography;
const { Header, Content } = Layout;
const { Panel } = Collapse;

const HomePage = () => {
  // 示例数据：市场动态图表
  const marketData = [
    { category: 'Administration', jobs: 40 },
    { category: 'Healthcare', jobs: 30 },
    { category: 'Education', jobs: 20 },
    { category: 'Technology', jobs: 10 },
  ];

  // 图表配置
  const config = {
    data: marketData,
    xField: 'category',
    yField: 'jobs',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      category: { alias: 'Category' },
      jobs: { alias: 'Jobs' },
    },
  };

  // 示例数据：用户反馈统计
  const feedbackStats = '95% of our users find their job search experience improved.';

  // 示例数据：FAQ
  const faqData = [
    {
      title: 'How to register?',
      content: 'Users can register by clicking the Sign Up button on the top right corner.',
    },
    {
      title: 'How to customize job alerts?',
      content: 'After logging in, go to your profile settings to customize job alerts according to your preferences.',
    },
  ];

  // 示例数据：用户评价
  const reviewData = [
    {
      name: 'John Doe',
      background: 'Public Servant',
      review: 'This platform made my job search process much simpler and effective.',
    },
    {
      name: 'Jane Smith',
      background: 'University Student',
      review: 'I found an internship easily thanks to the customized job alerts.',
    },
  ];

  return (
    <ConfigProvider>
      <Content style={{width: '150%', transform: 'translate(-15%, 0)'}}>
        <Card style={{ borderRadius: '8px', border: '8px solid lightblue', marginBottom: '20px'}}>
          <div style={{paddingTop:'5%'}}>
            <Title level={2} style={{textAlign:'center'}}>Market Trends</Title>
            <Column {...config} />
          </div>
          <div style={{paddingTop:'10%'}}>
            <Title level={2} style={{textAlign:'center'}}>User Feedback Statistics</Title>
            <Paragraph>{feedbackStats}</Paragraph>
          <div style={{paddingTop:'10%'}}>
            <Title level={2} style={{textAlign:'center'}}>Frequently Asked Questions</Title>
            <Collapse accordion>
              {faqData.map(faq => (
                <Panel header={faq.title} key={faq.title}>
                  <Paragraph>{faq.content}</Paragraph>
                </Panel>
              ))}
            </Collapse>
          </div>
          </div>
          <div style={{paddingTop:'10%'}}>
            <Title level={2} style={{textAlign:'center'}}>User Reviews</Title>
            <List
              itemLayout="horizontal"
              dataSource={reviewData}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href="#">{item.name}</a>}
                    description={item.review}
                  />
                </List.Item>
              )}
            />
          </div>
        </Card>
      </Content>
    </ConfigProvider>
  );
};

export default HomePage;
