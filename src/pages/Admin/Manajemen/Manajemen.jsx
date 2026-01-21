import { useContext, useEffect, useMemo, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";

import ArsipSearch from "./components/ArsipSearch";
import EmptyState from "./components/EmptyState";

export default function ManajemenArsip() {
  const topbarCtx = useContext(TopbarContext);

  useEffect(() => {
    topbarCtx?.setTopbar((p) => ({
      ...p,
      title: "Manajemen Arsip",
      showSearch: false,
    }));
  }, [topbarCtx]);

  return (
    <div className="space-y-6">
      <ArsipSearch />
      <EmptyState />
    </div>
  );
}
