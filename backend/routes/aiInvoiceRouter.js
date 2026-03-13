import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const aiInvoiceRouter = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.warn("No Gemini key is found in the .env");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MODEL_CANDIDATES = ["gemini-2.5-flash", "gemini-2.0-flash"];

function buildInvoicePrompt(promptText) {
  const invoiceTemplate = {
    invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    fromBusinessName: "",
    fromEmail: "",
    fromAddress: "",
    fromPhone: "",
    client: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
    items: [
      {
        id: "1",
        description: "",
        qty: 1,
        unitprice: 0,
      },
    ],
    taxPercent: 18,
    notes: "",
  };

  return `
You are an intelligent invoice generation assistant.

Your job is to read the user's text and extract invoice information into a JSON object.

Important extraction rules:

1. If the text contains words like "each", "per", "@", "price", or "cost", the number near those words is the unitprice.
2. If the user says something like:
   "200 ice creams at 10 each"
   then:
   qty = 200
   unitprice = 10
3. If currency symbols appear (₹, INR, Rs, $), ignore the symbol and return only the number.
4. Extract the product or service name as item description.
5. Never leave unitprice as 0 if a price is mentioned in the text.

Schema (must follow exactly):
${JSON.stringify(invoiceTemplate, null, 2)}

User Input:
${promptText}

Return ONLY valid JSON.
No explanations.
No markdown.
No code fences.
`;
}

// ............ai

async function tryGenerateWithModel(modelName, prompt) {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
  });

  let text =
    (response && typeof response.text === "string" && response.text) ||
    (response &&
      response.output &&
      Array.isArray(response.output) &&
      response.output[0] &&
      response.output[0].content &&
      Array.isArray(response.output[0].content) &&
      response.output[0].content[0] &&
      response.output[0].content[0].text) ||
    (response &&
      response.outputs &&
      Array.isArray(response.outputs) &&
      response.outputs[0] &&
      (response.outputs[0].text || response.outputs[0].content)) ||
    null;

  if (!text && response && Array.isArray(response.outputs)) {
    const joined = response.outputs
      .map((o) => {
        if (!o) return "";
        if (typeof o === "string") return o;
        if (typeof o.text === "string") return o.text;

        if (Array.isArray(o.content)) {
          return o.content.map((c) => (c && c.text) || "").join("\n");
        }

        return JSON.stringify(o);
      })
      .filter(Boolean)
      .join("\n\n");

    if (joined) {
      text = joined;
    }
  }

  if (!text && response) {
    try {
      text = JSON.stringify(response);
    } catch {
      text = String(response);
    }
  }

  if (!text || !String(text).trim()) {
    throw new Error("Empty text returned from model");
  }

  return {
    text: String(text).trim(),
    modelName,
  };
}

// aiInvoiceRouter.post('/generate', async (req, res)=> {
//   try {
// 		if(!API_KEY){
//       return res.status(500).json({
//         success: false,
// 				message: "Server configuration failed no key found"
// 			})
//     }
//     const { prompt } = req.body;
// 	   if (!prompt || !prompt.trim()){
//       return res.status(400).json({
//         success: false,
// 				message: "prompt text required"
// 			})
//     }
//     const fullPrompt = buildInvoicePrompt(prompt);
//     let lastErr = null;
//     let lastText = null;
//     let usedModel = null;

//     for (const m of MODEL_CANDIDATES) {
//       try {
//         const { text, modelName } = await tryGenerateWithModel(m, fullPrompt);
//         lastText = text;
//         usedModel = modelName;
//         if (text && text.trim()) break;
//       } catch (err) {
//         console.warn(`Model ${m} failed:`, err?.message || err);
//         lastErr = err;
//         continue;
//       }
//     }

//     if (!lastText) {
//       const errMsg =
//         (lastErr && lastErr.message) ||
//         "All candidate models failed. Check API key, network, or model availability.";
//       console.error("AI generation failed (no text):", errMsg);
//       return res.status(502).json({
//         success: false,
//         message: "AI generation failed",
// 		detail: errMsg
//       });
//     }

//     const text = lastText.trim();
//     const firstBrace = text.indexOf("{");
//     const lastBrace = text.lastIndexOf("}");
//     if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
//       console.error("AI response did not contain JSON object:", {
//         usedModel,
//       });
//       return res.status(502).json({
//         success: false,
//         message: "AI returned malformed response (no JSON found)",
//         raw: text,
// 		  model: usedModel
//       });
//     }
// 	  const jsonText = text.slice(firstBrace, lastBrace+1);
//     let data;
//     try {

// 		data= JSON.parse(jsonText);
//     } catch (parseErr) {
// 		console.error("Failed to parse JSON from AI response:", parseErr,{
//         model: usedModel,
// 			jsonText
// 			}
// 		);
//       return res.status(502).json({
//         success: false,
// 			message:"Ai returns invalid JSON",
//         model: usedModel,
// 			raw: text
//       });

;
//     }
//     return res.status(200).json({
//       success: true,
//       model: usedModel,
// 			data

// 	  	})
// 	}
// 	catch (error) {
// 		console.error("AI invoice generation error:", error);
//     return res.status(500).json({
// 			success:false,
//       message: "AI generation failed",
// 			detail: error?.message ||  String(error)
//     });
//   }
// });

aiInvoiceRouter.post("/generate", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Server configuration failed no key found",
      });
    }

    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "prompt text required",
      });
    }

    const fullPrompt = buildInvoicePrompt(prompt);

    let lastErr = null;
    let lastText = null;
    let usedModel = null;

    for (const m of MODEL_CANDIDATES) {
      try {
        const { text, modelName } = await tryGenerateWithModel(m, fullPrompt);

        lastText = text;
        usedModel = modelName;

        if (text && text.trim()) break;
      } catch (err) {
        console.warn(`Model ${m} failed:`, err?.message || err);
        lastErr = err;
        continue;
      }
    }

    if (!lastText) {
      const errMsg =
        (lastErr && lastErr.message) ||
        "All candidate models failed. Check API key, network, or model availability.";

      console.error("AI generation failed (no text):", errMsg);

      return res.status(502).json({
        success: false,
        message: "AI generation failed",
        detail: errMsg,
      });
    }

    const text = lastText.trim();

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      console.error("AI response did not contain JSON object:", { usedModel });

      return res.status(502).json({
        success: false,
        message: "AI returned malformed response (no JSON found)",
        raw: text,
        model: usedModel,
      });
    }

    const jsonText = text.slice(firstBrace, lastBrace + 1);

    let data;

    try {
      data = JSON.parse(jsonText);
      /* -------------------------
   UNIT PRICE FALLBACK FIX
--------------------------*/

      if (data.items && data.items.length > 0) {
        const item = data.items[0];

        if (!item.unitprice || item.unitprice === 0) {
          const pricePatterns = [
            /(\d+)\s*rupees?\s*each/i, // 55 rupees each
            /(\d+)\s*(?:each|per)/i, // 10 each
            /₹\s*(\d+)/i, // ₹10
            /rs\.?\s*(\d+)/i, // rs 10
            /inr\s*(\d+)/i, // inr 10
            /@\s*(\d+)/i, // @10
          ];

          for (const pattern of pricePatterns) {
            const match = prompt.match(pattern);

            if (match) {
              item.unitprice = Number(match[1]);
              break;
            }
          }
        }
      }
    } catch (parseErr) {
      console.error("Failed to parse JSON from AI response:", parseErr, {
        model: usedModel,
        jsonText,
      });

      return res.status(502).json({
        success: false,
        message: "AI returns invalid JSON",
        model: usedModel,
        raw: text,
      });
    }

    return res.status(200).json({
      success: true,
      model: usedModel,
      data,
    });
  } catch (error) {
    console.error("AI invoice generation error:", error);

    return res.status(500).json({
      success: false,
      message: "AI generation failed",
      detail: error?.message || String(error),
    });
  }
});

export default aiInvoiceRouter;
