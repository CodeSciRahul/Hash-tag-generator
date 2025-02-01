import { Extension } from "@tiptap/core";
import axios from "axios";
import { properties } from "../properties/properties";
import { systemPromt } from "../constant/systemPrompt";

const HashtagGenerator = Extension.create({
  name: "hashtagGenerator",

  //store generated hashtags
  addStorage() {
    return {
      hashtags: [],
    };
  },

  addCommands() {
    return {
      generateHashtags:
        (count = 5) =>
        async ({ editor }) => {
          const content = editor.getText();
          const hashtags = await generateDynamicHashtags(content, count);
                // ✅ Ensure hashtags are stored safely
                if (!Array.isArray(editor.storage.hashtags)) {
                  editor.storage.hashtags = [];
                }
      
                editor.storage.hashtags = hashtags;
      
                // ✅ Trigger an update
                editor.view.dispatch(editor.state.tr);
      
                return true;      
        },
    };
  },
});

async function generateDynamicHashtags(content, count = 5) {
  const apiKey = properties?.GEMINI_API_KEY;
  const apiUrl = `${properties?.GEMINI_API_URL}?key=${apiKey}`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [{ text: systemPromt(count) + "\n\nContent: " + content }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const textResponse =
      response.data.candidates[0]?.content?.parts[0]?.text || "";
    return textResponse.match(/[\w]+/g) || [];
  } catch (error) {
    console.error("Error generating hashtags:", error);
    return ["#error", "#failed"];
  }
}

export default HashtagGenerator;
