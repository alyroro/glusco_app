import { useEffect, useState } from "react";
import { getAllForum } from "../api/userForum";
import { Forum } from "../types/ForumDB";

export const useGetAllForms = () => {
  const [forumData, setForumData] = useState<Forum[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchForumData = async () => {
    // We don't necessarily want to set loading(true) every time
    // if we want a "silent" background refresh, but for
    // pull-to-refresh, it's fine.
    const { data, error } = await getAllForum();

    if (!error) {
      setForumData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchForumData();
  }, []);

  return {
    forumData,
    forumLoading: loading,
    refreshForumData: fetchForumData, // Exposed for UserContext
  };
};
