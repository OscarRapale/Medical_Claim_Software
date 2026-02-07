import { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Card,
  Typography,
  message,
  Popconfirm,
  Input,
  Select,
  Row,
  Col,
} from "antd";
import {
  DownloadOutlined,
  ReloadOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { claimsApi } from "../services/api";

const { Title, Text } = Typography;
const { Option } = Select;

const ClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await claimsApi.getAll();
      setClaims(response.data);
      setFilteredClaims(response.data);
    } catch (error) {
      message.error("Failed to fetch claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  useEffect(() => {
    let result = claims;

    // Apply search filter
    if (searchText) {
      result = result.filter(
        (claim) =>
          claim.claim_number.toLowerCase().includes(searchText.toLowerCase()) ||
          claim.patient_name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((claim) => claim.status === statusFilter);
    }

    setFilteredClaims(result);
  }, [searchText, statusFilter, claims]);

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await claimsApi.export();

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `claims_export_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Claims exported successfully!");
    } catch (error) {
      message.error("Failed to export claims");
    } finally {
      setExportLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await claimsApi.delete(id);
      message.success("Claim deleted successfully");
      fetchClaims();
    } catch (error) {
      message.error("Failed to delete claim");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "#faad14", bg: "#fffbe6", text: "Pending" },
      submitted: { color: "#1890ff", bg: "#e6f7ff", text: "In-Review" },
      denied: { color: "#ff4d4f", bg: "#fff2f0", text: "Rejected" },
      paid: { color: "#52c41a", bg: "#f6ffed", text: "Paid" },
    };
    return configs[status] || { color: "#d9d9d9", bg: "#fafafa", text: status };
  };

  const columns = [
    {
      title: "Claim ID",
      dataIndex: "claim_number",
      key: "claim_number",
      sorter: (a, b) => a.claim_number.localeCompare(b.claim_number),
      render: (text) => (
        <Text strong style={{ color: "#1a1f3c" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag
            style={{
              color: config.color,
              backgroundColor: config.bg,
              border: "none",
              borderRadius: "6px",
              padding: "4px 12px",
              fontWeight: 500,
            }}
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Patient Name",
      dataIndex: "patient_name",
      key: "patient_name",
      sorter: (a, b) => a.patient_name.localeCompare(b.patient_name),
    },
    {
      title: "Service Date",
      dataIndex: "service_date",
      key: "service_date",
      sorter: (a, b) => new Date(a.service_date) - new Date(b.service_date),
      render: (date) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => <Text strong>${parseFloat(amount).toFixed(2)}</Text>,
      align: "right",
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Delete this claim?"
          description="This action cannot be undone."
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#1a1f3c" }}>
          Claims
        </Title>
      </div>

      {/* Filters Card */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: "20px 24px" }}
      >
        <Row gutter={16} align="middle">
          <Col flex="300px">
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 8, fontSize: 12 }}
            >
              Claim ID
            </Text>
            <Input
              placeholder="Search claims..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: "8px" }}
              allowClear
            />
          </Col>
          <Col flex="200px">
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 8, fontSize: 12 }}
            >
              Status
            </Text>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%", borderRadius: "8px" }}
            >
              <Option value="all">All</Option>
              <Option value="pending">Pending</Option>
              <Option value="submitted">In-Review</Option>
              <Option value="denied">Rejected</Option>
              <Option value="paid">Paid</Option>
            </Select>
          </Col>
          <Col flex="auto" />
          <Col>
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 8, fontSize: 12 }}
            >
              &nbsp;
            </Text>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchClaims}
                loading={loading}
                style={{ borderRadius: "8px" }}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
                loading={exportLoading}
                style={{
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  border: "none",
                }}
              >
                Export CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Claims Table */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredClaims}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => (
              <Text type="secondary">
                Showing {range[0]}-{range[1]} of {total} claims
              </Text>
            ),
            style: { padding: "16px 24px", margin: 0 },
          }}
          style={{
            borderRadius: "12px",
            overflow: "hidden",
          }}
        />
      </Card>
    </div>
  );
};

export default ClaimsPage;
