# website-node

Node.js + Express + MongoDB 账号服务端项目，提供邮箱注册、邮箱登录和已登录账号删除功能。

## 技术栈

- Node.js
- Express
- MongoDB / Mongoose
- JWT Bearer Token
- bcryptjs

## 环境变量

复制 `.env.example` 为 `.env`，并按需修改：

```bash
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/website_node
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

## 安装和启动

```bash
npm install
npm run dev
```

生产方式启动：

```bash
npm start
```

## 接口

### 健康检查

```http
GET /api/health
```

### 注册

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

成功返回 `201`：

```json
{
  "user": {
    "email": "user@example.com",
    "createdAt": "2026-07-06T00:00:00.000Z",
    "updatedAt": "2026-07-06T00:00:00.000Z",
    "id": "..."
  },
  "token": "..."
}
```

### 登录

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

成功返回 `200`，格式同注册接口。

### 删除当前账号

```http
DELETE /api/auth/me
Authorization: Bearer <token>
```

成功返回 `204`。

## 测试

```bash
npm test
```
