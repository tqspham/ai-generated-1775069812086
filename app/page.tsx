"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUsername("");
      setPassword("");
      router.push("/main-feed");
    }, 2000);
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!response.ok) throw new Error("Network response was not ok");
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (error: any) {
      setPostsError("Failed to load posts. Please try again.");
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      <div className="mt-8">
        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : postsError ? (
          <div>
            <p className="text-red-500">{postsError}</p>
            <button onClick={fetchPosts} className="text-blue-500 underline">
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="p-4 border rounded">
                <h2 className="font-bold">{post.title}</h2>
                <p>{post.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}