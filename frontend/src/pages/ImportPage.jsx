import { useState, useEffect } from "react";
import {
  Upload,
  Card,
  Typography,
  message,
  Table,
  Tag,
  Space,
  Alert,
  List,
  Row,
  Col,
} from "antd";
import {
  InboxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { claimImportsApi } from "../services/api";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const ImportPage = () => {
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastImportResult, setLastImportResult] = useState(null);

  const fetchImports = async () => {
    setLoading(true);
    try {
      const response = await claimImportsApi.getAll();
      setImports(response.data);
    } catch (error) {
      message.error("Failed to fetch import history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImports();
  }, []);

  const handleUpload = async (file) => {
    const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");
    if (!isCSV) {
      message.error("Please upload a CSV file");
      return false;
    }

    setUploading(true);
    setLastImportResult(null);

    try {
      const response = await claimImportsApi.upload(file);
      const result = response.data;

      setLastImportResult(result);

      if (result.errors.length === 0) {
        message.success(
          `Successfully imported ${result.processed_count} claims!`,
        );
      } else {
        message.warning(
          `Imported ${result.processed_count} claims with ${result.errors.length} errors`,
        );
      }

      fetchImports();
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to import file";
      message.error(errorMsg);
    } finally {
      setUploading(false);
    }

    return false;
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        color: "#52c41a",
        bg: "#f6ffed",
        icon: <CheckCircleOutlined />,
      },
      failed: {
        color: "#ff4d4f",
        bg: "#fff2f0",
        icon: <CloseCircleOutlined />,
      },
      pending: {
        color: "#faad14",
        bg: "#fffbe6",
        icon: <ClockCircleOutlined />,
      },
    };
    return configs[status] || configs.pending;
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag
            icon={config.icon}
            style={{
              color: config.color,
              backgroundColor: config.bg,
              border: "none",
              borderRadius: "6px",
              padding: "4px 12px",
              fontWeight: 500,
            }}
          >
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
      render: (text) => (
        <Space>
          <FileTextOutlined style={{ color: "#6366f1" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Records",
      key: "records",
      width: 120,
      render: (_, record) => (
        <Text>
          <Text strong>{record.processed_records}</Text>
          <Text type="secondary"> / {record.total_records}</Text>
        </Text>
      ),
    },
    {
      title: "Imported At",
      dataIndex: "created_at",
      key: "created_at",
      width: 200,
      render: (date) =>
        new Date(date).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#1a1f3c" }}>
          Import Claims
        </Title>
      </div>

      <Row gutter={24}>
        {/* Upload Section */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "100%",
            }}
          >
            <Title level={4} style={{ marginTop: 0, color: "#1a1f3c" }}>
              Upload CSV File
            </Title>
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 24 }}
            >
              Upload a CSV file with the following columns: patient_first_name,
              patient_last_name, patient_dob, claim_number, service_date,
              amount, status
            </Text>

            <Dragger
              name="file"
              accept=".csv"
              beforeUpload={handleUpload}
              showUploadList={false}
              disabled={uploading}
              style={{
                background: "#fafafa",
                borderRadius: "12px",
                border: "2px dashed #d9d9d9",
                padding: "40px 20px",
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#6366f1", fontSize: 48 }} />
              </p>
              <p
                className="ant-upload-text"
                style={{ fontSize: 16, fontWeight: 500 }}
              >
                Click or drag CSV file to upload
              </p>
              <p className="ant-upload-hint" style={{ color: "#8c8c8c" }}>
                Only .csv files are supported
              </p>
            </Dragger>

            {uploading && (
              <Alert
                message="Processing..."
                description="Your file is being uploaded and processed."
                type="info"
                showIcon
                style={{ marginTop: 16, borderRadius: "8px" }}
              />
            )}

            {lastImportResult && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  message={
                    lastImportResult.errors.length === 0
                      ? "Import Successful"
                      : "Import Completed with Errors"
                  }
                  description={
                    <div>
                      <p style={{ margin: "8px 0" }}>
                        <Text strong>{lastImportResult.processed_count}</Text>{" "}
                        records processed
                      </p>
                      {lastImportResult.errors.length > 0 && (
                        <div>
                          <Text type="secondary">Errors:</Text>
                          <List
                            size="small"
                            dataSource={lastImportResult.errors.slice(0, 3)}
                            renderItem={(error) => (
                              <List.Item
                                style={{ padding: "4px 0", border: "none" }}
                              >
                                <Text type="danger" style={{ fontSize: 12 }}>
                                  {error}
                                </Text>
                              </List.Item>
                            )}
                          />
                          {lastImportResult.errors.length > 3 && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              ...and {lastImportResult.errors.length - 3} more
                              errors
                            </Text>
                          )}
                        </div>
                      )}
                    </div>
                  }
                  type={
                    lastImportResult.errors.length === 0 ? "success" : "warning"
                  }
                  showIcon
                  style={{ borderRadius: "8px" }}
                />
              </div>
            )}
          </Card>
        </Col>

        {/* Import History */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "100%",
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Title level={4} style={{ margin: 0, color: "#1a1f3c" }}>
                Import History
              </Title>
            </div>
            <Table
              columns={columns}
              dataSource={imports}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 5,
                showTotal: (total) => (
                  <Text type="secondary">{total} imports</Text>
                ),
                style: { padding: "12px 24px", margin: 0 },
              }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ImportPage;
