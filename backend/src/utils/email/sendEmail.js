// Helper to get the API key from either your env object configuration or process.env fallback
const getApiKey = () => {
  // If your central config maps it, use it. Otherwise fall back to raw process.env
  const key = process.env.BREVO_API_KEY;
  
  if (!key) {
    console.warn("⚠️ WARNING: BREVO_API_KEY is not defined in your environment variables!");
  }
  return key;
};

export const sendStaffInviteEmail = async (recipientEmail, temporaryPassword) => {
  if (!recipientEmail) {
    throw new Error("sendStaffInviteEmail: No recipient email provided");
  }

  const apiKey = getApiKey();

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey, 
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { 
          name: "ConWise Team", 
          email: "firomsahika2022@gmail.com" 
        },
        to: [{ email: recipientEmail }],
        subject: "You have been invited to join ConWise",
        htmlContent: `
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
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Brevo API error payload:", data);
      throw new Error(data.message || "Failed to dispatch email");
    }
    return data;
  } catch (error) {
    console.error("Brevo exception caught:", error.message);
    throw error;
  }
};

export const sendVerificationEmail = async (to, code) => {
  if (!to) throw new Error("sendVerificationEmail: No recipient email provided");

  const apiKey = getApiKey();

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "ConWise", email: "firomsahika2022@gmail.com" },
        to: [{ email: to }],
        subject: "Verify your Company Account",
        htmlContent: `
          <h1>Welcome to ConWise!</h1>
          <p>Please use the following code to verify your account:</p>
          <h2 style="letter-spacing: 5px; color: #4A90E2;">${code}</h2>
          <p>This code expires in 10 minutes.</p>
        `
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Brevo verification failed:", error);
    throw error;
  }
};