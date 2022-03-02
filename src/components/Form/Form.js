import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Input, Button, Card, Descriptions, Alert, List } from 'antd';
import { GlobalOutlined, HomeOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Moment from 'moment';

function SearchForm() {
  const [form] = Form.useForm();
  const apiKey = '1c320f08fbaeca062433950d74c22985';
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchHistory, setHistory] = useState([]);

  Moment.locale('ms-MY');

  const onFinish = (values) => {
    console.log('Finish:', values);
    setLoading(true);
    console.log(`api.openweathermap.org/data/2.5/weather?q=${values.city},${values.country}&appid=${apiKey}`)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${values.city},${values.country}&appid=${apiKey}`)
      .then(res => {
        if (!res.ok) {
          setLoading(false);
          setCity(null);
          setError(true);
          return;
        }
        return res.json()
      })
      .then(
        (result) => {
          setLoading(false);
          if (result) {
            setCity(result);
            setError(false);
            setHistory([...searchHistory, { city: result.name, country: result.sys.country, time: Moment(new Date()).format('yyyy-MM-DD hh:mma') }])
          }
        }
      )
  };

  return (
    <>
      <div className="row mb-4">
        <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
          <Form.Item
            name="city"
            rules={[
              {
                required: true,
                message: 'Please input your city',
              },
            ]}
          >
            <Input prefix={<HomeOutlined className="site-form-item-icon" />} placeholder="City" />
          </Form.Item>
          <Form.Item
            name="country"
            rules={[
              {
                required: true,
                message: 'Please input your country',
              },
            ]}
          >
            <Input
              prefix={<GlobalOutlined className="site-form-item-icon" />}
              placeholder="Country" maxLength="2"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            Search
          </Button>
          <Button disabled={loading}
            className="ms-2"
            onClick={() => {
              form.setFieldsValue();
            }}
          >
            Clear
          </Button>
        </Form>
      </div>
      {
        city &&
        <div className="row col-6 mb-4" >
          <Card>
            <h6>{city.name}, {city.sys.country}</h6>
            <h2>{city.weather[0].main}</h2>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Description">{city.weather[0].description}</Descriptions.Item>
              <Descriptions.Item label="Temperature">{city.main.temp_min} ~ {city.main.temp_max}</Descriptions.Item>
              <Descriptions.Item label="Humidity">{city.main.humidity}%</Descriptions.Item>
              <Descriptions.Item label="Time">  {Moment(new Date()).format('yyyy-MM-DD hh:mma')}</Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      }
      {
        error &&
        <div className="row mb-4" >
          <Alert message="Not found" type="error" />
        </div>
      }
      <div className="row col-6">
        <List
          header={<div className='fw-bold'>Search History</div>}
          itemLayout="horizontal"
          bordered
          dataSource={searchHistory}
          renderItem={item => (
            <List.Item
              actions={[<Button disabled={loading}
                type="primary" shape="circle" icon={<SearchOutlined />}
                onClick={() => {
                  form.setFieldsValue({
                    city: item.city,
                    country: item.country
                  });
                  form.submit();
                }}
              >
              </Button>, <Button disabled={loading}
                type="danger" shape="circle" icon={<DeleteOutlined />}
                onClick={() => {
                  setHistory(searchHistory.filter(x => x !== item));
                }}
              >
              </Button>]}
            >
              <List.Item.Meta
                title={<div>{item.city},{item.country}</div>}
              />
              <div>{item.time}</div>
            </List.Item>
          )}
        />
      </div>
    </>
  );
}

export default SearchForm;
