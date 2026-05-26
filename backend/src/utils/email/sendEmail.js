// Helper to get the API key from your environment setup
const getApiKey = () => {
  const key = process.env.SENDGRID_API_KEY;
  
  if (!key) {
    console.warn("⚠️ WARNING: SENDGRID_API_KEY is not defined in your environment variables!");
  }
  return key;
};

export const sendStaffInviteEmail = async (recipientEmail, temporaryPassword) => {
  if (!recipientEmail) {
    throw new Error("sendStaffInviteEmail: No recipient email provided");
  }

  const apiKey = getApiKey();

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipientEmail }]
          }
        ],
        from: { 
          name: "ConWise Team", 
          email: "firomsa.hika@astu.edu.et" 
        },
        subject: "You have been invited to join ConWise",
        content: [
          {
            type: "text/html",
            value: `
              <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                <h2>Welcome to the Team!</h2>
                <p>Your administrator has created an account for you on the ConWise platform.</p>
                <p>Please use the temporary password below to log in for the first time:</p>
                <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px;">
                  <h2 style="letter-spacing: 2px; color: #2563eb; margin: 0;">${temporaryPassword}</h2>
                </div>
                <p style="margin-top: 20px;">We recommend changing your password immediately after logging in.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <small>If you weren't expecting this invite, please ignore this email.</small>
              </div>
            `
          }
        ]
      })
    });

    // SendGrid returns an empty body (202 Accepted) on absolute success
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("SendGrid API error payload:", errorData);
      throw new Error(errorData.errors?.[0]?.message || "Failed to dispatch email via SendGrid");
    }

    return { success: true, message: "Email dispatched successfully" };
  } catch (error) {
    console.error("SendGrid exception caught:", error.message);
    throw error;
  }
};

export const sendVerificationEmail = async (to, code) => {
  if (!to) throw new Error("sendVerificationEmail: No recipient email provided");

  const apiKey = getApiKey();

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }]
          }
        ],
        from: { name: "ConWise", email: "firomsahika2022@gmail.com" },
        subject: "Verify your Company Account",
        content: [
          {
            type: "text/html",
            value: `
              <h1>Welcome to ConWise!</h1>
              <p>Please use the following code to verify your account:</p>
              <h2 style="letter-spacing: 5px; color: #4A90E2;">${code}</h2>
              <p>This code expires in 10 minutes.</p>
            `
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("SendGrid verification failed payload:", errorData);
      throw new Error(errorData.errors?.[0]?.message || "Failed to dispatch verification email");
    }

    return { success: true };
  } catch (error) {
    console.error("SendGrid verification failed:", error.message);
    throw error;
  }
};