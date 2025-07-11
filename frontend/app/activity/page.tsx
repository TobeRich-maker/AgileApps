"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { ActivityHeatmap } from "@/components/activity/activity-heatmap";

export default function ActivityPage() {
  return (
    <MainLayout>
      <ActivityHeatmap teamView={true} />
    </MainLayout>
  );
}
