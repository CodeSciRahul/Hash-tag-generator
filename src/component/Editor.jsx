import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HashtagGenerator from "../extension/hashtagGenerator";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

const Editor = () => {
  const [count, setCount] = useState(5);
  const [hashtags, setHashtags] = useState([]);
  const editor = useEditor({
    extensions: [StarterKit, HashtagGenerator],
    content: "<p>Write something...</p>",
  });

  // Update hashtags when editor.storage.hashtags changes
  useEffect(() => {
    if (!editor) return;
  
    const updateHashtags = () => {
      const storedHashtags = editor.storage?.hashtags || [];
      setHashtags(Array.isArray(storedHashtags) ? storedHashtags : []);
    };
  
    editor.on("transaction", updateHashtags);
  
    return () => {
      editor.off("transaction", updateHashtags);
    };
  }, [editor]);
  


  return (
    <Container maxWidth="md">
      <Card sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom className="font-bold text-center">
          AI-Powered Hashtag Generator
        </Typography>

        <CardContent>
          {/* Editor */}
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              minHeight: 300,
              padding: 2,
              "&:focus-within": { borderColor: "#1976d2" },
            }}
          >
            <EditorContent editor={editor} className="outline-1"/>
          </Box>

          {/* Controls */}
          <Box display="flex" gap={2} alignItems="center" mt={3}>
            <TextField
              label="Number of Hashtags"
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              size="small"
              sx={{ flex: 1 }}
              inputProps={{ min: 1, max: 10 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => editor?.commands.generateHashtags(count)}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Generate Hashtags
            </Button>
          </Box>

          {/* show hashtags */}
                    {/* Display Hashtags */}
                    {hashtags.length > 0 && (
            <Box className="mt-4 bg-gray-100 p-3 rounded-lg">
              <Typography variant="subtitle1" fontWeight="bold">
                Generated Hashtags:
              </Typography>
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Box>
          )}

        </CardContent>
      </Card>
    </Container>
  );
};

export default Editor;
