export async function sendWhatsAppText(phone: string, text: string) {
    const url = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE_NAME;

    if (!url || !apiKey || !instance) {
        console.warn("Evolution API credentials missing. Please set EVOLUTION_API_URL, EVOLUTION_API_KEY, and EVOLUTION_INSTANCE_NAME in .env");
        console.log("Debug Env:", { url, apiKey: apiKey ? "***" : "missing", instance });
        return;
    }

    console.log(`Sending WhatsApp to ${phone} via ${instance}...`);

    // Format phone: remove non-digits
    let formattedPhone = phone.replace(/[^0-9]/g, "");

    // Simple formatting for TR numbers (standardize to 905xxxxxxxxx)
    if (formattedPhone.startsWith("0")) {
        formattedPhone = formattedPhone.substring(1);
    }
    if (formattedPhone.length === 10) {
        formattedPhone = "90" + formattedPhone;
    }

    try {
        // Evolution API v2 sendText endpoint
        const endpoint = `${url}/message/sendText/${instance}`;

        console.log("Sending WhatsApp Request:", {
            endpoint,
            phone: formattedPhone,
            textLength: text.length
        });

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": apiKey
            },
            body: JSON.stringify({
                number: formattedPhone,
                text: text,
                delay: 1200,
                linkPreview: true
            })
        });

        console.log("Evolution API Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Evolution API Error:", errorText);
            console.error("Endpoint:", endpoint);
        } else {
            const successData = await response.json();
            console.log("Evolution API Success:", successData);
        }
    } catch (error) {
        console.error("Evolution API Request Failed - Catch Block:", error);
    }
}
