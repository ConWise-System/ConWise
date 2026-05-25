// tests/messaging.test.js  ── TC-26 to TC-27
//
// Routes (server.js: app.use("/api/messaging", messagingRoutes)):
//   POST  /api/messaging/send              sendMessage
//   GET   /api/messaging/history            getChatHistory (query: projectId | receiverUserId)
//
// sendMessageSchema: { messageContent (min 1, max 2000), chatType (TEXT|IMAGE|FILE|SYSTEM),
//   projectId? (int), receiverUserId? (int) }
//   .refine: either projectId OR receiverUserId must be provided
//
// Chat model fields: senderUserId, projectId, messageContent, chatType, timestamp
// NOTE: schema.prisma Chat model does NOT have a receiverUserId column —
//   it only has senderUserId and projectId. The messaging.service.js
//   references receiverUserId for security check but the Chat.create
//   only stores projectId. Adjust test if your actual schema differs.

import { request, prisma, getAuth } from "./setup.js";

let pm, engineer, supervisor;
let projectId;

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const START = today.toISOString().split("T")[0];
const END = new Date(today.getTime() + 180 * 86400000)
  .toISOString()
  .split("T")[0];

beforeAll(async () => {
  pm = await getAuth("pm");
  engineer = await getAuth("engineer");
  supervisor = await getAuth("supervisor");

  const proj = await request
    .post("/api/projects")
    .set("Authorization", `Bearer ${pm.token}`)
    .send({
      projectName: "Messaging Test Project",
      location: "Adama",
      startDate: START,
      endDate: END,
      clientName: "Msg Client",
      projectBudget: 10000,
    });
  projectId = proj.body.data.id;
});

afterAll(async () => {
  await prisma.chat.deleteMany({ where: { projectId } });
  await prisma.projectProgress.deleteMany({ where: { projectId } });
  await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.$disconnect();
});

// ── TC-26 ─────────────────────────────────────────────────────────────────────
describe("TC-26 | User sends a project group message → 201", () => {
  it("returns 201 and message stored with correct content", async () => {
    const res = await request
      .post("/api/messaging/send")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        messageContent:
          "Team — site inspection tomorrow at 08:00. All present.",
        chatType: "TEXT",
        projectId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.messageContent).toBe(
      "Team — site inspection tomorrow at 08:00. All present.",
    );
    expect(res.body.data.senderUserId).toBe(pm.userId);

    // Verify in DB
    const db = await prisma.chat.findUnique({ where: { id: res.body.data.id } });
    expect(db).not.toBeNull();
    expect(db.projectId).toBe(projectId);
  });

  it("returns 400 if both projectId and receiverUserId are missing", async () => {
    const res = await request
      .post("/api/messaging/send")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        messageContent: "Message with no destination",
        chatType: "TEXT",
        // neither projectId nor receiverUserId — fails .refine()
      });

    expect(res.statusCode).toBe(400);
  });

  it("returns 400 for empty messageContent", async () => {
    const res = await request
      .post("/api/messaging/send")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        messageContent: "", // fails min(1)
        chatType: "TEXT",
        projectId,
      });

    expect(res.statusCode).toBe(400);
  });
});

// ── TC-27 ─────────────────────────────────────────────────────────────────────
describe("TC-27 | GET project chat history", () => {
  it("returns 200 with array of messages for the project", async () => {
    // Send a second message so history is non-empty
    await request
      .post("/api/messaging/send")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({
        messageContent: "Understood — I will be there at 08:00.",
        chatType: "TEXT",
        projectId,
      });

    const res = await request
      .get(`/api/messaging/history?projectId=${projectId}`)
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);

    // Messages ordered by timestamp ASC (getProjectHistory orderBy timestamp asc)
    const contents = res.body.data.map((m) => m.messageContent);
    expect(contents).toContain(
      "Team — site inspection tomorrow at 08:00. All present.",
    );
    expect(contents).toContain("Understood — I will be there at 08:00.");
  });

  it("returns 401 for unauthenticated request", async () => {
    const res = await request.get(`/api/messaging/history?projectId=${projectId}`);
    expect(res.statusCode).toBe(401);
  });
});
