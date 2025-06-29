# ProCircleBE

## 🛠️ Getting Started

### 📦 Requirements
- Node.js (v18+)
- PostgreSQL
- Sequelize CLI

---

### 🚀 Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/procircle-be.git
cd procircle-be
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment

Create a `.env` file and add:

```env
APP_PORT=5050

DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=procircle_db
DB_HOST=127.0.0.1
DB_PORT=5432
```

#### 4. Create and Migrate the Database

```bash
createdb procircle_db
npx sequelize-cli db:migrate
```

---

### ⚙️ Running the App

```bash
npm run dev
```

Server will start at:  
**http://localhost:5050**

---

## 🧪 Testing Weekly Goal Pairing

### 1. Insert Test Users

Open `psql` and run:

```sql
INSERT INTO "Users" (id, username, email, password, "createdAt", "updatedAt")
VALUES 
(1, 'user1', 'user1@example.com', 'test123', NOW(), NOW()),
(2, 'user2', 'user2@example.com', 'test123', NOW(), NOW());
```

### 2. Insert Test Goals

```sql
INSERT INTO "goals" ("userId", goals, status, "createdAt", "updatedAt")
VALUES 
(1, ARRAY['Learn React', 'Build a portfolio'], 'pending', NOW(), NOW()),
(2, ARRAY['Learn React', 'Build a portfolio'], 'pending', NOW(), NOW());
```

### 3. Trigger Pairing (Postman or Curl)

Send a `POST` request to:

```
http://localhost:5050/api/v1/goals/pair-goals
```

---

### ✅ Success Criteria

- `status` updates to `in_progress`
- `pairedWith` is set to the matched user’s ID

---

## 📌 Next Steps (Optional Enhancements)

- Automate weekly pairing using `node-cron`
- Add `POST /goals` endpoint for frontend goal creation
- Add route to mark goals as `completed`
- Implement notifications for matched users


