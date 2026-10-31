"use client";

import { useEffect, useState } from "react";
import { PostEditor } from "../PostEditor";

export default function NewPostPage() {
  const [token, setToken] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token") || "";
    setToken(saved);
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/posts";
    }
    return null;
  }

  return <PostEditor mode="new" token={token} />;
}
