import { supabase } from "./client"; // Your supabase client init

export const getAllForum = async () => {
  const { data, error } = await supabase
    .from("forum")
    .select(
      `
      *,
      users (*),
      comments:comments(count),
      forum_likes: forum_likes(count)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching forums:", error);
    return { data: null, error };
  }

  // Formatting the counts for easier use in your UI
  const formattedData = data.map((post) => ({
    ...post,
    comment_count: post.comments[0]?.count || 0,
    forum_likes_count: post.forum_likes[0]?.count || 0,
  }));

  return { data: formattedData, error };
};
