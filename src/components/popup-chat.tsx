import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send, Heart, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CommunityFeed() {
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [inputText, setInputText] = useState("");
  const [inputComment, setInputComment] = useState("");
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [name, setName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);

  // Load posts and name from localStorage when the component mounts
  useEffect(() => {
    const savedPosts = localStorage.getItem("communityPosts");
    const savedName = localStorage.getItem("userName");

    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        if (Array.isArray(parsedPosts)) {
          setPosts(parsedPosts);
          console.log("Posts loaded from localStorage:", parsedPosts);
        }
      } catch (error) {
        console.error("Failed to parse posts from localStorage:", error);
      }
    }

    if (savedName) {
      setName(savedName);
      setIsNameSet(true);
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("communityPosts", JSON.stringify(posts));
      console.log("Posts saved to localStorage:", posts);
    }
  }, [posts]);

  // Save name to localStorage when it's set
  useEffect(() => {
    if (isNameSet) {
      localStorage.setItem("userName", name);
      console.log("Name saved to localStorage:", name);
    }
  }, [name, isNameSet]);

  const addPost = () => {
    if (inputText.trim()) {
      const newPost = { text: inputText, sender: name, likes: 0, liked: false, comments: [] };
      setPosts([...posts, newPost]);
      setInputText("");
    }
  };

  const toggleLike = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].liked = !updatedPosts[index].liked;
    updatedPosts[index].likes += updatedPosts[index].liked ? 1 : -1;
    setPosts(updatedPosts);
  };

  const addComment = (index) => {
    if (inputComment.trim()) {
      const updatedPosts = [...posts];
      updatedPosts[index].comments.push({ text: inputComment, sender: name });
      setInputComment("");
      setSelectedPostIndex(null); // Reset the selected post
      setPosts(updatedPosts);
    }
  };

  // Asking for name before allowing posts
  const handleNameSubmit = () => {
    if (name.trim()) {
      setIsNameSet(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-96">
          <CardHeader className="flex flex-row justify-between items-center">
            <h3 className="font-semibold">Community Feed</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="h-80 overflow-y-auto">
            {!isNameSet ? (
              // Ask for the user's name before proceeding
              <div className="space-y-4">
                <h3 className="text-center font-semibold">
                  Please enter your name:
                </h3>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
                <Button onClick={handleNameSubmit} className="w-full">
                  Submit
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{post.sender}</div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleLike(index)}
                        >
                          <Heart
                            className={`h-4 w-4 ${post.liked ? "text-red-500" : "text-gray-400"}`}
                          />
                          {post.likes}
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg px-4 py-2 bg-green-700 text-white">
                      {post.text}
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="text-sm text-gray-300">
                            <strong>{comment.sender}:</strong> {comment.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Input */}
                    {selectedPostIndex === index ? (
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={inputComment}
                          onChange={(e) => setInputComment(e.target.value)}
                          placeholder="Add a reply..."
                          className="flex-grow"
                        />
                        <Button onClick={() => addComment(index)}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPostIndex(index)}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {isNameSet && (
            <CardFooter>
              <div className="flex w-full gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Share your goal or achievement..."
                  className="flex-grow"
                />
                <Button onClick={addPost}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
