import React, { useState } from "react";
import { Avatar, List, Radio, Space } from "antd";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "10px",
      height: "10px",
      backgroundColor: "#000",
      border: "2px solid #fff",
      borderRadius: "100%",
      userSelect: "none",
      transform: "translate(-50%, -50%)",
    }}
  >
    <div
      style={{
        position: "absolute",
        background: "white",
        top: "10px",
        width: "max-content",
        fontSize: "14px",
      }}
    >
      {text}
    </div>
  </div>
);

const getlink = (item) =>
  `https://www.reddit.com/r/${item.subreddit}/comments/${item.id}/`;

const hasImage = (url) =>
  url.endsWith(".jpg") ||
  url.endsWith(".jpeg") ||
  url.endsWith(".png") ||
  url.endsWith(".svc") ||
  url.endsWith(".bitmap");

const Pagenation = ({ data }) => {
  return (
    <>
      <Space
        direction="vertical"
        style={{
          marginBottom: "20px",
        }}
        size="middle"
      ></Space>

      <List
        pagination={{
          position: "bottom",
          align: "center",
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            extra={
              <div style={{ marginLeft: "20px", height: "20vh", width: "20%" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: "AIzaSyCzkLfL6vg4IltmtLJ1GtFupPX2yDO_R_g",
                  }}
                  defaultCenter={{
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng),
                  }}
                  defaultZoom={11}
                >
                  <AnyReactComponent
                    backgroundColor="blue"
                    lat={item.lat}
                    lng={item.lng}
                    text=""
                  />
                </GoogleMapReact>
              </div>
            }
          >
            <List.Item.Meta
              avatar={
                hasImage(item.url) && (
                  <a href={getlink(item)} target="_blank">
                    <img width={240} src={item.url} />
                  </a>
                )
              }
              title={
                <a href={getlink(item)} target="_blank">
                  {item.title}
                </a>
              }
              description={
                <a
                  className="content"
                  style={{ color: "black" }}
                  href={getlink(item)}
                  target="_blank"
                >
                  {item.content}
                </a>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
export default Pagenation;
